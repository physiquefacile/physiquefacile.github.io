#!/usr/bin/env python3
"""Build the online question bank from the LaTeX worksheets and tests.
Writes <site>/quiz-bank.js and <site>/quiz-img/*.svg.
Every multiple-choice question (\\choices + \\answer) becomes an auto-corrected item;
graphs are compiled to SVG with the same style as the PDFs."""
import re, os, sys, json, hashlib, subprocess, concurrent.futures as cf

SITE = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/physiquefacile.github.io/ap-math-tracker"
SRC = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(SITE, "quiz-img"); os.makedirs(IMG, exist_ok=True)
BUILD = "/tmp/claude-0/quizbuild"; os.makedirs(BUILD, exist_ok=True)

# ---------- small LaTeX helpers ----------
def group(s, i):
    """s[i] == '{' -> (content, index after the closing brace)"""
    assert s[i] == "{", s[i:i+30]
    d = 0
    for j in range(i, len(s)):
        if s[j] == "{": d += 1
        elif s[j] == "}":
            d -= 1
            if d == 0: return s[i+1:j], j + 1
    raise ValueError("unbalanced: " + s[i:i+60])

def args(s, i, n):
    out = []
    for _ in range(n):
        while s[i] in " \n\t": i += 1
        a, i = group(s, i); out.append(a)
    return out, i

def find_cmd(s, cmd, n):
    """all occurrences of \\cmd{..}{..} -> list of (start, end, [args])"""
    res, k = [], 0
    while True:
        k = s.find(cmd + "{", k)
        if k < 0: return res
        a, e = args(s, k + len(cmd), n); res.append((k, e, a)); k = e

GRAPH_RE = re.compile(r"\\begin\{center\}\s*\\begin\{tikzpicture\}.*?\\end\{tikzpicture\}\s*\\end\{center\}|\\begin\{tikzpicture\}.*?\\end\{tikzpicture\}", re.S)

def extract_graphs(s, macros):
    """remove graphs from s; return (text, [graph latex])"""
    graphs = []
    names = ["\\fgraph", "\\ggraph"] + ["\\" + m for m in re.findall(r"\\newcommand\{\\(\w+)\}\{\\gr\{", macros)]
    for name in sorted(set(names), key=len, reverse=True):
        if name in s and name in macros:
            graphs.append(name); s = s.replace(name, "")
    for k, e, a in reversed(find_cmd(s, "\\gr", 2)):
        graphs.insert(0, "\\gr{%s}{%s}" % (a[0], a[1])); s = s[:k] + s[e:]
    for m in reversed(list(GRAPH_RE.finditer(s))):
        g = m.group(0)
        g = re.sub(r"^\\begin\{center\}|\\end\{center\}$", "", g.strip()).strip()
        graphs.insert(0, g); s = s[:m.start()] + s[m.end():]
    return s, graphs

def tab2html(body):
    rows = [r.strip() for r in re.split(r"\\\\(?:\[[^\]]*\])?", body) if r.strip()]
    html = []
    for r in rows:
        r = r.replace("\\hline", "").replace("\\toprule", "").replace("\\midrule", "").replace("\\bottomrule", "").strip()
        if not r: continue
        html.append("<tr>" + "".join("<td>%s</td>" % c.strip() for c in r.split("&")) + "</tr>")
    return '<div class="tbl"><table>' + "".join(html) + "</table></div>"

