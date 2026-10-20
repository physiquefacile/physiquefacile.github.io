#!/usr/bin/env python3
"""Insert one graph-based multiple-choice question into each lesson block, before its free-response question.
Run once on pc-u1-lessons.tex and ab-u1-lessons.tex (it skips lessons that already contain '% graph-question')."""
import re, sys

def ax(opts, body, w="7.5cm", h="5.6cm"):
    return (r"\begin{center}\begin{tikzpicture}\begin{axis}[gridaxis,%s,width=%s,height=%s]" % (opts, w, h)
            + body + r"\end{axis}\end{tikzpicture}\end{center}")

OPEN = r"\node[circle,draw=apblue,fill=white,thick,inner sep=1.6pt] at (axis cs:%s){};"
DOT = r"\node[circle,fill=apblue,inner sep=1.6pt] at (axis cs:%s){};"
VA = r"\draw[apred,dashed,thick](axis cs:%s,-100)--(axis cs:%s,100);"
HA = r"\draw[apgold!80!black,dashed,thick](axis cs:-100,%s)--(axis cs:100,%s);"
C = r"\addplot[apblue,very thick,domain=%s,samples=%s]{%s};"

def q(text, graph, choices, ans, why):
    return ("% graph-question\n\\Needspace{12\\baselineskip}\n\\begin{exo}[graph]{}\n\\begin{minipage}{\\linewidth}\n" + text + "\n" + graph + "\n\\choices" +
            "".join("{%s}" % c for c in choices) + "\n\\end{minipage}\n\\answer{%s}{%s}\n\\end{exo}\n" % (ans, why))

