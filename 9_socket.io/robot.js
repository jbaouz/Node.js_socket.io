//###################################################################################
// npm init -y (pour le json package)
// npm i express (pour express)
// npm i socket.io
//###################################################################################
const express = require('express')
let app = express()
let fs = require('fs')
const http = require('http')
let server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server)

app.use(express.static('public'))

let port = 8080
let manetteID = "";
let robotID = "";

// lien vers les fichiers html
app.get('/public',function(req,res){
    res.sendFile(__dirname+"/manette.html");
});
app.get('/public',function(req,res){
    res.sendFile(__dirname+"/robot.html");
});

//------------------------------------------------------------------------------------

// init serveur - side
io.on("connection", (socket) => {
    // message depuis le client manette
    socket.on('manette',(msg)=>{
        console.log("manette connected  : " + msg);
        manetteID = msg
    })
    // message depuis le client robot
    socket.on('robot',(msg)=>{
        console.log("robot connected  : " + msg);
        robotID = msg ;
    })
    // init command from manette
    socket.on('command',(msg)=>{
        console.log("command : " + msg);
        // si robot sans ID, envoyer "" à manette
        if(robotID === ""){ socket.emit("norobot","")}
        // transmet l'id "up, down, right ou left" au robot
        io.to(robotID).emit("move",msg);
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected ");
    });
});

server.listen(port, () => {
    console.log("\n\nserver launched at : http://localhost:"+port);
});

