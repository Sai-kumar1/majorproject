exports.renderMailTemplate= (userInfo )=> {
return `hello ${userInfo.user},

  We found some tripwire activity from your account.
  
  This is the alert message to warn you to not click the tripwire elements again.


  Thankyou,
  https://foraproject.pythonanywhere.com`

}