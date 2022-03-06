const axios = require("axios")
const mailService = require("../../mailservice")
const mongoOps=require("../../mongo.js")

exports.threshold= (count) =>{
    if(count>=1 && count<=2){
        //need to include timeperiod
        //under 2 minutes if the threshld count is 2 then logout device, greater than 4 ban device
        //count ==2 ->logout device
        //count ==4 -> bandevice
        return "sendmail"
    }else if(count>=2 && count<4){
        console.log("your device will be logged out")
         return "logout"

    }else{
        console.log("your device will be banned")
        return "banned"
    }


}
function redirect(topath){
    axios.post("http://localhost:8080/redirect",{
        "redirect":topath
    });
}
exports.handling=(x,sessionid)=>{
    let conditions = {
        "session" : sessionid
    }
    let returnstring =""
    let updations= {}
     if(x=="banned"){
        
        updations = {
            "session" : "",
            "banned":"True"
        }
        
         returnstring=  "destroyuser"
     }else if(x="logout"){
        //  let conditions = {
        //      "session" : sessionid
        //  }
         updations = {
             "session" : ""
         }
        //  mongoOps.updateItem(conditions,updations);
        returnstring=  "emptysession"
     }
     item = mongoOps.updateItem(conditions,updations);
     console.log(item);
     redirect("/login");
     mailService.sendMail({"user":item["username"]});

return returnstring
 }