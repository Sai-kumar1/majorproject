const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/majorproject', { useNewUrlParser: true, useUnifiedTopology: true });

const tripWireModel = mongoose.model('tripwires', new mongoose.Schema({
    "username": String,
    "tripwire": {},
    "session": String,
    "email":String,
    "tripwireCreated":String,
    "banned":Boolean

})) ;

exports.updateTripwire = async (body) => {
    body = JSON.parse(body);
    let userdata={};
    
    try{
        let data = await tripWireModel.find({$or:[{"username":body.username},{"session":body.session}]}).exec();
        userdata = data[0];
        // console.log(userdata.tripwire)
        let tripwires = userdata.tripwire;
        
        tripwirePath = "tripwire."+body.path;
        // console.log(tripwirePath)
        if(!tripwires[body.path]){
            // console.log("if statement")
            tripwires[body.path] = [body.elementPath];
            console.log(tripwires);
            let sol = await tripWireModel.findOneAndUpdate({"session":body.session},{$set:{"tripwire":tripwires}}).exec();
            // console.log(sol);
        }
        else{
            // console.log("else statement")

            // tripwire[body.path].push(body.elementPath);
            let k = await tripWireModel.findOneAndUpdate({"session":body.session},{$push: {[tripwirePath]:body.elementPath}}).exec();
            // console.log(k);
        }
        // console.log(body.path);
        
    }
    catch(err){
        // console.log(err);
    }
}

exports.updateSession = async (body) => {
    await tripWireModel.findOneAndUpdate({"username": body.username},{"session":body.session }).exec();
    // console.log(body)
}

exports.createItem = async (body) => {
    try{
        // console.log(body);
        let data = await tripWireModel.create({"username": body.username, "tripwire": {"/":[]}, "session": body.session, "email": body.email,"tripwireCreated":"False","banned":false});
        // console.log(data);
    }
    catch(err){
        // console.log(err);
    }
    
}

exports.findItem = async(conditions)=>{
    let data = await tripWireModel.find(conditions).exec();
    // console.log(data);
    return data;
}

exports.deleteItem=async(conditions)=>{
    try{
        let data = await tripWireModel.deleteOne(conditions);
        // console.log(data);
    }
    catch(err){
        console.log(err);
    }
}

exports.updateLogoutSession = async (body) => {
    await tripWireModel.findOneAndUpdate({"session": body.session},{"session":"" }).exec();
    // console.log(body)
}
exports.updateItem=async(conditions,updations)=>{
    return await tripWireModel.findOneAndUpdate(conditions,updations).exec();
}