def to_html(s):
    s = s.strip()
    s = re.sub(r"(?<!\\)%.*", "", s)
    # tables
    def tabrepl(m):
        body = m.group(0)
        i = body.index("\\begin{tabular}") + len("\\begin{tabular}")
        _, i = group(body, i)
        inner = body[i:body.rindex("\\end{tabular}")]
        return tab2html(inner)
    s = re.sub(r"\\begin\{tabular\}.*?\\end\{tabular\}", tabrepl, s, flags=re.S)
    s = re.sub(r"\\begin\{center\}|\\end\{center\}", "", s)
    s = re.sub(r"\\renewcommand\{\\arraystretch\}\{[^}]*\}", "", s)
    # enumerate -> list
    s = re.sub(r"\\begin\{enumerate\}(\[[^\]]*\])?", "<ol type='a'>", s).replace("\\end{enumerate}", "</ol>")
    s = re.sub(r"\\begin\{itemize\}", "<ul>", s).replace("\\end{itemize}", "</ul>")
    s = re.sub(r"\\item\s*", "<li>", s)
    for cmd, tag in (("\\textbf", "b"), ("\\emph", "em"), ("\\textit", "em"), ("\\textsf", "span")):
        while True:
            hits = find_cmd(s, cmd, 1)
            if not hits: break
            k, e, a = hits[0]; s = s[:k] + "<%s>%s</%s>" % (tag, a[0], tag) + s[e:]
    s = s.replace("\\nocalctext", "no calculator").replace("\\calctext", "calculator")
    s = s.replace("\\$", "\x00")             # escaped dollar signs are text, not math delimiters
    parts = re.split(r"(\$[^$]*\$)", s)   # text-mode commands only outside math ($...$ is left to KaTeX)
    for k in range(0, len(parts), 2):
        parts[k] = re.sub(r"\\(medskip|smallskip|bigskip|par|noindent|qquad|quad|hfill)\b", " ", parts[k])
        parts[k] = parts[k].replace("\\ ", " ").replace("\\,", " ").replace("\\;", " ")
        parts[k] = parts[k].replace("\\\\", "<br>").replace("~", "&nbsp;").replace("---", "—").replace("--", "–")
    for k in range(1, len(parts), 2): parts[k] = parts[k].replace("\x00", "\\text{\\textdollar}")   # a dollar sign that cannot close the formula
    s = "".join(parts)
    s = s.replace("\\%", "%").replace("\x00", "&#36;")
    s = re.sub(r"\s+", " ", s).strip()
    return s

# ---------- graph compilation ----------
def graph_svg(latex, pre):
    h = hashlib.sha1((pre + latex).encode()).hexdigest()[:12]
    out = os.path.join(IMG, h + ".svg")
    if os.path.exists(out): return h + ".svg", None
    tex = "\\documentclass[border=4pt]{standalone}\n\\usepackage{ap}\n" + pre + "\n\\providecommand{\\gr}{}\\renewcommand{\\gr}[2]{\\begin{tikzpicture}\\begin{axis}[gridaxis,#1]#2\\end{axis}\\end{tikzpicture}}\n\\begin{document}\n" + latex + "\n\\end{document}\n"
    base = os.path.join(BUILD, h)
    open(base + ".tex", "w").write(tex)
    r = subprocess.run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "-output-directory", BUILD, base + ".tex"],
                       capture_output=True, text=True, errors="ignore", env={**os.environ, "TEXINPUTS": ".:" + SRC + ":"})
    if r.returncode: return None, open(base + ".log", errors="ignore").read()[-600:]
    subprocess.run(["pdftocairo", "-svg", base + ".pdf", out], check=True)
    return h + ".svg", None

# ---------- parsing ----------
def blocks(path):
    txt = open(os.path.join(SRC, path)).read()
    parts = re.split(r"^%%DOC\s+(\S+)\s*\|\s*(.+)$", txt, flags=re.M)
    pre = "\n".join(l for l in parts[0].splitlines() if not l.startswith("%%"))
    return pre, [(parts[i], parts[i+1].strip(), parts[i+2]) for i in range(1, len(parts), 3)]

def questions(body, pre):
    """yield dicts for each multiple-choice question in a block, with graphs"""
    macros = pre
    out, ctx, last, strong = [], [], [], False
    pos = 0
    for m in re.finditer(r"\\begin\{exo\}", body):
        between = body[pos:m.start()]
        if "\\partheading" in between: ctx, strong = [], False
        _, g = extract_graphs(between, macros)
        if g: ctx = g; strong = bool(re.search(r"refer to the graph", between))
        end = body.index("\\end{exo}", m.end())
        ex = body[m.end():end]; pos = end + len("\\end{exo}")
        # header [topic]{calc}
        i = 0; topic = ""
        if ex.startswith("["):
            j = ex.index("]"); topic = ex[1:j]; i = j + 1
        hdr, i = group(ex, i)
        ex = ex[i:]
        if "\\choices{" not in ex:
            sp = find_cmd(ex, "\\spr", 3)
            if not sp: continue
            stem, g = extract_graphs(ex[:sp[0][0]], macros)
            if not g and ctx and (strong or re.search(r"graph", stem, re.I)): g = ctx
            if g: last = g
            shown, acc, expl = sp[0][2]
            out.append({"topic": topic, "calc": True, "stem": stem, "spr": [a.strip() for a in acc.split("|")],
                        "shown": shown, "e": expl, "graphs": g})
            continue
        k = ex.index("\\choices{")
        stem = ex[:k]
        ch, k2 = args(ex, k + len("\\choices"), 4)
        rest = ex[k2:]
        an = find_cmd(rest, "\\answer", 2)
        if not an: continue
        letter, expl = an[0][2]
        stem = stem.replace("\\begin{minipage}{\\linewidth}", "").replace("\\end{minipage}", "")
        stem, g = extract_graphs(stem, macros)
        if not g:
            if re.search(r"same graph|graphed above|Using the graph", stem, re.I): g = last or ctx
            elif ctx and (strong or re.search(r"graph", stem, re.I)): g = ctx
        if g: last = g
        out.append({"topic": topic, "calc": "calcreq" in hdr, "stem": stem, "choices": ch,
                    "a": "ABCD".index(letter.strip()), "e": expl, "graphs": g})
    return out

