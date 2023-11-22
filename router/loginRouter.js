import express from "express";
const loginRouter = express.Router();
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import UserData from "../models/userModel.js";
dotenv.config();
const PORT = process.env.PORT || 5777;
//mailer
const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: "sauravanand5777@gmail.com",
        pass: process.env.PASSWORD,
      },
    });
    const mailOption = {
        from: "sauravanand5777@gmail.com",
        to: email,
        subject: "For Verification Mail",
        html: `<p>Hii ${name}, please click here to <a href="http://localhost:${PORT}/register/${user_id}">Verify</a> your mail.</p>`,
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log("transferError", error);
      } else {
        console.log("Email has been send", info.response);
      }
    });
  } catch (error) {
    console.log("mailError: ", error);
  }
};

loginRouter.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const verifyMail = await UserData.findOne({ email: email });
    // console.log('veriftEmail',verifyMail)
    if (verifyMail !== null) {
      const isMatch = await bcrypt.compare(password, verifyMail.password);
      if (isMatch) {
        if (verifyMail.isVerified) {
          res.status(201).send({ message: "Sucessfully Login" });
        } else {
          res.status(401).send({ message: "Please verify your mail" });
          sendVerifyMail(verifyMail.name, verifyMail.email, verifyMail._id);
        }
      } else {
        res.status(401).send({ message: "Incorrect email or password" });
      }
    } else {
      res.status(401).send({ message: "Incorrect email or password" });
    }
  } catch (error) {
    console.log("login Error: ", error);
  }
});
export default loginRouter;
