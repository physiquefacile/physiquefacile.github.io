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
 *   Assignments : written tests ("copies"): students send photos of their paper, the teacher grades them.
 *   Copies   : one row per copy received (the photos are saved in Google Drive, folder "AP Math Online - Copies").
 */

var SETTINGS = "Settings", STUDENTS = "Students", KEYS = "Keys", RESULTS = "Results", SESSIONS = "Sessions";
var ASSIGN = "Assignments", COPIES = "Copies";
var ASSIGN_HEADERS = ["Id", "Title", "For (all, pc, ab, sat, bfem, s1, s2 or class codes)", "Instructions", "Due (yyyy-mm-dd hh:mm, Dakar)",
                      "Out of", "Open (Yes/No)", "Subject (Drive file id)", "Created"];
var COPY_HEADERS = ["Received", "Copy id", "Assignment id", "Assignment", "Name", "Code", "Pages", "Files (Drive ids)",
                    "Grade", "Out of", "Comment", "Graded", "Status", "Late", "Folder"];
var ALL_COURSES = ["pc", "ab", "sat", "bfem", "s1", "s2"];
var SESSION_HEADERS = ["Date", "Time (Dakar)", "Duration (min)", "Course (pc, ab, sat or all)", "Topic", "Google Meet link", "Recording link (optional)"];
var RESULT_HEADERS = ["Received", "Name", "Code", "Course", "Unit", "Quiz id", "Title", "Type",
                      "Score", "Out of", "Percent", "Time (s)", "Answers", "Result id", "Sent from device at"];
var STUDENT_HEADERS = ["Access code", "Name", "Phone (WhatsApp)", "Email", "Courses", "Amount (FCFA)", "Paid with",
                       "Transaction reference", "Status", "Requested", "Activated", "Note"];
var COURSE_NAMES = { pc: "AP Precalculus", ab: "AP Calculus AB", sat: "SAT Math", bfem: "Maths 3e (BFEM)", s1: "Maths Terminale S1", s2: "Maths Terminale S2" };

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
      ["Class codes", "Label", "Gives full access to (pc, ab, sat, bfem, s1, s2, or several: pc ab)"],
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
  sessionsSheet_(); assignSheet_(); copiesSheet_();
  try { rootFolder_(); } catch (e) {}
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
  if (/\b(all|tous|tout)\b/.test(t)) return ["pc", "ab", "sat"];
  if (/\b(both|les deux)\b/.test(t)) out.push("pc", "ab");
  if (/pc|precalc/.test(t)) out.push("pc");
  if (/ab|calc(?!ulus)|calculus ab/.test(t.replace(/precalc\w*/g, "")) && out.indexOf("ab") < 0) out.push("ab");
  if (/sat/.test(t)) out.push("sat");
  if (/\bbfem\b/.test(t)) out.push("bfem");
  if (/\bs1\b/.test(t)) out.push("s1");
  if (/\bs2\b/.test(t)) out.push("s2");
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
    return { type: "teacher", name: "Teacher", status: "Active", courses: ALL_COURSES.slice(), keys: keys_() };
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
    var courses = (d.courses || []).filter(function (c) { return COURSE_NAMES.hasOwnProperty(c); });
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
                    Number(d.percent) || 0, Number(d.seconds) || 0, String(d.answers || "").slice(0, 400), id, d.client || ""]);
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

  /* live sessions (Google Meet): everyone sees the schedule, only students with access to the course get the link */
  if (d.action === "sessions") {
    var w2 = d.code ? identify_(d.code) : null;
    var mine = w2 ? (w2.type === "teacher" ? ["pc", "ab", "sat"] : w2.courses || []) : [];
    return json_({ ok: true, sessions: sessions_(mine) });
  }

  /* written copies (photos of the student's paper, graded by the teacher) */
  if (d.action === "assignments" || d.action === "subject" || d.action === "upload") return copiesStudent_(d);
  if (["copies", "page", "grade", "assign", "setopen"].indexOf(d.action) >= 0) {
    if (!d.key || String(d.key).trim().toUpperCase() !== settings_().teacherKey.toUpperCase()) return json_({ ok: false, error: "key" });
    return copiesTeacher_(d);
  }

  return json_({ ok: false, error: "unknown action" });
}

