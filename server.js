const { countReset, log } = require('console');
const express = require('express');
const app = express();
const path = require('path');
const thresholdOps = require("./static/js/threshold")
const mongoOperations = require('./mongo.js');

// print the request and response
app.use((req, res, next) => {
    console.log("Request: " + req.url);
    next();
});

app.use((req, res, next) => {
    console.log("Response: " + res.statusCode);
    next();
});


app.use(express.static(__dirname+'/static'));

app.get("/path.js",  (req, res) => {
    res.set("Content-Type", "text/javascript; charset=utf-8");
    res.sendFile(path.join(__dirname +"/static"+"/js"+"/path.js"));
    res.status(200);
});

app.get("/detection.js",  (req, res) => {
    res.set("Content-Type", "text/javascript; charset=utf-8");
    res.sendFile(path.join(__dirname +"/static"+"/js"+"/detection.js"));
    res.status(200);
});

app.post("/createTripWire", async (req, res) => {
    
    let body = "";
    req.on('data',function(data){
        body+=data
    })
    req.on('end',function(){
        // console.log(body);
        mongoOperations.updateTripwire(body);
    })    
    res.status(200);
    res.end();
});

app.post("/login",async (req, res) => {
    let body = "";
    req.on('data',function(data){
        body+=data
    });
    req.on('end',async function(){
        // console.log(body);
        requestBody = JSON.parse(body);
        items = await mongoOperations.findItem({"username":requestBody.username});
        // console.log(items);
        if(items.length == 0){
            await mongoOperations.createItem(requestBody);
        }
        else{
            await mongoOperations.updateSession(requestBody);
        }
        
    });
    
    res.send(body);
    res.status(200);

    res.end();
});

app.post("/detectTripWire", async (req, res) => {
    
    let body = "";
    let count= 0;
    req.on('data',function(data){
        body+=data
    })
    req.on('end',async function(){
        // console.log(body);
        requestBody = JSON.parse(body);
        items=await mongoOperations.findItem({"session":requestBody.session});
        requestBody["paths"].forEach(element => {
           if( items[0].tripwire[element.location]!=undefined && items[0].tripwire[element.location].includes(element.path)){
                count+=1;
                
           } 
        //    console.log(items[0].tripwire[element.location])
             //need to handle the threshold here     
        });
        // console.log(count);

        thresholdOps.threshold(count);
        thresholdOps.handling(count,requestBody.session)

        
    })    
    res.status(200);
    res.end();
});

app.post("/sendfile",async (req,res)=>{
    let restrictedPaths = {"/detectTripWire":true,"/createTripWire":true};
    let body = "";
    let filename = "";
    req.on('data',function(data){
        body+=data
    })
    req.on('end',async function(){
        
        requestBody = JSON.parse(body);
        console.log(body,requestBody);
        // if (requestBody.session == ""){
        //     res.status(404).json(JSON.stringify({"msg":"unable to process","status":"404"}));
        // }
        items=await mongoOperations.findItem({"session":requestBody.session});
        // console.log(items,items[0],items[0]["tripwire"],items[0]["tripwire"][requestBody.path])
        try{
            if (items.length>0 && !restrictedPaths[requestBody.path] && items[0]["tripwire"][requestBody.path].length>1){
                filename = "detection.js"
            }else{
                filename = "path.js"
    
            }
            // thresholdOps.threshold(count); 
            res.status(200).json(JSON.stringify({"filename":filename}));  
        }
        catch(e){
            console.log('error while parsing\n',e)
            res.status(500).json(JSON.stringify({"msg":"server error","status":"500"}));
        }
        
    });  
    
    
    // res.end();
});

app.listen(8000,"127.0.0.5",()=>{console.log(`listenig on port http://127.0.0.5:8000`)});
