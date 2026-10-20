#!/usr/bin/env python3
"""Split a <course>-u<N>-lessons.tex file into one practice PDF and one answer-key PDF per lesson.
usage: python3 lessons.py ab-u1 "AP Calculus AB" "Unit 1"   -> out/lessons/<base>-l<lesson>-{practice,key}.pdf"""
import re, sys, os, subprocess, concurrent.futures as cf
base, course, unit = sys.argv[1], sys.argv[2], sys.argv[3]
src = open(f"{base}-lessons.tex").read()
parts = re.split(r"^%%LESSON\s+(\S+)\s*\|\s*(.+)$", src, flags=re.M)
pre, blocks = parts[0], [(parts[i], parts[i+1].strip(), parts[i+2]) for i in range(1, len(parts), 3)]
pre = "\n".join(l for l in pre.splitlines() if not l.startswith("%%"))
os.makedirs("build", exist_ok=True); os.makedirs("out/lessons", exist_ok=True)
HEAD = r"""\documentclass[11pt]{article}
\usepackage{ap}
"""
DIRECTIONS = r"""\begin{directions}
Questions 1 to 5 are multiple choice: choose the best of the four answer choices. Question 6 is free response: show your work and justify your answers. Questions labeled \nocalctext\ must be done without a calculator; questions labeled \calctext\ require a graphing calculator. For questions with a graph, read the values you need from the grid.
\end{directions}
"""
jobs = []
for n, title, body in blocks:
    for key in (False, True):
        kind = "key" if key else "practice"
        name = f"{base}-l{n}-{kind}"
        doc = HEAD + ("\\keytrue\n" if key else "\\keyfalse\n")
        doc += f"\\setdoc{{{course}}}{{{unit}}}{{Lesson {n} practice{' \\textbullet\\ Answer key' if key else ''}}}\n"
        doc += pre + "\n\\begin{document}\n"
        doc += f"\\titleband{{Lesson {n} \\textbullet\\ {title}}}{{5 multiple-choice questions and 1 free-response question{' \\textbullet\\ Answer key with explanations' if key else ''}}}\n"
        doc += DIRECTIONS
        doc += body + "\n\\end{document}\n"
        open(f"build/{name}.tex", "w").write(doc); jobs.append(name)
notes_src = f"{base}-lesson-notes.tex"
if os.path.exists(notes_src):
    ns = open(notes_src).read()
    nparts = re.split(r"^%%LESSON\s+(\S+)\s*\|\s*(.+)$", ns, flags=re.M)
    npre = "\n".join(l for l in nparts[0].splitlines() if not l.startswith("%%"))
    for i in range(1, len(nparts), 3):
        n, title, body = nparts[i], nparts[i+1].strip(), nparts[i+2]
        name = f"{base}-l{n}-notes"
        doc = HEAD + f"\\setdoc{{{course}}}{{{unit}}}{{Lesson {n} notes}}\n" + npre + "\n\\begin{document}\n"
        doc += f"\\titleband{{Lesson {n} \\textbullet\\ {title}}}{{Lesson notes \\textbullet\\ Learning goals, key ideas, worked examples, common mistakes, quick check}}\n"
        doc += body + "\n\\end{document}\n"
        open(f"build/{name}.tex", "w").write(doc); jobs.append(name)
def run(name):
    for _ in range(2):
        r = subprocess.run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", f"-output-directory=build", f"build/{name}.tex"],
                           capture_output=True, text=True, env={**os.environ, "TEXINPUTS": ".:" + os.getcwd() + ":"})
        if r.returncode:
            log = open(f"build/{name}.log").read(); i = log.find("\n!")
            return name, log[i:i+400]
    os.replace(f"build/{name}.pdf", f"out/lessons/{name}.pdf"); return name, None
with cf.ThreadPoolExecutor(8) as ex:
    errs = [(n, e) for n, e in ex.map(run, jobs) if e]
for n, e in errs: print("ERROR", n, e)
print(f"{len(jobs)-len(errs)}/{len(jobs)} PDFs built for {len(blocks)} lessons")
