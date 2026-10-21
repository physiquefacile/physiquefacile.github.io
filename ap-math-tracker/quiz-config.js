/* AP Math Online — settings for the student site (learn.html).
   endpoint : address of the Google Apps Script web app (see apps-script/SETUP.md).
              Leave "" for practice mode: Unit 1 stays free, nothing is sent, paid units stay locked.
   payment  : what students see on the "Get full access" page. Payment is checked by hand:
              the student pays, enters the transaction reference, and you set Status to Active
              in the Students sheet. Leave a price at 0 to hide that course from the form. */
window.QUIZ_CONFIG = {
  endpoint: "",
  className: "AP Math",
  payment: {
    currency: "FCFA",
    prices: { pc: 0, ab: 0, sat: 0 },  // price per course for the school year (sat = SAT Math)
    wave: "",                          // Wave number that receives payments, e.g. "77 123 45 67"
    orangeMoney: "",                   // Orange Money number, e.g. "77 123 45 67"
    payee: "",                         // name shown to the student for the transfer
    contact: ""                        // WhatsApp number or email for questions
  }
};
