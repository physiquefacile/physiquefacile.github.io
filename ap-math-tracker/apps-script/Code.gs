/**
 * AP Math Online — backend (Google Apps Script bound to a Google Sheet).
 *
 * Handles: student access codes and payment requests, unlocking paid units,
 * and quiz/test results. Install: see SETUP.md (run setup() once, then deploy as a web app:
 * Execute as Me, Who has access: Anyone).
 *
 * Sheets created by setup():
 *   Settings : teacher key, access end date, notification email, class codes.
 *   Students : one row per paying student. Change "Status" to Active once you have received the payment.
 *   Keys     : one row per paid unit (unit id and its key). Paste the keys Claude gives you here.
 *   Results  : one row per submitted quiz or test.
 */

var SETTINGS = "Settings", STUDENTS = "Students", KEYS = "Keys", RESULTS = "Results";
var RESULT_HEADERS = ["Received", "Name", "Code", "Course", "Unit", "Quiz id", "Title", "Type",
                      "Score", "Out of", "Percent", "Time (s)", "Answers", "Result id", "Sent from device at"];
var STUDENT_HEADERS = ["Access code", "Name", "Phone (WhatsApp)", "Email", "Courses", "Amount (FCFA)", "Paid with",
                       "Transaction reference", "Status", "Requested", "Activated", "Note"];
var COURSE_NAMES = { pc: "AP Precalculus", ab: "AP Calculus AB" };

/* ------------------------------------------------------------------ setup */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var st = ss.getSheetByName(SETTINGS) || ss.insertSheet(SETTINGS);
  if (st.getLastRow() === 0) {
    var email = "";
    try { email = Session.getEffectiveUser().getEmail(); } catch (e) {}
    st.getRange(1, 1, 9, 3).setValues([
      ["Setting", "Value", ""],
      ["Teacher key", Utilities.getUuid().slice(0, 8).toUpperCase(), ""],
      ["Access ends", "2027-05-31", ""],
      ["Email for new payment requests", email, ""],
      ["", "", ""],
      ["Class codes", "Label", "Gives full access to (pc, ab, or pc ab)"],
      ["APPC2026", "AP Precalculus class", ""],
      ["APAB2026", "AP Calculus AB class", ""],
      ["", "", ""]
    ]);
    st.getRange("A1:C1").setFontWeight("bold"); st.getRange("A6:C6").setFontWeight("bold");
    st.setColumnWidth(1, 260); st.setColumnWidth(2, 220); st.setColumnWidth(3, 280);
  }
  var ps = ss.getSheetByName(STUDENTS) || ss.insertSheet(STUDENTS);
  if (ps.getLastRow() === 0) {
    ps.appendRow(STUDENT_HEADERS);
    ps.getRange(1, 1, 1, STUDENT_HEADERS.length).setFontWeight("bold");
    ps.setFrozenRows(1);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(["Pending", "Active", "Refused"], true).build();
    ps.getRange("I2:I1000").setDataValidation(rule);
  }
  var ks = ss.getSheetByName(KEYS) || ss.insertSheet(KEYS);
  if (ks.getLastRow() === 0) {
    ks.appendRow(["Unit", "Key", "Added"]);
    ks.getRange("A1:C1").setFontWeight("bold"); ks.setColumnWidth(2, 380);
  }
  var rs = ss.getSheetByName(RESULTS) || ss.insertSheet(RESULTS);
  if (rs.getLastRow() === 0) {
    rs.appendRow(RESULT_HEADERS);
    rs.getRange(1, 1, 1, RESULT_HEADERS.length).setFontWeight("bold");
    rs.setFrozenRows(1);
  }
}

