const express = require("express");
const router = express.Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");

router.post("/register", async (req, res) => {
    const response = {};
    try {
        const preuser = await User.findOne({ email: req.body.email });
        if (preuser) {
            response.statusText = "Unsuccess";
            return res.status(400).json({ error });
        } else {
            const newuser = new User({ name: req.body.name, email: req.body.email, phone: req.body.phone, password: req.body.password, code: req.body.code });
            const user = await newuser.save();
            res.send("User Registered Successfully");
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email, password: password });
        if (user) {
            res.send(user);
        } else {
            return res.status(400).json({ message: "Login failed" });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/sendpasswordlink", async (req, res) => {
    const { email } = req.body;
    const response = {};
    try {
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            const otpcode = Math.floor((Math.random() * 10000) + 1);
            oldUser.code = otpcode;
            oldUser.codechange = "Меняем пароль";
            console.log(oldUser.code);
            const newusercode = await oldUser.save();
            res.send({ otpcode });

            const link = "http://localhost:3000/code";
            
            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: process.env.SMT_PORT,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Код подтверждения",
                html: `<div>
            <h1>Для смены пароля перейдите по ссылке и введите следующий код: ${otpcode}</h1>
            <a href=${link}></a>
            </div>`}

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent");
                    res.send("Congratulations!");
                }
            });
        } else {
            response.statusText = "Unsuccess";
            return res.status(400).json({ error });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/confirmcode", async (req, res) => {
    const response = {};
    try {
        const data = await User.findOne({ code: req.body.number });
        if (!data) {
            response.statusText = "Unsuccess";
            return res.status(400).json({ error });
        } else {
            res.send("Successfully");
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/createpassword", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        user.password = req.body.password;
        user.code = "0000";
        const newpassword = await user.save();
        res.send("Successfully");
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;