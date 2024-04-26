const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const envFilePath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envFilePath });

const port = process.env.EMAIL_SERVICE_PORT;

function sendEmail({ email, subject, message }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.SMTP_SERVER,
      to: email,
      subject: subject,
      html: `
      <p>${message}</p>
      `,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.post("/send-email", (req, res) => {
  const { email, subject, message } = req.body;
  sendEmail({ email, subject, message })
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
