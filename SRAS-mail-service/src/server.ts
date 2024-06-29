import express, { response } from "express";
import nodemailer from "nodemailer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import { render } from "@react-email/components";
import {
  ReportTemplate,
  MotionDetectedTemplate,
  PeopleExceededTemplate,
  WaitTimeTemplate,
} from "./templates";

import { Settings, EmailDto, EmailTypeEnum } from "./types";

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

const getSettings = async (): Promise<Settings> => {
  try {
    const response = await axios.get(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/settings`
    );

    const settings: Settings = {
      FullName: response.data.FullName,
      Email: response.data.Email,
    };
    return settings;
  } catch (error) {
    return {} as Settings;
  }
};

app.post("/send-email", async (req, res) => {
  try {
    const {
      EmailType,
      CameraName,
      ZoneName,
      PeopleExceeded,
      ExceededTime,
    }: EmailDto = req.body;

    const userSettings = await getSettings();

    let templateHTML;
    let subject;
    switch (EmailType) {
      case EmailTypeEnum.Report:
        templateHTML = render(ReportTemplate({ Name: userSettings.FullName }));
        subject = ReportTemplate.Subject;
        break;
      case EmailTypeEnum.MotionDetected:
        templateHTML = render(MotionDetectedTemplate({ CameraName, ZoneName }));
        subject = MotionDetectedTemplate.Subject;
        break;
      case EmailTypeEnum.PeopleExceeded:
        templateHTML = render(
          PeopleExceededTemplate({ CameraName, ZoneName, PeopleExceeded })
        );
        subject = PeopleExceededTemplate.Subject;
        break;
      case EmailTypeEnum.WaitTime:
        templateHTML = render(
          WaitTimeTemplate({ CameraName, ZoneName, ExceededTime })
        );
        subject = WaitTimeTemplate.Subject;
        break;
    }
    const response = await sendEmail(userSettings.Email, subject, templateHTML);

    res.send((response as any).message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Node mailer is running on port ${port}`);
});