/* ------------------------------------------------------------------ reading settings */
function settings_() {
  var v = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS).getDataRange().getValues();
  var s = { teacherKey: "", accessEnds: null, email: "", classes: {} }, inCodes = false;
  for (var i = 0; i < v.length; i++) {
    var a = String(v[i][0]).trim();
    if (/^class codes/i.test(a)) { inCodes = true; continue; }
    if (!inCodes) {
      if (/^teacher key/i.test(a)) s.teacherKey = String(v[i][1]).trim();
      else if (/^access ends/i.test(a)) s.accessEnds = v[i][1] instanceof Date ? v[i][1] : (v[i][1] ? new Date(v[i][1]) : null);
      else if (/^email/i.test(a)) s.email = String(v[i][1]).trim();
    } else if (a) {
      s.classes[a.toUpperCase()] = { label: String(v[i][1] || "").trim(), courses: parseCourses_(v[i][2]) };
    }
  }
  return s;
}

function parseCourses_(x) {
  var t = String(x || "").toLowerCase(), out = [];
  if (/\b(both|all|tous|les deux)\b/.test(t)) return ["pc", "ab"];
  if (/pc|precalc/.test(t)) out.push("pc");
  if (/ab|calc(?!ulus)|calculus ab/.test(t.replace(/precalc\w*/g, ""))) out.push("ab");
  return out;
}

function keys_() {
  var v = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(KEYS).getDataRange().getValues(), k = {};
  for (var i = 1; i < v.length; i++) { var u = String(v[i][0]).trim(); if (u) k[u] = String(v[i][1]).trim(); }
  return k;
}

/** keys for the units of the given courses */
function keysFor_(courses) {
  var all = keys_(), out = {};
  for (var u in all) if (courses.indexOf(u.split("-")[0]) >= 0) out[u] = all[u];
  return out;
}

/** find a student row by access code -> {row, data} */
function student_(code) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(STUDENTS);
  if (sh.getLastRow() < 2) return null;
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, STUDENT_HEADERS.length).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toUpperCase() === code)
    return { row: i + 2, name: String(v[i][1]), courses: parseCourses_(v[i][4]), status: String(v[i][8] || "Pending") };
  return null;
}

/** who is this code? */
function identify_(rawCode) {
  var code = String(rawCode || "").trim().toUpperCase();
  if (!code) return null;
  var s = settings_();
  var expired = s.accessEnds && new Date() > s.accessEnds;
  if (s.teacherKey && code === s.teacherKey.toUpperCase())
    return { type: "teacher", name: "Teacher", status: "Active", courses: ["pc", "ab"], keys: keys_() };
  if (code in s.classes) {
    var c = s.classes[code], courses = expired ? [] : c.courses;
    return { type: "class", name: "", label: c.label, status: "Active", courses: courses, keys: keysFor_(courses) };
  }
  var st = student_(code);
  if (st) {
    var active = st.status === "Active" && !expired;
    return { type: "student", name: st.name, status: expired && st.status === "Active" ? "Expired" : st.status,
             courses: active ? st.courses : [], requested: st.courses, keys: active ? keysFor_(st.courses) : {} };
  }
  return null;
}

/* ------------------------------------------------------------------ web app */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return json_({ ok: true, service: "AP Math Online" }); }

function newCode_() {
  var abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "AP-";
  for (var i = 0; i < 8; i++) { if (i === 4) s += "-"; s += abc.charAt(Math.floor(Math.random() * abc.length)); }
  return s;
}

