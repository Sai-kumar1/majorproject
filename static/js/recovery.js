// const mongo = require("../../mongo")
// const { mongo } = require("mongoose");
const mailservice = require("../../mailservice");

exports.sendRecoveryMail = async function(userInfo){
    recoveryString = userInfo["_id"] + new Date().getTime().toString();
    message = "press the link with in 2 days to recover your account. http://127.0.0.5:8000/recover/"+recoveryString;
    await mailservice.sendMail({email:userInfo.email},message);
}

function sendRecoveryMail(userID){
    timestring = new Date().getTime().toString();
    recoveryString = userID + "-" +timestring;
    message = "press the link with in 2 days to recover your account. http://127.0.0.5:8000/recover/"+recoveryString;
    mailservice.sendMail({email:"rand6953@gmail.com"},message);
}
exports.checkRecovery = function (queryString){
    console.log(queryString)
    parameters = queryString.split("-");
    recoveryGeneratedTime = Number(queryString);
    presentTime = new Date().getTime();
    if(presentTime - recoveryGeneratedTime > 172800){
        console.log("Error in account recovery");
        return "failure";
    }else{
        console.log("successful login");
        return "success";
    }
}

// sendRecoveryMail("6268b482fce632d805001042");