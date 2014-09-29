var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connectedUsers = [];

io.on('connection', function(socket){
	console.log("A user connected");
	connectedUsers.push(socket.id);

	if(connectedUsers.length == 1){
		socket.emit('initIdentity', 'p1')
	}
	if(connectedUsers.length == 2){
		socket.emit("initIdentity", 'p2');
	}
	if(connectedUsers.length == 3){
		socket.emit('initIdentity', 'p3')
	}
	if(connectedUsers.length == 4){
		socket.emit("initIdentity", 'p4');
	}

	socket.on('disconnect', function(){
		connectedUsers.splice(connectedUsers.indexOf(socket.id));
		console.log("A user disconnected");
	});
})

http.listen(3000, function(){
	console.log("Listening on *:3000");
})