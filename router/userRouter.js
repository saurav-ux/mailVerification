import express from "express";
import UserData from "../models/userModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
const userRouter = express.Router();
dotenv.config();
const PORT = process.env.PORT || 5777;
//hashing passsword
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 9);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

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

userRouter.post("/", async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const addData = new UserData({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      isAdmin: 0,
    });

    if (
      req.body.name == "" ||
      req.body.password == "" ||
      req.body.image == "" ||
      req.body.email == ""
    ) {
      res.status(400).send("Please fill input");
    } else {
      const userDataa = await addData.save();

      if (userDataa) {
        sendVerifyMail(req.body.name, req.body.email, userDataa._id);
        res.status(201).send({
          message: "User Registration is succcesful , Please verify your mail",
        });
      } else {
        res.status(500).send({ message: "Your registration has been Failed" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const updataInfo = await UserData.updateOne(
      { _id: req.params.id },
      { $set: { isVerified: 1 } }
    );
    res.redirect("https://verifystatus.netlify.app");
  } catch (error) {
    console.error("Can't Update: ", error);
  }
});

export default userRouter;
