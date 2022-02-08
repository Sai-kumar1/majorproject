const express = require('express');
const app = express();
const path = require('path');

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
});



app.post("/createTripWire", async (req, res) => {
    
    let body = "";
    req.on('data',function(data){
        body+=data
    })
    req.on('end',function(){
        console.log(body);
        mongoOperations.updateTripwire(body);
    })    
    res.status(200);
    res.end();
});

app.post("/login",async (req, res) => {
    let body = "";
    req.on('data',function(data){
        body+=data
    })
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
        
    })
    
    res.send(body);
    res.status(200);

    res.end();
})

app.listen(8000,"127.0.0.5",()=>{console.log(`listenig on port http://127.0.0.5:8000`)});
