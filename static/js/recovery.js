// const mongo = require("../../mongo")
// const { mongo } = require("mongoose");
const mailservice = require("../../mailservice");

exports.sendRecoveryMail = function(userID){
    recoveryString = userID + Date.getTime().toString();
    message = "press the link with in 2 days to recover your account. https://127.0.0.5/recover/"+recoveryString;
    mailservice.sendMail({},message);
}

exports.checkRecovery = function (queryString){
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