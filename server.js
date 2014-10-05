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
	io.emit("totalPlayers", connectedUsers.length);

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
		io.emit("startTimer", true);
	}

	socket.on("updateNames", function(arr){
		io.emit("updateNames", arr);
	});

	socket.emit("updateTimer", function(t){
		io.emit("updateTimer", t);
	});
	socket.emit("startGame", function(b){
		io.emit("startGame", b);
	});

	socket.on('outgoingBallUpdate', function(x, y, dx, dy){
		io.emit('incomingBallUpdate', x, y, dx, dy);
	});

	socket.on('outgoingPaddle1Update', function(x,y){
		io.emit('incomingPaddle1Update', x, y);
	});
	socket.on('outgoingPaddle2Update', function(x,y){
		io.emit('incomingPaddle2Update', x, y);
	});
	socket.on('outgoingPaddle3Update', function(x,y){
		io.emit('incomingPaddle3Update', x, y);
	});
	socket.on('outgoingPaddle4Update', function(x,y){
		io.emit('incomingPaddle4Update', x, y);
	});

	socket.on('disconnect', function(){
		connectedUsers.splice(connectedUsers.indexOf(socket.id), 1);
		console.log("A user disconnected");
	});
})

http.listen(3000, function(){
	console.log("Listening on *:3000");
})