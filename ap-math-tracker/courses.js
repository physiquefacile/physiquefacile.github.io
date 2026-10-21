/* AP Math Tracker — course library.
   Each unit lists its PDFs in `files` (names in ap-math-tracker/docs/<course>/, without ".pdf"):
     files:{notes:"u1-notes", practice:"u1-practice", key:"u1-key"}
   lessonFiles:"u1-l" means each lesson has <prefix><n>-practice.pdf and <prefix><n>-key.pdf (e.g. u1-l1.3-practice.pdf).
   Units without files are shown as "in preparation".
   Topic numbers and titles follow the College Board Course and Exam Descriptions. */
const L=(n,t,r)=>({n,t,r:r||{}});
/* lesson-plan units: W = lesson with guided notes (blank + filled) and worksheets; R = review with worksheets only.
   Files: docs/<course>/<plan><n>-notes.pdf, -notes-filled.pdf, -ws<letter>.pdf, -ws<letter>-key.pdf */
const ws=s=>Array.isArray(s)?s:s.split("");
const W=(n,t,s)=>({n,t,notes:true,ws:ws(s)});
const R=(n,t,s)=>({n,t,review:true,ws:ws(s)});
const T=(id,t)=>({id,t});
/* free:true marks the free sample unit; files of every other unit are encrypted (<name>.pdf.enc) and unlocked with the unit key */  /* self checks and unit tests: docs/<course>/<plan><id>.pdf and -key.pdf */
window.COURSE_LIB={
  pc:{
    name:"AP Precalculus",
    units:[
      {id:"u1",n:"1",t:"Polynomial and Rational Functions",free:true,files:{notes:"u1-notes",practice:"u1-practice",key:"u1-key"},plan:"u1-",lessons:[
        W("1.1","Change in Tandem","A"),
        W("1.2","Rates of Change","ABCD"),
        W("1.3","Rates of Change in Linear and Quadratic Functions","AB"),
        W("1.4","Polynomial Functions and Rates of Change","A"),
        W("1.5","Polynomial Functions and Complex Zeros","ABCDE"),
        W("1.6","Polynomial Functions and End Behavior","A"),
        R("R1.1-1.6","Review 1.1 to 1.6","ABCD"),
        W("1.7","Rational Functions and End Behavior","A"),
        W("1.8","Rational Functions and Zeros","A"),
        W("1.9-1.10","Rational Functions and Asymptotes","AB"),
        W("1.11","Rational Functions and Concept of Limit","AB"),
        R("R1.7-1.11","Review 1.7 to 1.11","AB"),
        W("1.12","Transformations of Functions",["A","B","C","MEGA"]),
        W("1.13-1.14","Function Model Construction","A")]},
      {id:"u2",n:"2",t:"Exponential and Logarithmic Functions",lessons:[
        L("2.1","Change in Arithmetic and Geometric Sequences"),L("2.2","Change in Linear and Exponential Functions"),
        L("2.3","Exponential Functions"),L("2.4","Exponential Function Manipulation"),
        L("2.5","Exponential Function Context and Data Modeling"),L("2.6","Competing Function Model Validation"),
        L("2.7","Composition of Functions"),L("2.8","Inverse Functions"),L("2.9","Logarithmic Expressions"),
        L("2.10","Inverses of Exponential Functions"),L("2.11","Logarithmic Functions"),
        L("2.12","Logarithmic Function Manipulation"),L("2.13","Exponential and Logarithmic Equations and Inequalities"),
        L("2.14","Logarithmic Function Context and Data Modeling"),L("2.15","Semi-log Plots")]},
      {id:"u3",n:"3",t:"Trigonometric and Polar Functions",lessons:[
        L("3.1","Periodic Phenomena"),L("3.2","Sine, Cosine, and Tangent"),L("3.3","Sine and Cosine Function Values"),
        L("3.4","Sine and Cosine Function Graphs"),L("3.5","Sinusoidal Functions"),L("3.6","Sinusoidal Function Transformations"),
        L("3.7","Sinusoidal Function Context and Data Modeling"),L("3.8","The Tangent Function"),
        L("3.9","Inverse Trigonometric Functions"),L("3.10","Trigonometric Equations and Inequalities"),
        L("3.11","The Secant, Cosecant, and Cotangent Functions"),L("3.12","Equations and Identities"),
        L("3.13","Trigonometry and Polar Coordinates"),L("3.14","Polar Function Graphs"),
        L("3.15","Rates of Change in Polar Functions")]},
      {id:"u4",n:"4",t:"Functions Involving Parameters, Vectors, and Matrices",note:"Not on the AP exam",lessons:[
        L("4.1","Parametric Functions"),L("4.2","Parametric Functions Modeling Planar Motion"),
        L("4.3","Parametric Functions and Rates of Change"),L("4.4","Parametrically Defined Circles and Lines"),
        L("4.5","Implicitly Defined Functions"),L("4.6","Conic Sections"),
        L("4.7","Parametrization of Implicitly Defined Functions"),L("4.8","Vectors"),L("4.9","Vector-Valued Functions"),
        L("4.10","Matrices"),L("4.11","The Inverse and Determinant of a Matrix"),
        L("4.12","Linear Transformations and Matrices"),L("4.13","Matrices as Functions"),L("4.14","Matrices Modeling Contexts")]},
      {id:"rev",n:"R",t:"AP Exam Review",lessons:[
        L("R.1","Practice multiple-choice set"),L("R.2","Practice free-response set"),L("R.3","Full practice exam")]}
    ]},
  ab:{
    name:"AP Calculus AB",
    units:[
      {id:"u1",n:"1",t:"Limits, Continuity, and Differentiability",free:true,files:{practice:"u1-practice",key:"u1-key"},plan:"u1-",lessons:[
        W("1-1","Limits to a Point on a Graph","A"),
        W("1-2","Limits to a Point of a Function","A"),
        W("1-3","Limits to Infinity and Horizontal Asymptotes","A"),
        W("1-4","Continuity at a Point","A"),
        W("1-5","IVT and EVT","A"),
        W("1-6","Average Rate of Change","A"),
        W("1-7","Instantaneous Rates of Change","A"),
        W("1-8","MVT","A"),
        W("1-9","IVT, EVT, and MVT","A")],
        tests:[T("SC1.1","Self Check 1.1"),T("SC1.2","Self Check 1.2"),T("SC1.1-1.2","Self Check 1.1 and 1.2"),T("SC1.3","Self Check 1.3"),T("SC1.4","Self Check 1.4"),T("SC1.3-1.4","Self Check 1.3 and 1.4"),T("PRETEST1","Unit 1 Pretest"),T("FIXUP1","Unit 1 Fix-Up")]},
      {id:"u2",n:"2",t:"Derivatives",lessons:[L("2-1","Basic Power Derivatives"),L("2-2","Finding “u”"),L("2-3","General and Power Chain Rule"),L("2-4","Advanced Power Chain Rule"),L("2-5","Exponential and Logarithmic Chain Rules"),L("2-6","Trigonometric Chain Rules"),L("2-7","Derivatives of Piecewise Functions"),L("2-8","Definition of Derivative AP Questions"),L("2-9","The Product Rule"),L("2-10","The Quotient Rule")]},
      {id:"u3",n:"3",t:"Analyzing Derivatives",lessons:[L("3-1","Height, Slope, Concavity"),L("3-2","Graphical Analysis: Increasing, Decreasing, Critical Values"),L("3-3","Graphical Analysis: Relative Extrema, Minimums, Maximums"),L("3-4","Graphical Analysis: Concavity and Inflection Points"),L("3-5","Curve Sketching"),L("3-6","Analytic Analysis: Increasing, Decreasing, Critical Values"),L("3-7","Analytic Analysis: Relative Extrema, Minimums, Maximums"),L("3-8","Analytic Analysis: Concavity and Inflection Points")]},
      {id:"u4",n:"4",t:"Applications of Derivatives",lessons:[L("4-1","Tangent Line Equations"),L("4-2","Tangent Line Approximations (Linearization)"),L("4-3","Tangent Line Applications"),L("4-4","Mean Value Theorem Applications"),L("4-5","Implicit Differentiation"),L("4-6","Advanced Implicit Differentiation"),L("4-7","Circular Related Rates"),L("4-8","Spherical Related Rates"),L("4-9","Triangular Related Rates")]},
      {id:"u5",n:"5",t:"Antiderivatives",lessons:[L("5-1","Basic Antiderivatives"),L("5-2","General and Power Antiderivatives"),L("5-3","Advanced Power Antiderivatives"),L("5-4","Unique Power and Exponential Antiderivatives"),L("5-5","Trigonometric Antiderivatives"),L("5-6","Analytic Definite Integrals"),L("5-7","Graphical Definite Integrals"),L("5-8","Piecewise Integration"),L("5-9","Definite Integral Rules")]},
      {id:"u6",n:"6",t:"Antiderivative Applications",lessons:[L("6-1","Slope Fields"),L("6-2","General Particular Solutions"),L("6-3","Specific Particular Solutions")]},
      {id:"u7",n:"7",t:"Motion Applications",lessons:[L("7-1","Motion Differentiation"),L("7-2","Motion Integration"),L("7-3","Direction"),L("7-4","Position"),L("7-5","Speed and Distance")]},
      {id:"u8",n:"8",t:"Specific Integral Applications",lessons:[L("8-1","Understanding Rates of Change"),L("8-2","Understanding Total Change"),L("8-3","Specific FTC Applications"),L("8-4","Specific Absolute Extrema")]},
      {id:"u9",n:"9",t:"Approximate Integral Applications",lessons:[L("9-1","Tabular Rates and Integrals"),L("9-2","Approximating Total Change"),L("9-3","Approximating Average Value")]},
      {id:"u10",n:"10",t:"General Integral Applications",lessons:[L("10-1","General FTC Applications"),L("10-2","Integral Analysis"),L("10-3","General Absolute Extrema")]},
      {id:"u11",n:"11",t:"Area and Volume",lessons:[L("11-1","Area Under Two Curves"),L("11-2","Area Between Two Curves"),L("11-3","Volumes of Square Cross Sections"),L("11-4","Basic Volumes of Revolution"),L("11-5","Advanced Volumes of Revolution")]},
      {id:"u12",n:"12",t:"AP Test Review",lessons:[L("12-1","Final exam preparation, Units 1 to 5"),L("12-2","Final exam preparation, Units 6 to 11"),L("12-3","Full practice exam")]}
    ]},
  sat:{
    name:"SAT Math",
    /* units are the four SAT Math domains; free:true on a lesson opens that skill only; "mt" holds the full adaptive practice tests */
    units:[
      {id:"d1",n:"1",t:"Algebra",plan:"d1-",lessons:[
        {...W("1.1","Linear Equations in One Variable","A"),free:true},
        W("1.2","Linear Functions","A"),
        W("1.3","Linear Equations in Two Variables","A"),
        W("1.4","Systems of Two Linear Equations","A"),
        W("1.5","Linear Inequalities in One or Two Variables","A")]},
      {id:"d2",n:"2",t:"Advanced Math",lessons:[L("2.1","Equivalent Expressions"),L("2.2","Nonlinear Equations and Systems of Equations"),L("2.3","Nonlinear Functions")]},
      {id:"d3",n:"3",t:"Problem-Solving and Data Analysis",lessons:[L("3.1","Ratios, Rates, Proportions, and Units"),L("3.2","Percentages"),L("3.3","One-Variable Data: Distributions and Measures"),L("3.4","Two-Variable Data: Models and Scatterplots"),L("3.5","Probability and Conditional Probability"),L("3.6","Inference from Sample Statistics and Margin of Error"),L("3.7","Evaluating Statistical Claims")]},
      {id:"d4",n:"4",t:"Geometry and Trigonometry",lessons:[L("4.1","Area and Volume"),L("4.2","Lines, Angles, and Triangles"),L("4.3","Right Triangles and Trigonometry"),L("4.4","Circles")]},
      {id:"mt",n:"T",t:"Full Practice Tests",free:true,plan:"mt-",lessons:[],
        mocks:[{id:"sat-mt-1",t:"Practice Test 1",note:"Free diagnostic"}],
        tests:[T("MT1M1","Test 1 · Module 1"),T("MT1H","Test 1 · Module 2, harder"),T("MT1E","Test 1 · Module 2, easier")]}
    ]}
};
