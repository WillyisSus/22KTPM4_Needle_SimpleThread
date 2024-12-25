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


emailer.sendResetMail = async (options) => {
    console.log(APP_EMAIL)
    const {to, html, subject, text} = options
    console.log(options)
    // if (options.text){
    //     sendOptions.text = options.text
    // }else throw new Error('Missing Email content')
    // if (options.html){
    //     sendOptions.html = options.html    
    // }
    try{
        const res = await transporter.sendMail( {
            from: {
                name: 'Needle - Simple Thread',
                address: APP_EMAIL,
            }, // sender address
            to: to, // list of receivers
            subject: '[Needle - Simple Thread] Reset your password', // Subject line
            text: 'Please follow this link to reset your email, ignore this email if you did not request this.', // plain text body
            html: `<div>
                    <p>Please follow this link to reset your password, ignore this email if you did not request this.</p>
                    <a href=https://www.youtube.com/watch?v=9_gWQWumOa8>Reset Link</a></div>`, // html body
          })
    }
      catch(error){
        console.log(error)
      }
    
}
module.exports = emailer;