def unit_test_questions(path, pre):
    """questions from a unit practice file (Parts A and B only)"""
    txt = open(os.path.join(SRC, path)).read()
    a = txt.index("\\partheading{Part A"); c = txt.index("\\partheading{Part C")
    return questions(txt[a:c], pre)

# ---------- quiz definitions ----------
QUIZZES = []
def add(qid, course, unit, title, kind, qs, pre, minutes=None, lesson=None):
    QUIZZES.append(dict(id=qid, course=course, unit=unit, title=title, kind=kind, minutes=minutes, lesson=lesson, qs=qs, pre=pre))

for course, file, cname in (("pc", "pc-u1-worksheets.tex", "AP Precalculus"), ("ab", "ab-u1-worksheets.tex", "AP Calculus AB")):
    pre, bl = blocks(file)
    by = {}
    order = []
    for i, title, body in bl:
        if i.startswith(("SC", "PRETEST", "FIXUP")):
            qs = questions(body, pre)
            kind = "test" if i.startswith(("PRETEST", "FIXUP")) else "quiz"
            nice = re.sub(r"\\textbullet\\?\s*", "· ", title)
            add(f"{course}-u1-{i}", course, "u1", nice, kind, qs, pre, minutes=(2*len(qs)+5 if kind == "test" else None))
            continue
        lesson = i[:-4] if i.endswith("MEGA") else i[:-1]
        if lesson not in by: by[lesson] = (title, []); order.append(lesson)
        by[lesson][1].extend(questions(body, pre))
    qfile = f"{course}-u1-quizzes.tex"          # online quizzes written to match the guided notes (preferred when present)
    if os.path.exists(os.path.join(SRC, qfile)):
        qpre, qbl = blocks(qfile)
        for i, title, body in qbl:
            qs = questions(body, qpre)
            if i == "QTEST":
                add(f"{course}-u1-aptest", course, "u1", re.sub(r"\\textbullet\\?\s*", "· ", title), "test", qs, qpre, minutes=2*len(qs)+5)
            else:
                lesson = i[1:]
                add(f"{course}-u1-{lesson}", course, "u1", f"Lesson {lesson} · {title}", "quiz", qs, qpre, lesson=lesson)
        continue
    for lesson in order:
        title, qs = by[lesson]
        label = ("Review " + lesson[1:]) if lesson.startswith("R") else (("Topic " if course == "pc" else "Lesson ") + lesson)
        add(f"{course}-u1-{lesson}", course, "u1", f"{label} · {title}", "quiz", qs, pre, lesson=lesson)
    qs = unit_test_questions(f"{course}-u1-practice.tex", "")
    add(f"{course}-u1-aptest", course, "u1", "Unit 1 AP-style test · multiple choice", "test", qs, "", minutes=2*len(qs)+5)

# SAT Math: one domain per unit (d1 = Algebra ...); practice tests in unit "mt"
for dom in ("d1", "d2", "d3", "d4"):
    if not os.path.exists(os.path.join(SRC, f"sat-{dom}-worksheets.tex")): continue
    pre, bl = blocks(f"sat-{dom}-worksheets.tex")
    by, order = {}, []
    for i, title, body in bl:
        lesson = i[:-1]
        if lesson not in by: by[lesson] = (title, []); order.append(lesson)
        by[lesson][1].extend(questions(body, pre))
    for lesson in order:
        title, qs = by[lesson]
        for q in qs: q["calc"] = True
        add(f"sat-{dom}-{lesson}", "sat", dom, f"Skill {lesson} · {title}", "quiz", qs, pre, lesson=lesson)
