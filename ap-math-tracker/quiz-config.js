/* AP Math Online — settings for the student site (learn.html).
   endpoint : address of the Google Apps Script web app (see apps-script/SETUP.md).
              Leave "" for practice mode: Unit 1 stays free, nothing is sent, paid units stay locked.
   payment  : what students see on the "Get full access" page. Payment is checked by hand:
              the student pays, enters the transaction reference, and you set Status to Active
              in the Students sheet. Leave a price at 0 to hide that course from the form. */
window.QUIZ_CONFIG = {
  endpoint: "https://script.google.com/macros/s/AKfycbzeOUxjBM9knzlulm97VeUF7fIR5x7-EzSNOOXQZIV8ojhtucUGWmsh9Qfk9IsBCSxr_Q/exec",
  className: "AP Math",
  payment: {
    currency: "FCFA",
    prices: { pc: 5000, ab: 5000, sat: 5000 },  // price per course for the school year (sat = SAT Math)
    wave: "77 724 06 16",                          // Wave number that receives payments, e.g. "77 123 45 67"
    orangeMoney: "77 724 06 16",                   // Orange Money number, e.g. "77 123 45 67"
    payee: "Papa Touty Traoré",                         // name shown to the student for the transfer
    contact: "WhatsApp +221 77 724 06 16"                        // WhatsApp number or email for questions
  }
};
