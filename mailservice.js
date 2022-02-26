const sendmail = require('sendmail')();
 
sendmail({
    from: 'no-reply@foraproject.pythonanywhere.com',
    to: 'saikumar.gudur123@gmail.com',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});