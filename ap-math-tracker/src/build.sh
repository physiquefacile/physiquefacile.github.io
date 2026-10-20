#!/bin/bash
# usage: ./build.sh pc-u1   -> pc-u1-notes.pdf, pc-u1-practice.pdf, pc-u1-key.pdf in out/
set -e
cd "$(dirname "$0")"; mkdir -p out
b=$1
run(){ pdflatex -interaction=nonstopmode -halt-on-error -jobname="$2" "$1" >/dev/null || { grep -m3 -A4 '^!' "$2.log"; exit 1; }; }
run $b-notes.tex $b-notes; run $b-notes.tex $b-notes
echo '\keyfalse' > mode.tex; run $b-practice.tex $b-practice; run $b-practice.tex $b-practice
echo '\keytrue'  > mode.tex; run $b-practice.tex $b-key; run $b-practice.tex $b-key
mv $b-notes.pdf $b-practice.pdf $b-key.pdf out/
for f in notes practice key; do printf "%s: %s pages\n" $f "$(pdfinfo out/$b-$f.pdf | awk '/Pages/{print $2}')"; done
