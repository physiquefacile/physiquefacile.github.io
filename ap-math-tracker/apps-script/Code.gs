/**
 * AP Math Tracker — quiz results receiver (Google Apps Script).
 *
 * Install: see SETUP.md. In short: create a Google Sheet, open Extensions > Apps Script,
 * paste this file, run setup() once, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). Copy the web app URL into quiz-config.js.
 *
 * Sheets created by setup():
 *   Settings : class codes (one per row) and the teacher key used by the tracker to read results.
 *   Results  : one row per submitted quiz or test.
 */

var RESULTS = "Results";
var SETTINGS = "Settings";
var HEADERS = ["Received", "Name", "Class code", "Course", "Unit", "Quiz id", "Title", "Type",
               "Score", "Out of", "Percent", "Time (s)", "Answers", "Result id", "Sent from device at"];

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var st = ss.getSheetByName(SETTINGS) || ss.insertSheet(SETTINGS);
  if (st.getLastRow() === 0) {
    st.getRange(1, 1, 6, 2).setValues([
      ["Setting", "Value"],
      ["Teacher key", Utilities.getUuid().slice(0, 8).toUpperCase()],
      ["Class codes (one per row below)", ""],
      ["APPC2026", "AP Precalculus"],
      ["APAB2026", "AP Calculus AB"],
      ["", ""]
    ]);
    st.getRange("A1:B1").setFontWeight("bold");
    st.getRange("A3").setFontWeight("bold");
    st.setColumnWidth(1, 260); st.setColumnWidth(2, 200);
  }
  var rs = ss.getSheetByName(RESULTS) || ss.insertSheet(RESULTS);
  if (rs.getLastRow() === 0) {
    rs.appendRow(HEADERS);
    rs.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    rs.setFrozenRows(1);
  }
}

/** Class codes: column A below the row "Class codes...", with an optional label in column B. */
function classCodes_() {
  var st = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS);
  var v = st.getDataRange().getValues(), codes = {}, on = false;
  for (var i = 0; i < v.length; i++) {
    var a = String(v[i][0]).trim();
    if (/^class codes/i.test(a)) { on = true; continue; }
    if (on && a) codes[a.toUpperCase()] = String(v[i][1] || "").trim();
  }
  return codes;
}

function teacherKey_() {
  var v = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS).getDataRange().getValues();
  for (var i = 0; i < v.length; i++) if (/^teacher key/i.test(String(v[i][0]))) return String(v[i][1]).trim();
  return "";
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, service: "AP Math Tracker quiz results" });
}

function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "bad request" }); }
  var codes = classCodes_();

  if (d.action === "check") {
    var c = String(d.code || "").trim().toUpperCase();
    return json_(c in codes ? { ok: true, className: codes[c] } : { ok: false, error: "code" });
  }

  if (d.action === "submit") {
    var code = String(d.code || "").trim().toUpperCase();
    if (!(code in codes)) return json_({ ok: false, error: "code" });
    var name = String(d.name || "").trim().slice(0, 80);
    if (!name) return json_({ ok: false, error: "name" });
    var lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESULTS);
      // ignore a result already received (the page may resend after a network error)
      var id = String(d.id || "");
      if (id && rs.getLastRow() > 1) {
        var ids = rs.getRange(2, 14, rs.getLastRow() - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) return json_({ ok: true, duplicate: true });
      }
      rs.appendRow([new Date(), name, code, d.course || "", d.unit || "", d.quiz || "", String(d.title || "").slice(0, 120),
                    d.kind || "", Number(d.score) || 0, Number(d.total) || 0, Number(d.percent) || 0, Number(d.seconds) || 0,
                    String(d.answers || "").slice(0, 200), id, d.client || ""]);
    } finally { lock.releaseLock(); }
    return json_({ ok: true });
  }

  if (d.action === "results") {
    if (!d.key || String(d.key).trim() !== teacherKey_()) return json_({ ok: false, error: "key" });
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESULTS);
    var rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues() : [];
    var out = rows.map(function (r) {
      return { time: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), name: r[1], code: r[2], course: r[3], unit: r[4],
               quiz: r[5], title: r[6], kind: r[7], score: r[8], total: r[9], percent: r[10], seconds: r[11], id: r[13] };
    });
    return json_({ ok: true, results: out });
  }

  return json_({ ok: false, error: "unknown action" });
}