/* ------------------------------------------------------------------ copies: sheets and Drive */
function assignSheet_() { return headerSheet_(ASSIGN, ASSIGN_HEADERS, [80, 260, 220, 300, 160, 70, 90, 200, 120]); }
function copiesSheet_() { return headerSheet_(COPIES, COPY_HEADERS, [140, 110, 80, 220, 180, 120, 60, 200, 60, 60, 300, 140, 90, 60, 260]); }
function headerSheet_(name, headers, widths) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
    for (var i = 0; i < widths.length; i++) sh.setColumnWidth(i + 1, widths[i]);
  }
  return sh;
}
function rows_(sh, n) { return sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, n).getValues() : []; }
function rootFolder_() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty("COPIES_FOLDER");
  if (id) { try { var f0 = DriveApp.getFolderById(id); if (!f0.isTrashed()) return f0; } catch (e) {} }
  var f = DriveApp.createFolder("AP Math Online - Copies");
  p.setProperty("COPIES_FOLDER", f.getId());
  return f;
}
function subFolder_(parent, name) { var it = parent.getFoldersByName(name); return it.hasNext() ? it.next() : parent.createFolder(name); }
function cleanName_(s) { return String(s || "").replace(/[\\/:*?"<>|#%]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) || "untitled"; }
function normName_(s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim(); }

/** due date of an assignment row as a Date (Dakar = GMT), or null */
function due_(v) {
  if (!v) return null;
  var s = v instanceof Date ? Utilities.formatDate(v, SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || "GMT", "yyyy-MM-dd HH:mm") : String(v).trim().replace(/^'/, "");
  var m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2})[:h](\d{2}))?/);
  if (!m) return null;
  return new Date(m[1] + "T" + (m[2] ? ("0" + m[2]).slice(-2) + ":" + m[3] : "23:59") + ":00Z");
}
function assignments_() {
  return rows_(assignSheet_(), ASSIGN_HEADERS.length).map(function (r, i) {
    var dd = due_(r[4]);
    return { row: i + 2, id: String(r[0]).trim(), title: String(r[1] || "").trim(), forStr: String(r[2] || "").trim(),
             instructions: String(r[3] || ""), due: dd ? dd.toISOString() : "", outOf: Number(r[5]) || 20,
             open: !/^(no|non|closed|ferm)/i.test(String(r[6] || "Yes").trim()), subject: String(r[7] || "").trim(),
             created: r[8] instanceof Date ? r[8].toISOString() : String(r[8] || "") };
  }).filter(function (a) { return a.id && a.title; });
}
/** can this person (from identify_) see this assignment? */
function canSee_(who, code, a) {
  if (who.type === "teacher") return true;
  if (who.status !== "Active") return false;
  var f = a.forStr.toLowerCase();
  if (!f || /^(all|tous|tout)$/.test(f)) return true;
  var toks = f.split(/[\s,;]+/);
  if (toks.indexOf(code.toLowerCase()) >= 0) return true;
  return toks.some(function (t) { return ALL_COURSES.indexOf(t) >= 0 && (who.courses || []).indexOf(t) >= 0; });
}
function copies_() {
  return rows_(copiesSheet_(), COPY_HEADERS.length).map(function (r, i) {
    return { row: i + 2, received: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), id: String(r[1]), assignment: String(r[2]),
             title: String(r[3]), name: String(r[4]), code: String(r[5]), pages: Number(r[6]) || 0,
             files: String(r[7] || "").split(/\s+/).filter(String), grade: r[8] === "" ? "" : Number(r[8]), outOf: Number(r[9]) || 20,
             comment: String(r[10] || ""), graded: r[11] instanceof Date ? r[11].toISOString() : String(r[11] || ""),
             status: String(r[12] || "To grade"), late: /^y/i.test(String(r[13] || "")), folder: String(r[14] || "") };
  });
}
function isMine_(c, who, code, name) {
  if (c.code.toUpperCase() !== code) return false;
  return who.type !== "class" || normName_(c.name) === normName_(name);
}

