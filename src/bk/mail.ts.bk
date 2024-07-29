import nodemailer from "nodemailer";
import config from "../config";
import { BadRequest } from "../middleware";

const Sendmail = async (emailcontent: any) => {
  const transporter = nodemailer.createTransport({
    // service: config.SMTP_SERVICE,
    // host: "smtp.gmail.com",
    // port: 587,
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    // secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASSWORD,
    },
  });
  try {
    await transporter.sendMail(emailcontent);
    return "Email sent successfully.";
  } catch (error) {
    console.log(error);
    throw new BadRequest("Error sending email");
  }
};

export { Sendmail };
