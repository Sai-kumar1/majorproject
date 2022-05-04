// const sendmail = require('sendmail')();
const nodemailer = require("nodemailer");
const mailTemplate = require("./mailTemplate.js");



var smtpTransport = nodemailer.createTransport({
  service : "gmail",
  host: "smtp.gmail.com",
  auth:{
    user:"your mail address",
    pass:"your password"
  }
});


exports.sendMail = async (userInfo,messageData) => {
  let data = mailTemplate.renderMailTemplate(userInfo);
  if (messageData!=""){
    data = messageData
  }
  var mailinfo={
    from:"411808@student.nitandhra.ac.in",
    to:userInfo.email,
    subject: "Alert info",
    text: data,
  }
  console.log("sending mail")
  smtpTransport.sendMail(mailinfo, function(err, info) {
    if(err){
      console.log(err);
    }
    else{
      console.log("mail sent successfully");
    }
      // console.log(err && err.stack);
      // console.dir(reply);
  });
}

// sendMail({user:"random",email:"rand6953@gmail.com"},"");