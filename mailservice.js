// const sendmail = require('sendmail')();
const nodemailer = require("nodemailer");
// const fs = require("fs")

// const data = fs.readFile("./mailTemplate.txt")


var smtpTransport = nodemailer.createTransport({
  service : "gmail",
  host: "smtp.gmail.com",
  auth:{
    user:"411808@student.nitandhra.ac.in",
    pass:"qvlbkmsnbrtsjdgm"
  }
});


exports.sendMail = (userInfo) => {
  let data = `hello ${userInfo.user},

  We have found that some thing wrong is going on in your account.That may be an intruder.

  So we are closing your account ,please log in again.

  Thankyou,
  https://foraproject.pythonanywhere.com`

  smtpTransport.sendMail({
      // from: 'no-reply@foraproject.pythonanywhere.com',
      to: userInfo.email,
      subject: "Account Closed",
      text: data,
    }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
  });
}