function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "bad request" }); }

  /* who am I, and what is unlocked? */
  if (d.action === "access" || d.action === "check") {
    var who = identify_(d.code);
    if (!who) return json_({ ok: false, error: "code" });
    var s = settings_();
    return json_({ ok: true, type: who.type, name: who.name, label: who.label || "", status: who.status,
                   courses: who.courses, requested: who.requested || who.courses, keys: who.keys,
                   accessEnds: s.accessEnds ? Utilities.formatDate(s.accessEnds, "GMT", "yyyy-MM-dd") : "" });
  }

  /* a student asks for full access after paying */
  if (d.action === "request") {
    var name = String(d.name || "").trim().slice(0, 80), phone = String(d.phone || "").trim().slice(0, 30);
    var courses = (d.courses || []).filter(function (c) { return c === "pc" || c === "ab"; });
    var ref = String(d.ref || "").trim().slice(0, 60);
    if (!name || !phone || !courses.length || !ref) return json_({ ok: false, error: "missing" });
    var lock = LockService.getScriptLock(); lock.waitLock(10000);
    var code;
    try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(STUDENTS);
      do { code = newCode_(); } while (student_(code));
      sh.appendRow([code, name, phone, String(d.email || "").trim().slice(0, 80),
                    courses.map(function (c) { return c; }).join(" "), Number(d.amount) || 0,
                    String(d.method || "").slice(0, 20), ref, "Pending", new Date(), "", ""]);
    } finally { lock.releaseLock(); }
    try {
      var to = settings_().email;
      if (to) MailApp.sendEmail(to, "AP Math Online: new payment to check (" + name + ")",
        "Student: " + name + "\nPhone: " + phone + "\nCourses: " + courses.map(function (c) { return COURSE_NAMES[c]; }).join(", ") +
        "\nAmount: " + (Number(d.amount) || 0) + " FCFA via " + d.method + "\nTransaction reference: " + ref +
        "\nAccess code: " + code + "\n\nCheck the payment in your " + d.method + " app, then set Status to Active in the Students sheet:\n" +
        SpreadsheetApp.getActiveSpreadsheet().getUrl());
    } catch (err) {}
    return json_({ ok: true, code: code, status: "Pending" });
  }

  /* quiz or test result */
  if (d.action === "submit") {
    var w = identify_(d.code);
    if (!w || w.status === "Refused") return json_({ ok: false, error: "code" });
    var nm = (w.type === "student" ? w.name : String(d.name || "")).trim().slice(0, 80);
    if (!nm) return json_({ ok: false, error: "name" });
    var lk = LockService.getScriptLock(); lk.waitLock(10000);
    try {
      var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESULTS), id = String(d.id || "");
      if (id && rs.getLastRow() > 1) {
        var ids = rs.getRange(2, 14, rs.getLastRow() - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) return json_({ ok: true, duplicate: true });
      }
      rs.appendRow([new Date(), nm, String(d.code).trim().toUpperCase(), d.course || "", d.unit || "", d.quiz || "",
                    String(d.title || "").slice(0, 120), d.kind || "", Number(d.score) || 0, Number(d.total) || 0,
                    Number(d.percent) || 0, Number(d.seconds) || 0, String(d.answers || "").slice(0, 200), id, d.client || ""]);
    } finally { lk.releaseLock(); }
    return json_({ ok: true });
  }

  /* the teacher's tracker imports results */
  if (d.action === "results") {
    if (!d.key || String(d.key).trim().toUpperCase() !== settings_().teacherKey.toUpperCase()) return json_({ ok: false, error: "key" });
    var sh2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESULTS);
    var rows = sh2.getLastRow() > 1 ? sh2.getRange(2, 1, sh2.getLastRow() - 1, RESULT_HEADERS.length).getValues() : [];
    return json_({ ok: true, results: rows.map(function (r) {
      return { time: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), name: r[1], code: r[2], course: r[3], unit: r[4],
               quiz: r[5], title: r[6], kind: r[7], score: r[8], total: r[9], percent: r[10], seconds: r[11], id: r[13] };
    }) });
  }

  return json_({ ok: false, error: "unknown action" });
}

/* Timestamp the activation when you set a student's Status to Active. */
function onEdit(e) {
  try {
    var sh = e.range.getSheet();
    if (sh.getName() !== STUDENTS || e.range.getColumn() !== 9 || e.range.getRow() < 2) return;
    var act = sh.getRange(e.range.getRow(), 11);
    if (String(e.value) === "Active" && !act.getValue()) act.setValue(new Date());
  } catch (err) {}
}
