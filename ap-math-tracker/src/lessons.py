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
\newcommand{\choices}[4]{\par\smallskip
  \begin{tabular}{@{}p{0.47\linewidth}p{0.47\linewidth}@{}}(A)\ #1 & (B)\ #2\\[3pt](C)\ #3 & (D)\ #4\end{tabular}\par}
\newcommand{\answer}[2]{\begin{solution}\textbf{Answer: (#1).} #2\end{solution}}
"""
jobs = []
for n, title, body in blocks:
    for key in (False, True):
        kind = "key" if key else "practice"
        name = f"{base}-l{n}-{kind}"
        doc = HEAD + ("\\keytrue\n" if key else "\\keyfalse\n")
        doc += f"\\setdoc{{{course}}}{{{unit}}}{{Lesson {n} practice{' \\textbullet\\ Answer key' if key else ''}}}\n"
        doc += pre + "\n\\begin{document}\n"
        doc += f"\\titleband{{Lesson {n} \\textbullet\\ {title}}}{{4 multiple-choice questions and 1 free-response question{' \\textbullet\\ Answer key with explanations' if key else ''}}}\n"
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
