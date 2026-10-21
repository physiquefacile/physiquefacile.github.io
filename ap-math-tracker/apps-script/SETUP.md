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