PC = {
"1.1": q("The graph of $f(x)=-x^3+3x$ is shown, with turning points at $(-1,-2)$ and $(1,2)$. On which interval is $f$ both increasing and concave down?",
  ax("xmin=-2.5,xmax=2.5,ymin=-3.5,ymax=3.5", C % ("-2.2:2.2", 120, "-x^3+3*x") + DOT % "-1,-2" + DOT % "1,2" + DOT % "0,0"),
  ["$(-1,0)$", "$(0,1)$", "$(1,2)$", "$(-2,-1)$"], "B",
  "$f$ is increasing between its turning points, on $(-1,1)$. The graph bends downward (concave down) to the right of the inflection point $(0,0)$. Both hold on $(0,1)$."),
"1.2": q("The graph of $h$ consists of line segments through $(0,1)$, $(2,5)$, $(4,4)$ and $(6,0)$. What is the average rate of change of $h$ on $[0,4]$?",
  ax("xmin=-0.5,xmax=6.5,ymin=-0.5,ymax=5.5", r"\addplot[apblue,very thick] coordinates {(0,1)(2,5)(4,4)(6,0)};" + DOT % "0,1" + DOT % "4,4"),
  ["$\\dfrac34$", "$1$", "$2$", "$-\\dfrac12$"], "A",
  "From the graph, $h(0)=1$ and $h(4)=4$, so $\\dfrac{4-1}{4-0}=\\dfrac34$."),
"1.3": q("The graph of a quadratic function $f$ is shown. Its vertex is $(1,-4)$ and its zeros are $-1$ and $3$. What is the average rate of change of $f$ on $[1,3]$?",
  ax("xmin=-2.5,xmax=4.5,ymin=-4.5,ymax=5.5", C % ("-2:4", 100, "(x-1)^2-4") + DOT % "1,-4" + DOT % "3,0"),
  ["$-2$", "$4$", "$2$", "$0$"], "C",
  "$f(1)=-4$ and $f(3)=0$, so $\\dfrac{0-(-4)}{3-1}=2$. On $[-1,1]$ it is $-2$: the rate of change increases, as for any quadratic with $a>0$."),
"1.4": q("The graph of the polynomial $p(x)=\\frac14x^4-2x^2$ is shown. What is the absolute minimum value of $p$?",
  ax("xmin=-3.5,xmax=3.5,ymin=-5.5,ymax=3.5", C % ("-3.1:3.1", 150, "0.25*x^4-2*x^2") + DOT % "-2,-4" + DOT % "2,-4" + DOT % "0,0"),
  ["$0$", "$-2$", "$-5$", "$-4$"], "D",
  "The lowest points of the graph are the two local minima $(-2,-4)$ and $(2,-4)$; the graph rises without bound at both ends, so the absolute minimum value is $-4$."),
"1.5": q("The graph of a cubic polynomial $q$ is shown. It passes through $(0,2)$. Which could be $q(x)$?",
  ax("xmin=-3.5,xmax=2.5,ymin=-3.5,ymax=5.5", C % ("-2.6:2.1", 120, "(x+2)*(x-1)^2") + DOT % "0,2" + DOT % "-2,0" + DOT % "1,0"),
  ["$(x+2)(x-1)^2$", "$(x-2)(x+1)^2$", "$(x+2)^2(x-1)$", "$-(x+2)(x-1)^2$"], "A",
  "The graph crosses the axis at $x=-2$ (odd multiplicity), touches it at $x=1$ (even multiplicity) and rises to the right (positive leading coefficient). Check: $(0+2)(0-1)^2=2$."),
"1.6": q("The graph of a polynomial $r$ is shown. Its zeros are $\\pm1$ and $\\pm2$, and $r(0)=-2$. Which could be $r(x)$?",
  ax("xmin=-2.8,xmax=2.8,ymin=-3.5,ymax=2.5", C % ("-2.4:2.4", 150, "-(x^4-5*x^2+4)/2") + DOT % "0,-2"),
  ["$x^4-5x^2+4$", "$-x^3+4x$", "$-\\frac12\\left(x^4-5x^2+4\\right)$", "$\\frac12\\left(x^4-5x^2+4\\right)$"], "C",
  "Both ends of the graph go down: even degree, negative leading coefficient. Only (C) has these zeros, a negative leading coefficient, and $r(0)=-\\frac12(4)=-2$."),
"1.7": q("The graph of $r(x)=\\dfrac{-2x^2}{x^2+1}$ is shown. What is $\\displaystyle\\lim_{x\\to\\infty}r(x)$?",
  ax("xmin=-6.5,xmax=6.5,ymin=-3.5,ymax=1.5", C % ("-6.5:6.5", 150, "-2*x^2/(x^2+1)") + HA % ("-2", "-2")),
  ["$0$", "$-2$", "$-\\infty$", "$2$"], "B",
  "The graph levels off toward the dashed line $y=-2$. Algebraically, equal degrees give $\\frac{-2}{1}=-2$."),
"1.8": q("The graph of $r(x)=\\dfrac{(x+3)(x-2)}{x^2}$ is shown. It has zeros at $x=-3$ and $x=2$ and a vertical asymptote $x=0$. What is the solution set of $r(x)>0$?",
  ax("xmin=-7.5,xmax=7.5,ymin=-8.5,ymax=3.5", C % ("-7.5:-0.6", 200, "(x+3)*(x-2)/x^2") + C % ("0.55:7.5", 200, "(x+3)*(x-2)/x^2") + VA % ("0", "0") + DOT % "-3,0" + DOT % "2,0", w="8cm"),
  ["$(-3,2)$", "$(-3,0)\\cup(0,2)$", "$(-\\infty,-3)\\cup(2,\\infty)$", "$(2,\\infty)$"], "C",
  "The graph is above the $x$-axis to the left of $x=-3$ and to the right of $x=2$. Between them it is below the axis on both sides of the asymptote."),
"1.9": q("The graph of $r(x)=\\dfrac{1}{x^2-4}$ is shown, with vertical asymptotes $x=-2$ and $x=2$. Which statement is true?",
  ax("xmin=-5.5,xmax=5.5,ymin=-3.5,ymax=3.5", C % ("-5.5:-2.15", 120, "1/(x^2-4)") + C % ("-1.85:1.85", 150, "1/(x^2-4)") + C % ("2.15:5.5", 120, "1/(x^2-4)") + VA % ("-2", "-2") + VA % ("2", "2")),
  ["$\\lim_{x\\to2^-}r(x)=+\\infty$", "$\\lim_{x\\to2^+}r(x)=-\\infty$", "$\\lim_{x\\to-2^+}r(x)=+\\infty$", "$\\lim_{x\\to2^-}r(x)=-\\infty$"], "D",
  "Between the asymptotes the graph goes down without bound at both ends, so $\\lim_{x\\to2^-}r(x)=-\\infty$ and $\\lim_{x\\to-2^+}r(x)=-\\infty$. Outside them it goes up: $\\lim_{x\\to2^+}r(x)=+\\infty$."),
"1.10": q("The graph of a rational function $r$ is shown: a line with a hole at $(2,3)$. Which could be $r(x)$?",
  ax("xmin=-2.5,xmax=4.5,ymin=-1.5,ymax=5.5", C % ("-2.5:4.5", 2, "x+1") + OPEN % "2,3"),
  ["$\\dfrac{x^2-4}{x-2}$", "$\\dfrac{x+1}{x-2}$", "$\\dfrac{x^2-x-2}{x-2}$", "$x+1$"], "C",
  "$\\dfrac{x^2-x-2}{x-2}=\\dfrac{(x-2)(x+1)}{x-2}=x+1$ for $x\\neq2$, with a hole at $(2,3)$. Choice (A) is $x+2$ with a hole at $(2,4)$; (B) has an asymptote; (D) has no hole."),
"1.11": q("The graph of a cubic polynomial $p$ with leading coefficient $1$ is shown. Its zeros are $-1$, $0$ and $3$. Which is $p(x)$ in standard form?",
  ax("xmin=-2.5,xmax=4.5,ymin=-7.5,ymax=4.5", C % ("-1.6:3.7", 150, "x*(x+1)*(x-3)") + DOT % "1,-4"),
  ["$x^3-2x^2-3x$", "$x^3+2x^2-3x$", "$-x^3+2x^2+3x$", "$x^3-3x$"], "A",
  "$p(x)=x(x+1)(x-3)=x(x^2-2x-3)=x^3-2x^2-3x$. Check with the graph: $p(1)=1-2-3=-4$."),
"1.12": q("The graphs of $f$ (solid) and $g$ (dashed) are shown. Which is an equation for $g$ in terms of $f$?",
  ax("xmin=-0.5,xmax=4.5,ymin=-1.5,ymax=2.5", r"\addplot[apblue,very thick] coordinates {(0,0)(1,2)(3,2)(4,0)};\addplot[apred,very thick,dashed] coordinates {(0,1)(1,-1)(3,-1)(4,1)};\node[apblue,font=\small] at (axis cs:2,2.25){$f$};\node[apred,font=\small] at (axis cs:2,-1.25){$g$};"),
  ["$g(x)=-f(x)-1$", "$g(x)=f(-x)+1$", "$g(x)=-f(x)+1$", "$g(x)=-f(x+1)$"], "C",
  "Reflect $f$ over the $x$-axis and shift up 1: $(0,0)\\to(0,1)$, $(1,2)\\to(1,-1)$, $(3,2)\\to(3,-1)$, $(4,0)\\to(4,1)$."),
"1.13": q("A scatter plot of data is shown. Which type of function is the most appropriate model for the data?",
  ax("xmin=-0.5,xmax=5.5,ymin=-0.5,ymax=9", r"\addplot[only marks,mark=*,mark size=2pt,apblue] coordinates {(0,8.1)(1,4.9)(2,3.2)(3,2.9)(4,4.1)(5,7.2)};", w="7cm", h="5cm"),
  ["Linear", "Quadratic", "Constant", "Rational with a vertical asymptote"], "B",
  "The data decrease, reach a single minimum, then increase, in a roughly symmetric way. That is the behavior of a quadratic function."),
"1.14": q("The graph shows the volume $V(x)$, in cm$^3$, of an open box made from a $10$ cm by $16$ cm sheet with squares of side $x$ cm cut from the corners. Which value of $x$ gives the greatest volume?",
  ax("xmin=-0.3,xmax=5.5,ymin=-10,ymax=170,ytick distance=20,xlabel={$x$},ylabel={$V$}", C % ("0:5", 120, "x*(10-2*x)*(16-2*x)") + DOT % "2,144", w="7.5cm", h="6cm"),
  ["$x=1$", "$x=2$", "$x=3$", "$x=5$"], "B",
  "The highest point of the graph is at $x=2$, where $V(2)=2\\cdot6\\cdot12=144$ cm$^3$."),
}

