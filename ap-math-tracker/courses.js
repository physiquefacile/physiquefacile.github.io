/* AP Math Tracker — course library.
   Each unit lists its PDFs in `files` (names in ap-math-tracker/docs/<course>/, without ".pdf"):
     files:{notes:"u1-notes", practice:"u1-practice", key:"u1-key"}
   lessonFiles:"u1-l" means each lesson has <prefix><n>-practice.pdf and <prefix><n>-key.pdf (e.g. u1-l1.3-practice.pdf).
   Units without files are shown as "in preparation".
   Topic numbers and titles follow the College Board Course and Exam Descriptions. */
const L=(n,t,r)=>({n,t,r:r||{}});
window.COURSE_LIB={
  pc:{
    name:"AP Precalculus",
    units:[
      {id:"u1",n:"1",t:"Polynomial and Rational Functions",files:{notes:"u1-notes",practice:"u1-practice",key:"u1-key"},lessonFiles:"u1-l",lessons:[
        L("1.1","Change in Tandem"),L("1.2","Rates of Change"),L("1.3","Rates of Change in Linear and Quadratic Functions"),
        L("1.4","Polynomial Functions and Rates of Change"),L("1.5","Polynomial Functions and Complex Zeros"),
        L("1.6","Polynomial Functions and End Behavior"),L("1.7","Rational Functions and End Behavior"),
        L("1.8","Rational Functions and Zeros"),L("1.9","Rational Functions and Vertical Asymptotes"),
        L("1.10","Rational Functions and Holes"),L("1.11","Equivalent Representations of Polynomial and Rational Expressions"),
        L("1.12","Transformations of Functions"),L("1.13","Function Model Selection and Assumption Articulation"),
        L("1.14","Function Model Construction and Application")]},
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
      {id:"u1",n:"1",t:"Limits and Continuity",files:{notes:"u1-notes",practice:"u1-practice",key:"u1-key"},lessonFiles:"u1-l",lessons:[
        L("1.1","Introducing Calculus: Can Change Occur at an Instant?"),L("1.2","Defining Limits and Using Limit Notation"),
        L("1.3","Estimating Limit Values from Graphs"),L("1.4","Estimating Limit Values from Tables"),
        L("1.5","Determining Limits Using Algebraic Properties of Limits"),L("1.6","Determining Limits Using Algebraic Manipulations"),
        L("1.7","Selecting Procedures for Determining Limits"),L("1.8","Determining Limits Using the Squeeze Theorem"),
        L("1.9","Connecting Multiple Representations of Limits"),L("1.10","Exploring Types of Discontinuities"),
        L("1.11","Defining Continuity at a Point"),L("1.12","Confirming Continuity over an Interval"),
        L("1.13","Removing Discontinuities"),L("1.14","Connecting Infinite Limits and Vertical Asymptotes"),
        L("1.15","Connecting Limits at Infinity and Horizontal Asymptotes"),L("1.16","Working with the Intermediate Value Theorem")]},
      {id:"u2",n:"2",t:"Differentiation: Definition and Fundamental Properties",lessons:[
        L("2.1","Defining Average and Instantaneous Rates of Change at a Point"),
        L("2.2","Defining the Derivative of a Function and Using Derivative Notation"),
        L("2.3","Estimating Derivatives of a Function at a Point"),L("2.4","Connecting Differentiability and Continuity"),
        L("2.5","Applying the Power Rule"),L("2.6","Derivative Rules: Constant, Sum, Difference, and Constant Multiple"),
        L("2.7","Derivatives of cos x, sin x, eˣ, and ln x"),L("2.8","The Product Rule"),L("2.9","The Quotient Rule"),
        L("2.10","Derivatives of Tangent, Cotangent, Secant, and Cosecant")]},
      {id:"u3",n:"3",t:"Differentiation: Composite, Implicit, and Inverse Functions",lessons:[
        L("3.1","The Chain Rule"),L("3.2","Implicit Differentiation"),L("3.3","Differentiating Inverse Functions"),
        L("3.4","Differentiating Inverse Trigonometric Functions"),L("3.5","Selecting Procedures for Calculating Derivatives"),
        L("3.6","Calculating Higher-Order Derivatives")]},
      {id:"u4",n:"4",t:"Contextual Applications of Differentiation",lessons:[
        L("4.1","Interpreting the Meaning of the Derivative in Context"),
        L("4.2","Straight-Line Motion: Position, Velocity, and Acceleration"),
        L("4.3","Rates of Change in Applied Contexts Other Than Motion"),L("4.4","Introduction to Related Rates"),
        L("4.5","Solving Related Rates Problems"),L("4.6","Local Linearity and Linearization"),
        L("4.7","L'Hospital's Rule for Indeterminate Forms")]},
      {id:"u5",n:"5",t:"Analytical Applications of Differentiation",lessons:[
        L("5.1","Using the Mean Value Theorem"),L("5.2","Extreme Value Theorem, Global Versus Local Extrema, and Critical Points"),
        L("5.3","Intervals on Which a Function Is Increasing or Decreasing"),L("5.4","The First Derivative Test for Relative Extrema"),
        L("5.5","The Candidates Test for Absolute Extrema"),L("5.6","Determining Concavity"),
        L("5.7","The Second Derivative Test"),L("5.8","Sketching Graphs of Functions and Their Derivatives"),
        L("5.9","Connecting a Function, Its First Derivative, and Its Second Derivative"),
        L("5.10","Introduction to Optimization Problems"),L("5.11","Solving Optimization Problems"),
        L("5.12","Exploring Behaviors of Implicit Relations")]},
      {id:"u6",n:"6",t:"Integration and Accumulation of Change",lessons:[
        L("6.1","Exploring Accumulations of Change"),L("6.2","Approximating Areas with Riemann Sums"),
        L("6.3","Riemann Sums, Summation Notation, and Definite Integral Notation"),
        L("6.4","The Fundamental Theorem of Calculus and Accumulation Functions"),
        L("6.5","Behavior of Accumulation Functions Involving Area"),L("6.6","Applying Properties of Definite Integrals"),
        L("6.7","The Fundamental Theorem of Calculus and Definite Integrals"),
        L("6.8","Antiderivatives and Indefinite Integrals: Basic Rules and Notation"),L("6.9","Integrating Using Substitution"),
        L("6.10","Long Division and Completing the Square"),L("6.14","Selecting Techniques for Antidifferentiation")]},
      {id:"u7",n:"7",t:"Differential Equations",lessons:[
        L("7.1","Modeling Situations with Differential Equations"),L("7.2","Verifying Solutions for Differential Equations"),
        L("7.3","Sketching Slope Fields"),L("7.4","Reasoning Using Slope Fields"),
        L("7.6","General Solutions Using Separation of Variables"),
        L("7.7","Particular Solutions Using Initial Conditions and Separation of Variables"),
        L("7.8","Exponential Models with Differential Equations")]},
      {id:"u8",n:"8",t:"Applications of Integration",lessons:[
        L("8.1","Average Value of a Function on an Interval"),L("8.2","Position, Velocity, and Acceleration Using Integrals"),
        L("8.3","Accumulation Functions and Definite Integrals in Applied Contexts"),
        L("8.4","Area Between Curves as Functions of x"),L("8.5","Area Between Curves as Functions of y"),
        L("8.6","Area Between Curves That Intersect at More Than Two Points"),
        L("8.7","Volumes with Cross Sections: Squares and Rectangles"),L("8.8","Volumes with Cross Sections: Triangles and Semicircles"),
        L("8.9","Disc Method: Revolving Around the x- or y-Axis"),L("8.10","Disc Method: Revolving Around Other Axes"),
        L("8.11","Washer Method: Revolving Around the x- or y-Axis"),L("8.12","Washer Method: Revolving Around Other Axes")]},
      {id:"rev",n:"R",t:"AP Exam Review",lessons:[
        L("R.1","Practice multiple-choice set"),L("R.2","Practice free-response set"),L("R.3","Full practice exam")]}
    ]}
};
