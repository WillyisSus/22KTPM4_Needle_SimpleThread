const nodemailer = require('nodemailer');
const { emit } = require('nodemon');
const APP_EMAIL = process.env.APP_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;
const emailer = {};
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: APP_EMAIL,
        pass: APP_PASSWORD,
    },
});

module.exports = transporter;