/* ------------------------------------------------------------------ copies: student side */
function copiesStudent_(d) {
  var code = String(d.code || "").trim().toUpperCase(), who = identify_(code);
  if (!who) return json_({ ok: false, error: "code" });
  var name = (who.type === "student" ? who.name : String(d.name || "")).trim().slice(0, 80);
  var list = assignments_().filter(function (a) { return canSee_(who, code, a); });

  if (d.action === "assignments") {
    var mine = copies_().filter(function (c) { return c.status !== "Replaced" && isMine_(c, who, code, name); });
    return json_({ ok: true, now: new Date().toISOString(),
      assignments: list.map(function (a) { return { id: a.id, title: a.title, instructions: a.instructions, due: a.due, outOf: a.outOf, open: a.open, subject: !!a.subject, created: a.created }; }),
      copies: mine.map(function (c) { return { id: c.id, assignment: c.assignment, received: c.received, pages: c.pages, status: c.status,
        grade: c.status === "Graded" ? c.grade : "", outOf: c.outOf, comment: c.status === "Graded" ? c.comment : "", graded: c.graded, late: c.late }; }) });
  }

  var a = list.filter(function (x) { return x.id === String(d.id || ""); })[0];
  if (!a) return json_({ ok: false, error: "assignment" });

  if (d.action === "subject") {
    if (!a.subject) return json_({ ok: false, error: "nosubject" });
    var f = DriveApp.getFileById(a.subject);
    return json_({ ok: true, name: f.getName(), type: f.getMimeType(), data: Utilities.base64Encode(f.getBlob().getBytes()) });
  }

  /* upload */
  if (!a.open) return json_({ ok: false, error: "closed" });
  if (!name) return json_({ ok: false, error: "name" });
  var pages = (d.pages || []).filter(function (p) { return typeof p === "string" && p.length > 100; });
  if (!pages.length) return json_({ ok: false, error: "nopages" });
  if (pages.length > 12 || pages.some(function (p) { return p.length > 6000000; })) return json_({ ok: false, error: "toobig" });
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var all = copies_(), prev = all.filter(function (c) { return c.assignment === a.id && c.status !== "Replaced" && isMine_(c, who, code, name); });
    if (prev.some(function (c) { return c.status === "Graded"; })) return json_({ ok: false, error: "graded" });
    var now = new Date(), stamp = Utilities.formatDate(now, "GMT", "yyyy-MM-dd HH.mm");
    var folder = subFolder_(subFolder_(rootFolder_(), cleanName_(a.title)), cleanName_(name) + " - " + stamp);
    var ids = pages.map(function (p, i) {
      var b64 = p.replace(/^data:[^,]*,/, "");
      var blob = Utilities.newBlob(Utilities.base64Decode(b64), "image/jpeg", cleanName_(name) + " - page " + (i + 1) + ".jpg");
      return folder.createFile(blob).getId();
    });
    var dd = a.due ? new Date(a.due) : null, late = dd && now > dd;
    var sh = copiesSheet_(), id = "C-" + Utilities.getUuid().slice(0, 8).toUpperCase();
    prev.forEach(function (c) { sh.getRange(c.row, 13).setValue("Replaced"); });
    sh.appendRow([now, id, a.id, a.title, name, code, ids.length, ids.join(" "), "", a.outOf, "", "", "To grade", late ? "Yes" : "", folder.getUrl()]);
  } finally { lock.releaseLock(); }
  return json_({ ok: true, id: id, pages: ids.length, late: !!late, replaced: prev.length > 0 });
}