AB = {
"1.1": q("The graph of the position $s(t)=t^2$ is shown with the secant line through the points where $t=1$ and $t=3$. What is the slope of this secant line (the average velocity on $[1,3]$)?",
  ax("xmin=-0.5,xmax=4,ymin=-1,ymax=10.5,ytick distance=2,xlabel={$t$},ylabel={$s$}", C % ("0:3.4", 80, "x^2") + r"\addplot[apred,thick,domain=0.4:3.5]{4*x-3};" + DOT % "1,1" + DOT % "3,9", w="6.5cm", h="6cm"),
  ["$4$", "$2$", "$8$", "$3$"], "A",
  "$s(1)=1$ and $s(3)=9$, so the slope is $\\dfrac{9-1}{3-1}=4$."),
"1.2": q("The graph of $f$ is shown. Which statement is true?",
  ax("xmin=-0.5,xmax=4.5,ymin=-0.5,ymax=5.5", C % ("0:2", 2, "x/2") + C % ("2:4", 2, "x+1") + OPEN % "2,1" + DOT % "2,3"),
  ["$\\lim_{x\\to2}f(x)=3$", "$\\lim_{x\\to2^-}f(x)=1$", "$\\lim_{x\\to2^-}f(x)=3$", "$\\lim_{x\\to2^+}f(x)=1$"], "B",
  "From the left, the graph approaches the open circle at height $1$. From the right it approaches $3$, so $\\lim_{x\\to2}f(x)$ does not exist."),
"1.3": q("Use the graph of $f$ above. What is $\\displaystyle\\lim_{x\\to-3^+}f(x)$?",
  "", ["$1$", "$-3$", "$0$", "It does not exist."], "A",
  "The graph starts at the filled point $(-3,1)$; as $x$ approaches $-3$ from the right, $f(x)=x+4$ approaches $1$."),
"1.4": q("The graph of $y=\\dfrac{\\sin x}{x}$ is shown; it has a hole at $x=0$. Which is the best estimate of $\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}$?",
  ax("xmin=-10.5,xmax=10.5,ymin=-0.5,ymax=1.5,xtick distance=2,ytick distance=0.5", C % ("-10.5:-0.05", 200, "sin(deg(x))/x") + C % ("0.05:10.5", 200, "sin(deg(x))/x") + OPEN % "0,1", w="8cm", h="4.8cm"),
  ["$0$", "$\\pi$", "$1$", "It does not exist."], "C",
  "The graph approaches the open circle at height $1$ from both sides, so the limit appears to be $1$ (this is proved with the squeeze theorem in Topic 1.8)."),
"1.5": q("The graphs of the lines $f$ (solid) and $g$ (dashed) are shown. What is $\\displaystyle\\lim_{x\\to1}f(x)\\,g(x)$?",
  ax("xmin=-1.5,xmax=3.5,ymin=-1.5,ymax=5.5", C % ("-1.5:3.5", 2, "x+2") + r"\addplot[apred,very thick,dashed,domain=-1.5:3.5]{2-x};\node[apblue,font=\small] at (axis cs:2.6,5){$f$};\node[apred,font=\small] at (axis cs:3,-0.5){$g$};" + DOT % "1,3" + DOT % "1,1"),
  ["$4$", "$2$", "$1$", "$3$"], "D",
  "From the graph, $\\lim_{x\\to1}f(x)=3$ and $\\lim_{x\\to1}g(x)=1$. By the product property the limit is $3\\cdot1=3$."),
"1.6": q("The graph of $f(x)=\\dfrac{x^2-4}{x-2}$ is shown. What is $\\displaystyle\\lim_{x\\to2}f(x)$?",
  ax("xmin=-2.5,xmax=4.5,ymin=-0.5,ymax=6.5", C % ("-2.5:4.5", 2, "x+2") + OPEN % "2,4"),
  ["$0$", "$4$", "$2$", "It does not exist."], "B",
  "The graph is the line $y=x+2$ with a hole at $(2,4)$. Algebraically, $\\dfrac{(x-2)(x+2)}{x-2}=x+2\\to4$."),
"1.7": q("The graph of $f(x)=\\dfrac{|x-1|}{x-1}$ is shown. What is $\\displaystyle\\lim_{x\\to1}f(x)$?",
  ax("xmin=-1.5,xmax=3.5,ymin=-2,ymax=2", C % ("-1.5:1", 2, "-1") + C % ("1:3.5", 2, "1") + OPEN % "1,-1" + OPEN % "1,1", h="4.5cm"),
  ["$1$", "$-1$", "$0$", "It does not exist."], "D",
  "The left-hand limit is $-1$ and the right-hand limit is $1$; they are not equal."),
"1.8": q("The graph of $f(x)=x^2\\sin\\frac1x$ is shown between the dashed graphs of $y=x^2$ and $y=-x^2$. What is $\\displaystyle\\lim_{x\\to0}f(x)$?",
  ax("xmin=-0.55,xmax=0.55,ymin=-0.3,ymax=0.3,xtick distance=0.25,ytick distance=0.1", C % ("-0.5:-0.002", 1500, "x^2*sin(deg(1/x))") + C % ("0.002:0.5", 1500, "x^2*sin(deg(1/x))") + r"\addplot[apgrey,dashed,thick,domain=-0.5:0.5]{x^2};\addplot[apgrey,dashed,thick,domain=-0.5:0.5]{-x^2};", w="7.5cm", h="5.5cm"),
  ["$0$", "$1$", "It does not exist because $f$ oscillates.", "$-1$"], "A",
  "$f$ oscillates, but it is trapped between $-x^2$ and $x^2$, which both approach $0$. By the squeeze theorem the limit is $0$."),
"1.9": q("Use the graph of $f$ above. What is $\\displaystyle\\lim_{x\\to-1^-}x\\,f(x)$?",
  "", ["$-1$", "$3$", "$-3$", "It does not exist."], "C",
  "$\\lim_{x\\to-1^-}x=-1$ and $\\lim_{x\\to-1^-}f(x)=3$, so the limit is $-3$."),
"1.10": q("The graph of $h$ is shown. What type of discontinuity does $h$ have at $x=1$?",
  ax("xmin=-2.5,xmax=4.5,ymin=-4.5,ymax=4.5", C % ("-2.5:0.75", 120, "1/(x-1)") + C % ("1.25:4.5", 120, "1/(x-1)") + VA % ("1", "1")),
  ["Removable", "Jump", "Infinite", "None; $h$ is continuous at $x=1$."], "C",
  "$\\lim_{x\\to1^-}h(x)=-\\infty$ and $\\lim_{x\\to1^+}h(x)=+\\infty$: an infinite discontinuity."),
"1.11": q("The graph of $f$ is shown. Which statement is true?",
  ax("xmin=-1.5,xmax=4.5,ymin=-1.5,ymax=2.5", C % ("-1.5:1", 2, "x") + C % ("1:3", 2, "2-x") + C % ("3:4.5", 2, "1") + OPEN % "3,-1" + DOT % "3,1" + DOT % "1,1"),
  ["$f$ is continuous at $x=3$ but not at $x=1$.", "$f$ is continuous at $x=1$ but not at $x=3$.", "$f$ is continuous at both $x=1$ and $x=3$.", "$f$ is continuous at neither $x=1$ nor $x=3$."], "B",
  "At $x=1$ both pieces meet at $(1,1)$: the limit is $1=f(1)$. At $x=3$ the left-hand limit is $-1$ and the right-hand limit is $1$, so the limit does not exist."),
"1.12": q("The graph of $f$ on $[-2,4]$ is shown; it has a hole at $x=1$. On which of the following intervals is $f$ continuous?",
  ax("xmin=-2.5,xmax=4.5,ymin=-0.5,ymax=5.5", C % ("-2:4", 100, "0.5*x^2-x+1") + OPEN % "1,0.5" + DOT % "-2,5" + DOT % "4,5", h="5cm"),
  ["$[-2,0]$", "$[0,2]$", "$[-2,4]$", "$[1,3]$"], "A",
  "$f$ is undefined at $x=1$, so it is not continuous on any interval that contains $1$. Only $[-2,0]$ avoids $x=1$."),
"1.13": q("For $x<2$, the graph of $f$ is the line shown, through $(0,1)$ and $(2,5)$. For $x\\ge2$, $f(x)=x^2+k$. For what value of $k$ is $f$ continuous at $x=2$?",
  ax("xmin=-0.5,xmax=3.5,ymin=-0.5,ymax=6.5", C % ("-0.5:2", 2, "2*x+1") + OPEN % "2,5" + DOT % "0,1", w="6cm", h="5cm"),
  ["$5$", "$-1$", "$9$", "$1$"], "D",
  "From the graph, $\\lim_{x\\to2^-}f(x)=5$. Continuity needs $f(2)=4+k=5$, so $k=1$."),
"1.14": q("The graph of $f(x)=\\dfrac{1}{(x+1)^2}$ is shown. Which describes $\\displaystyle\\lim_{x\\to-1}f(x)$?",
  ax("xmin=-4.5,xmax=2.5,ymin=-0.5,ymax=5.5", C % ("-4.5:-1.45", 120, "1/(x+1)^2") + C % ("-0.55:2.5", 120, "1/(x+1)^2") + VA % ("-1", "-1"), h="5cm"),
  ["$+\\infty$", "$-\\infty$", "$0$", "$1$"], "A",
  "The graph rises without bound on both sides of the asymptote $x=-1$."),
"1.15": q("The graph of $f(x)=\\dfrac{2x}{\\sqrt{x^2+1}}$ is shown with its two horizontal asymptotes. What is $\\displaystyle\\lim_{x\\to-\\infty}f(x)$?",
  ax("xmin=-8.5,xmax=8.5,ymin=-3,ymax=3,xtick distance=2", C % ("-8.5:8.5", 150, "2*x/sqrt(x^2+1)") + HA % ("2", "2") + HA % ("-2", "-2"), w="8cm", h="4.8cm"),
  ["$2$", "$0$", "$-2$", "$-\\infty$"], "C",
  "To the left the graph levels off toward $y=-2$. Algebraically, $\\sqrt{x^2}=-x$ for $x<0$, so $f(x)\\to\\frac{2x}{-x}=-2$."),
"1.16": q("The graph of the continuous function $f(x)=(x-1)(x-2)(x-3)+1$ on $[0,4]$ is shown with the line $y=1$ (dashed). How many values of $c$ in $[0,4]$ satisfy $f(c)=1$?",
  ax("xmin=-0.5,xmax=4.5,ymin=-5.5,ymax=7.5,ytick distance=2", C % ("0:4", 150, "(x-1)*(x-2)*(x-3)+1") + HA % ("1", "1") + DOT % "0,-5" + DOT % "4,7", w="7cm", h="6cm"),
  ["Exactly one, as guaranteed by the IVT", "Exactly two", "Three", "None"], "C",
  "The IVT guarantees at least one value, since $f(0)=-5<1<7=f(4)$. The graph shows that $f(c)=1$ at $c=1$, $2$ and $3$."),
}

def insert(path, table):
    s = open(path).read()
    parts = re.split(r"(^%%LESSON\s+\S+\s*\|.*$)", s, flags=re.M)
    out = [parts[0]]
    for i in range(1, len(parts), 2):
        head, body = parts[i], parts[i + 1]
        n = head.split()[1]
        if n in table and "% graph-question" not in body:
            k = body.index(r"\begin{exo}[Free response")
            body = body[:k] + table[n] + body[k:]
        out += [head, body]
    open(path, "w").write("".join(out))

insert("pc-u1-lessons.tex", PC)
insert("ab-u1-lessons.tex", AB)
print("inserted", len(PC), "+", len(AB))