if os.path.exists(os.path.join(SRC, "sat-mt-worksheets.tex")):
    pre, bl = blocks("sat-mt-worksheets.tex")
    mods = {}
    for i, title, body in bl:
        m = re.match(r"MT(\d+)(M1|H|E)$", i)
        n, part = m.group(1), {"M1": "m1", "H": "hard", "E": "easy"}[m.group(2)]
        qs = questions(body, pre)
        for q in qs: q["calc"] = True
        mods.setdefault(n, {})[part] = qs
    for n, md in sorted(mods.items()):
        add(f"sat-mt-{n}", "sat", "mt", f"Practice Test {n} · full adaptive test (2 modules)", "sat", md["m1"], pre, minutes=35)
        QUIZZES[-1]["modules"] = md; QUIZZES[-1]["cut"] = 13

# ---------- compile graphs, write bank ----------
jobs = {}
for qz in QUIZZES:
    for q in qz["qs"] + [q for qs in (qz.get("modules") or {}).values() for q in qs]:
        for g in q["graphs"]:
            jobs[(qz["pre"], g)] = None
def comp(key):
    pre, g = key
    return key, graph_svg(g, pre)
with cf.ThreadPoolExecutor(8) as ex:
    for key, (name, err) in ex.map(comp, jobs):
        jobs[key] = name
        if err: print("GRAPH ERROR", key[1][:80], err[-300:])

def item(q, pre):
    it = {"q": to_html(q["stem"]), "e": to_html(q["e"]), "calc": q["calc"], "topic": q["topic"],
          "img": [jobs[(pre, g)] for g in q["graphs"] if jobs.get((pre, g))]}
    if "spr" in q: it["spr"] = q["spr"]; it["ans"] = to_html(q["shown"])
    else: it["c"] = [to_html(c) for c in q["choices"]]; it["a"] = q["a"]
    return it
bank = []
for qz in QUIZZES:
    items = []
    for q in qz["qs"]:
        items.append(item(q, qz["pre"]))
    if not items: continue
    b = {"id": qz["id"], "course": qz["course"], "unit": qz["unit"], "title": qz["title"], "kind": qz["kind"],
         "minutes": qz["minutes"], "lesson": qz["lesson"], "items": items}
    if qz.get("modules"):
        b["modules"] = {m: [item(q, qz["pre"]) for q in qs] for m, qs in qz["modules"].items()}
        b["cut"] = qz["cut"]; b["items"] = b["modules"]["m1"]
    bank.append(b)
FREE_UNITS = {"pc-u1", "ab-u1", "sat-mt"}   # free samples; every other unit is sealed with its unit key (see seal.py)
FREE_IDS = {"sat-d1-1.1"}                     # single free lessons inside a paid unit
isfree = lambda b: b["course"] + "-" + b["unit"] in FREE_UNITS or b["id"] in FREE_IDS
free = [b for b in bank if isfree(b)]
locked, chunks = [], {}
for b in bank:
    if isfree(b): continue
    u = b["course"] + "-" + b["unit"]
    chunks.setdefault(u, []).append(b)
    locked.append({k: b[k] for k in ("id", "course", "unit", "title", "kind", "minutes", "lesson")} | {"count": len(b["items"]), "file": f"quiz-paid/{u}.enc", "key": u})
if chunks:
    sys.path.insert(0, SRC); import seal
    os.makedirs(os.path.join(SITE, "quiz-paid"), exist_ok=True)
    for u, qs in chunks.items():
        open(os.path.join(SITE, "quiz-paid", u + ".enc"), "wb").write(seal.seal_bytes(json.dumps(qs, ensure_ascii=False).encode(), u))
open(os.path.join(SITE, "quiz-bank.js"), "w").write("/* generated by make_quiz.py — do not edit by hand */\nwindow.QUIZ_BANK=" + json.dumps(free, ensure_ascii=False, separators=(",", ":")) + ";\nwindow.QUIZ_LOCKED=" + json.dumps(locked, ensure_ascii=False, separators=(",", ":")) + ";\n")
n = sum(len(b["items"]) for b in bank)
print(f"{len(bank)} quizzes/tests, {n} questions, {len([v for v in jobs.values() if v])} graphs")
for b in bank: print(" ", b["id"], b["kind"], len(b["items"]), {m: len(v) for m, v in b.get("modules", {}).items()} or "")
