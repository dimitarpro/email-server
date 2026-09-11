const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(express.json());

// ✅ CORS middleware
app.use(cors({ origin: "*" }));

// ✅ Дополнителни headers (ако треба)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// ✅ Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Email рута со логирање
app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  console.log("Request body:", req.body);

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM, // мора да биде верифицирана адреса во SendGrid
      subject,
      html,
    };

    await sgMail.send(msg);

    console.log("Email sent successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
