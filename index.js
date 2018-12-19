var express=require('express')
var socket=require('socket.io')
var app=express()
var cors=require('cors')

require('dotenv').config()
var PORT=process.env.PORT_NUMBER||4000
var people = {};
app.use(cors())

var server=app.listen(PORT,function(){
  console.log("listening to port number "+PORT)
})
app.use(express.static('public'))//app.use('/static',express.static('public'))
//app.use('/static', express.static(path.join(__dirname, 'public')))//absolute directory

/*app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});*/

//setup our server
//var io=socket.listen(port_number,ip address)
var io=socket(server)//take which port number serve as listening port
// io.on('connection',function(socket){//we can use socket paramet to generate an id for each socket like socket.id
//   console.log("socket connection made")
//   socket.on('disconnect',function(){
//     console.log("user disconnected")
//   })
//   socket.on('group_chat',function(data){
//     io.sockets.emit('group_chat',data)
//     console.log(data)
//   })
//   socket.emit('request',function(){
//     console.log("emit an event to the socket")
//   })
//   socket.on('people',function(){
//     io.sockets.socket
//   })
// })


io.on("connection", function (socket) {

  socket.on("join", function(name){
    people[socket.id] = name;
    socket.emit("update", "You have connected to the server.");
    io.sockets.emit("update", name + " has joined the server.")
    io.sockets.emit("update-people", people);
  });

  socket.on("send", function(msg){
    io.sockets.emit("chat", people[socket.id], msg);
  });

  socket.on("disconnect", function(){
    io.sockets.emit("update", people[socket.id] + " has left the server.");
    delete people[socket.id];
    io.sockets.emit("update-people", people);
  });
})
