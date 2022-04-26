// const sendmail = require('sendmail')();
const nodemailer = require("nodemailer");
const mailTemplate = require("./mailTemplate.js");



var smtpTransport = nodemailer.createTransport({
  service : "gmail",
  host: "smtp.gmail.com",
  auth:{
    user:"411808@student.nitandhra.ac.in",
    pass:"pllwiebvwizghoxi"
  }
});


exports.sendMail = (userInfo,messageData) => {
  let data = mailTemplate.renderMailTemplate(userInfo);
  if (messageData!=""){
    data = messageData
  }
  console.log("sending mail")
  smtpTransport.sendMail({
      to: userInfo.email,
      subject: "Alert info",
      text: data,
    }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
  });
}