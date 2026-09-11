import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

// SMTP transporter со Gmail App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Endpoint за праќање е-пошта
app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html
    });
    res.status(200).json({ success: true, id: info.messageId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
