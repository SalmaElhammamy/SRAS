import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import { ReportTemplate } from "./templates/report.template";
import { render } from "@react-email/components";
import { report } from "process";

const envFilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envFilePath });

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.EMAIL_SERVICE_PORT;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const sendEmail = (email: string, subject: string, body: string) => {
  return new Promise((resolve, reject) => {
    const mail_configs = {
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
  const { email, subject } = req.body;

  //TODO get the name from the db
  const reportTemplateHTML = render(
    ReportTemplate({
      Name: "Monmon",
    })
  );
  sendEmail(email, subject, reportTemplateHTML)
    .then((response: any) => res.send(response.message))
    .catch((error: any) => {
      res.status(500).send(error.message);
    });
});

app.listen(port, () => {
  console.log(`Node mailer is running on port ${port}`);
});
