#!/usr/bin/env python3
"""Build guided notes (blank + filled) and worksheets (+ keys) for one unit.
usage: python3 build_docs.py pc-u1 "AP Precalculus" "Unit 1"
Sources: <base>-guided.tex and <base>-worksheets.tex, with blocks that start
  %%DOC <id> | <title>
Outputs in out/docs/: <base>-<id>-notes.pdf, <base>-<id>-notes-filled.pdf, <base>-<id>-ws.pdf, <base>-<id>-ws-key.pdf
(worksheet ids end with the letter, e.g. 1.2A -> <base>-1.2-wsA.pdf)."""
import re, sys, os, subprocess, concurrent.futures as cf
base, course, unit = sys.argv[1], sys.argv[2], sys.argv[3]
only = set(sys.argv[4:])
os.makedirs("build", exist_ok=True); os.makedirs("out/docs", exist_ok=True)
HEAD = "\\documentclass[11pt]{article}\n\\usepackage{ap}\n"
def blocks(path):
    if not os.path.exists(path): return "", []
    parts = re.split(r"^%%DOC\s+(\S+)\s*\|\s*(.+)$", open(path).read(), flags=re.M)
    pre = "\n".join(l for l in parts[0].splitlines() if not l.startswith("%%"))
    return pre, [(parts[i], parts[i+1].strip(), parts[i+2]) for i in range(1, len(parts), 3)]
def label(i):  # "R1.1-1.6" -> "Review 1.1-1.6"
    return ("Review " + i[1:]) if i.startswith("R") else (("Skill " if base.startswith("sat") else "Lesson ") + i)
jobs = []
pre, bl = blocks(f"{base}-guided.tex")
for i, title, body in bl:
    for key in (False, True):
        name = f"{base}-{i}-notes" + ("-filled" if key else "")
        if only and i not in only: continue
        kind = "Notes (filled in)" if key else "Guided notes"
        doc = HEAD + ("\\keytrue\n" if key else "\\keyfalse\n") + f"\\setdoc{{{course}}}{{{unit}}}{{{label(i)} \\textbullet\\ {kind}}}\n" + pre
        doc += "\n\\begin{document}\n" + f"\\titleband{{{(label(i).replace('Lesson ','Topic ') if '.' in i and not base.startswith('sat') else label(i))} \\textbullet\\ {title}}}{{{kind}" + ("" if key else " \\textbullet\\ Fill in the blanks and work the examples in the boxes") + "}\n" + body + "\n\\end{document}\n"
        jobs.append((name, doc))
pre, bl = blocks(f"{base}-worksheets.tex")
SATDIR = r"""\begin{directions}
These questions follow the format of the SAT Math section. A calculator is allowed on every question (Desmos is built into the digital SAT). Multiple-choice questions have one best answer. For \textbf{student-produced responses}, write your answer on the line: a fraction or a decimal is accepted (for example $3/4$ or $0.75$); give negative answers with a minus sign; do not use mixed numbers.
\end{directions}
"""
WSDIR = r"""\begin{directions}
Answer every question. Multiple-choice questions have one best answer. On free-response questions, show your work and justify your answers. Questions labeled \nocalctext\ must be done without a calculator; questions labeled \calctext\ require a graphing calculator. For questions with a graph, read the values you need from the grid.
\end{directions}
"""
for i, title, body in bl:
    if i.startswith(("SC", "PRETEST", "FIXUP", "MT")):   # self checks and unit tests: id is the name, title is the heading
        if only and i not in only: continue
        for key in (False, True):
            name = f"{base}-{i}" + ("-key" if key else "")
            doc = HEAD + ("\\keytrue\n" if key else "\\keyfalse\n") + f"\\setdoc{{{course}}}{{{unit}}}{{{title.split(' |')[0]}" + (" \\textbullet\\ Answer key" if key else "") + "}\n" + pre + "\n" + "\n".join(l[6:] for l in body.splitlines() if l.startswith("%%PRE ")) + "\n"
            doc += "\n\\begin{document}\n" + f"\\titleband{{{title}}}{{" + ("Answer key with worked solutions" if key else "Name: \\rule{5cm}{0.4pt} \\quad Date: \\rule{2.5cm}{0.4pt}") + "}\n" + (SATDIR if base.startswith("sat") else WSDIR) + body + "\n\\end{document}\n"
            jobs.append((name, doc))
        continue
    lesson, letter = i[:-1], i[-1]
    if i.endswith("MEGA"): lesson, letter = i[:-4], "MEGA"
    if only and lesson not in only: continue
    for key in (False, True):
        name = f"{base}-{lesson}-ws{letter}" + ("-key" if key else "")
        kind = f"{'Practice' if base.startswith('sat') else 'Worksheet'} {lesson.lstrip('R')}{letter}" + (" \\textbullet\\ Answer key" if key else "")
        doc = HEAD + ("\\keytrue\n" if key else "\\keyfalse\n") + f"\\setdoc{{{course}}}{{{unit}}}{{{kind}}}\n" + pre
        doc += "\n\\begin{document}\n" + f"\\titleband{{{'Review ' if lesson.startswith('R') else ('Practice ' if base.startswith('sat') else 'Worksheet ')}{lesson.lstrip('R')}{letter} \\textbullet\\ {title}}}{{" + ("Answer key with worked solutions" if key else "Name: \\rule{5cm}{0.4pt} \\quad Date: \\rule{2.5cm}{0.4pt}") + "}\n" + (SATDIR if base.startswith("sat") else WSDIR) + body + "\n\\end{document}\n"
        jobs.append((name, doc))
def run(job):
    name, doc = job
    open(f"build/{name}.tex", "w").write(doc)
    env = {**os.environ, "TEXINPUTS": ".:" + os.getcwd() + ":"}
    for _ in range(2):
        r = subprocess.run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "-output-directory=build", f"build/{name}.tex"], capture_output=True, text=True, errors="ignore", env=env)
        if r.returncode:
            log = open(f"build/{name}.log", errors="ignore").read(); k = log.find("\n!"); return name, log[k:k+220]
    os.replace(f"build/{name}.pdf", f"out/docs/{name}.pdf"); return name, None
with cf.ThreadPoolExecutor(8) as ex:
    errs = [(n, e) for n, e in ex.map(run, jobs) if e]
for n, e in errs: print("ERROR", n, e)
print(f"{len(jobs)-len(errs)}/{len(jobs)} PDFs built")
