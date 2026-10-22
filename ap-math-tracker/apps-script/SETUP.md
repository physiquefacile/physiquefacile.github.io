# AP Math Online: one-time setup (about 10 minutes)

The student site (`learn.html`) uses a Google Sheet that you own for three things:
student accounts and payments, unlocking paid units, and quiz results.
Until it is set up, the site runs in **practice mode**: Unit 1 is free and open,
paid units stay locked, and nothing is sent.

## 1. Create the sheet and the script

1. Go to <https://sheets.new> and name the sheet, for example **AP Math Online**.
2. Open **Extensions → Apps Script**.
3. Delete the code shown, paste the whole content of `Code.gs` (in this folder), and click **Save**.
4. In the function menu at the top choose **setup**, then click **Run**.
   Google asks for permission the first time: choose your account, then
   **Advanced → Go to … (unsafe) → Allow**. The script only uses this sheet and sends you
   an email when a student declares a payment.
5. The sheet now has four tabs:
   - **Settings**: your **teacher key**, the **access end date** (31 May 2027), the email that receives
     payment notifications, and **class codes**. A class code can also give full access to a whole class:
     write `pc`, `ab`, `sat` or several of them (`pc ab`) in column C.
   - **Students**: one row per student who declared a payment.
   - **Keys**: the keys that unlock paid units (see step 5).
   - **Results**: one row per quiz or test submitted.

## 2. Publish it as a web app

1. In Apps Script click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**.
4. Copy the **Web app URL** (it ends with `/exec`).

## 3. Send Claude the payment details

Claude puts them in `quiz-config.js`:

- the Web app URL,
- the price of each course for the school year (in FCFA),
- the Wave number and/or Orange Money number that receive payments, and the name shown to students,
- a WhatsApp number or email for students' questions.

## 4. Each time a student pays

1. You receive an email "new payment to check" with the student's name, amount and **transaction reference**.
2. Check in your Wave or Orange Money app that the payment arrived with that reference.
3. In the **Students** tab, set **Status** to **Active** (or **Refused**). The activation date fills in by itself.
4. The student's units unlock the next time they open the site (or press **Check again**).

To give access without payment (a scholarship, your own class), add a row yourself with a code of your choice
(for example `AP-FREE-0001`), the name, the course (`pc`, `ab`, `sat`, or several such as `pc ab`) and Status **Active**,
or use a class code with column C filled in.

## 5. When a new paid unit is published

Each paid unit is encrypted with its own key. When Claude publishes a unit, it gives you one line such as
`pc-u2  2P9hyH633F9N…`. Add it as a new row in the **Keys** tab (Unit in column A, Key in column B).
Without that row, even paying students cannot open the unit.
Keep the keys private: anyone who has a key can open that unit.

## 6. Results in the teacher tracker

In the tracker (Class tab → **Student site and quizzes**), enter the teacher key from the Settings tab once,
then click **Import results**. You can also sign in on the student site with the teacher key to see every unit.

## Changing the script later

After editing `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
The URL stays the same.

## 7. Live sessions on Google Meet (tab "Live" of the student site)

1. Create the meeting: open <https://meet.google.com>, click **New meeting → Create a meeting for later**, and copy the link
   (or create an event in Google Calendar with "Add Google Meet video conferencing").
2. In the **Sessions** tab of the sheet, add one row per session:
   **Date** (2026-10-28), **Time (Dakar)** (18:00), **Duration (min)** (60), **Course** (`pc`, `ab`, `sat` or `all`),
   **Topic**, **Google Meet link**, and later the **Recording link** if you record it.
3. Students see the schedule in the **Live** tab. The **Join on Google Meet** button appears 15 minutes before the start,
   and only for students with full access to that course (class code with access, paid code, or teacher key).
   Past sessions stay visible for 30 days, with the recording link if you add one.

The Sessions tab is created automatically the first time the site asks for the sessions (or when you run **setup**).

## 8. Copies: written tests sent as photos (tab "Copies")

Students do the work on paper, take a photo of each page in the **Copies** tab of the student site, and send it.
You grade each copy in the teacher tracker (tab **Copies**); the student sees the grade and your comment.

**Once, after updating `Code.gs`** (this feature saves the photos in your Google Drive, so Google asks for one more permission):
1. Paste the new `Code.gs`, click **Save**, choose **setup** in the function menu and click **Run**.
   Accept the new permission (**Advanced → Go to … (unsafe) → Allow**). Two tabs appear: **Assignments** and **Copies**,
   and a folder **AP Math Online - Copies** appears in your Google Drive.
2. **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

**Each assignment:**
1. In the tracker, tab **Copies → + New assignment**: title, for whom (all students, a course, or one class code),
   due date, out of how many points, instructions, and optionally the subject as a PDF.
2. Students see it in their **Copies** tab, open the subject, and send their photos (up to 12 pages; they can replace
   their copy until you grade it). A copy sent after the due date is marked **late**; click **Close** to stop receiving copies.
3. In **Copies to grade**, open a copy, read the pages, enter the grade and a comment, then **Save and next**.

For the Senegalese program, create class codes in the Settings tab with `bfem`, `s1` or `s2` in column C
(for example `TS2-2026 | Terminale S2 | s2`), and choose that course or class code as "For" when you create the assignment.

## 9. AI correction proposal (optional, Claude)

The tracker can ask Claude to read a copy and propose a grade question by question, with a comment.
You always check and save the grade yourself; the student sees nothing before that.

1. Create an account at <https://platform.claude.com>, add a little credit (**Billing**), then **Settings → API keys → Create key**.
   Copy the key (it starts with `sk-ant-`).
2. In the tracker, tab **Copies → AI correction: Set up**, paste the key and save. The key is stored in your Google script
   (Script properties), never on the website. **Remove the key** there to switch the AI off.
3. For each assignment, add the **answer key and grading scale** (button **+ Answer key**, or when you create the assignment):
   the more precise the scale (points per question, points for the method), the better the proposal.
4. Open a copy, click **Propose a correction**, check each line against the photos, then **Use this proposal**, edit if needed, and **Save**.

Cost: about 0.03 to 0.05 US$ per copy of 4 pages with Claude Sonnet (paid to Anthropic from your API credit).
The photos of the copy are sent to Anthropic's API to be read; tell students and parents that copies may be read by an AI assistant.
