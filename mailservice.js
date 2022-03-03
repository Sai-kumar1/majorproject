// const sendmail = require('sendmail')();
const nodemailer = require("nodemailer");
const mailTemplate = require("./mailTemplate.js");



var smtpTransport = nodemailer.createTransport({
  service : "gmail",
  host: "smtp.gmail.com",
  auth:{
    user:"411808@student.nitandhra.ac.in",
    pass:"qvlbkmsnbrtsjdgm"
  }
});


exports.sendMail = (userInfo) => {
  let data = mailTemplate.renderMailTemplate(userInfo);

  smtpTransport.sendMail({
      to: userInfo.email,
      subject: "Account Closed",
      text: data,
    }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
  });
}