/* ------------------------------------------------------------------ copies: teacher side */
function copiesTeacher_(d) {
  if (d.action === "copies") {
    return json_({ ok: true, now: new Date().toISOString(),
      assignments: assignments_().map(function (a) { delete a.row; a.subject = !!a.subject; return a; }),
      copies: copies_().filter(function (c) { return c.status !== "Replaced"; }).map(function (c) { delete c.row; c.files = c.files.length; return c; }) });
  }
  if (d.action === "page") {
    var c = copies_().filter(function (x) { return x.id === String(d.id || ""); })[0];
    if (!c) return json_({ ok: false, error: "copy" });
    var fid = c.files[Number(d.n) || 0];
    if (!fid) return json_({ ok: false, error: "page" });
    var b = DriveApp.getFileById(fid).getBlob();
    return json_({ ok: true, type: b.getContentType(), data: Utilities.base64Encode(b.getBytes()) });
  }
  if (d.action === "grade") {
    var c2 = copies_().filter(function (x) { return x.id === String(d.id || ""); })[0];
    if (!c2) return json_({ ok: false, error: "copy" });
    var sh = copiesSheet_(), g = String(d.grade == null ? "" : d.grade).trim().replace(",", ".");
    if (g !== "" && isNaN(Number(g))) return json_({ ok: false, error: "grade" });
    sh.getRange(c2.row, 9, 1, 5).setValues([[g === "" ? "" : Number(g), c2.outOf, String(d.comment || "").slice(0, 2000),
      g === "" ? "" : new Date(), g === "" ? "To grade" : "Graded"]]);
    return json_({ ok: true });
  }
  if (d.action === "assign") {
    var title = String(d.title || "").trim().slice(0, 120);
    if (!title) return json_({ ok: false, error: "title" });
    var subj = "";
    if (d.pdf) {
      var blob = Utilities.newBlob(Utilities.base64Decode(String(d.pdf).replace(/^data:[^,]*,/, "")), "application/pdf", cleanName_(d.pdfName || title).replace(/\.pdf$/i, "") + ".pdf");
      subj = subFolder_(rootFolder_(), "Subjects").createFile(blob).getId();
    }
    var id2 = "A-" + Utilities.getUuid().slice(0, 6).toUpperCase();
    var due = String(d.due || "").trim().replace("T", " ").slice(0, 16);
    assignSheet_().appendRow([id2, title, String(d.forStr || "all").trim().slice(0, 120), String(d.instructions || "").slice(0, 1000),
      due ? "'" + due : "", Number(d.outOf) || 20, "Yes", subj, new Date()]);
    return json_({ ok: true, id: id2 });
  }
  if (d.action === "setopen") {
    var a = assignments_().filter(function (x) { return x.id === String(d.id || ""); })[0];
    if (!a) return json_({ ok: false, error: "assignment" });
    assignSheet_().getRange(a.row, 7).setValue(d.open ? "Yes" : "No");
    return json_({ ok: true });
  }
  return json_({ ok: false, error: "unknown action" });
}

/* ------------------------------------------------------------------ live sessions */
function sessionsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(SESSIONS);
  if (!sh) {
    sh = ss.insertSheet(SESSIONS);
    sh.appendRow(SESSION_HEADERS);
    sh.getRange(1, 1, 1, SESSION_HEADERS.length).setFontWeight("bold");
    sh.setFrozenRows(1);
    sh.setColumnWidth(5, 280); sh.setColumnWidth(6, 300); sh.setColumnWidth(7, 300);
  }
  return sh;
}

/** sessions from 30 days ago onward, sorted by start; the Meet link only for the courses in `mine` */
function sessions_(mine) {
  var sh = sessionsSheet_(), tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || "GMT";
  if (sh.getLastRow() < 2) return [];
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, SESSION_HEADERS.length).getValues(), out = [];
  var from = new Date().getTime() - 30 * 864e5;
  for (var i = 0; i < v.length; i++) {
    var r = v[i];
    if (!r[0]) continue;
    var day = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, "yyyy-MM-dd") : String(r[0]).trim();
    var t = r[1] instanceof Date ? Utilities.formatDate(r[1], tz, "HH:mm") : String(r[1] || "18:00").trim().replace("h", ":");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    if (!/^\d{1,2}:\d{2}$/.test(t)) t = "18:00";
    if (t.length === 4) t = "0" + t;
    var start = new Date(day + "T" + t + ":00Z");               /* Dakar is GMT all year */
    var mins = Number(r[2]) || 60, end = start.getTime() + mins * 60000;
    if (end < from) continue;
    var cs = parseCourses_(r[3]);
    if (!cs.length) cs = ["pc", "ab", "sat"];
    var open = cs.some(function (c) { return mine.indexOf(c) >= 0; });
    out.push({ start: start.toISOString(), minutes: mins, courses: cs, topic: String(r[4] || "").slice(0, 200),
               link: open ? String(r[5] || "").trim() : "", recording: open ? String(r[6] || "").trim() : "", locked: !open });
  }
  out.sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  return out;
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
