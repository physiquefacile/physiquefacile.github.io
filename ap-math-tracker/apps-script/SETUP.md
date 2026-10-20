# Quiz results: one-time setup (about 5 minutes)

The online quizzes (`quiz.html`) send each student's score to a Google Sheet that you own.
Until this is set up, quizzes run in **practice mode**: students see their score and
corrections, but nothing is sent.

## 1. Create the sheet and the script

1. Go to <https://sheets.new> and name the sheet, for example **AP Math quiz results**.
2. Open **Extensions → Apps Script**.
3. Delete the code shown, paste the whole content of `Code.gs` (in this folder), and click **Save**.
4. In the function menu at the top choose **setup**, then click **Run**.
   Google asks for permission the first time: choose your account, then
   **Advanced → Go to … (unsafe) → Allow**. (The script only touches this sheet.)
5. Back in the sheet you now have two tabs:
   - **Settings**: your **teacher key**, and the **class codes** (`APPC2026`, `APAB2026`).
     Change or add codes below the line "Class codes" (one per row; the label in column B is optional).
   - **Results**: one row per quiz or test submitted.

## 2. Publish it as a web app

1. In Apps Script click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**.
4. Copy the **Web app URL** (it ends with `/exec`).

## 3. Connect the site

Send the URL to Claude, or put it yourself in `ap-math-tracker/quiz-config.js`:

```js
window.QUIZ_CONFIG = {
  endpoint: "https://script.google.com/macros/s/…/exec",
  className: "AP Math"
};
```

## 4. Give students the quiz link and class code

- Quiz page: <https://physiquefacile.github.io/ap-math-tracker/quiz.html>
- Students sign in with their full name and the class code.

## 5. Import results into the tracker

In the tracker (Class tab → **Quiz results**), enter the teacher key from the Settings tab once,
then click **Import results**. Each result is added to the student's scores (students are matched
by name; a student who is not in your list yet is added).

## Changing the script later

After editing `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
The URL stays the same.
