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

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});



const sendEmail = ({ email, subject, body }) => {
  return new Promise((resolve, reject) => {
    const mail_configs = {
      from: process.env.SMTP_SERVER,
      to: email,
      subject: subject,
      html: body,
    };
    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        return reject({ message: "An error has occurred" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
};

//TODO: remove this endpoint, testing purposes only
app.post("/send-email", (req, res) => {
  const { email, subject, body } = req.body;
  sendEmail({ email, subject, body })
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`Node mailer is running on port ${port}`);
}); 
