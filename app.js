/**
 * App configuration.
 */

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs')
 app.listen(3000);
/**
 * Socket.IO server (single process only)
 */

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
		function (err, data) {
		    if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		    }

		    res.writeHead(200);
		    res.end(data);
		});
}

var mio = io;
var users=new Array();
var log=new Array();
mio.sockets.on('connection', function (socket) {
	//save the new user and broadcast the list of user
	socket.on("connect", function(user) {
		//user =JSON.parse(msg);
		users.push(user);
		socket.sig=user.sig;
		io.sockets.emit("users",users);
		console.log(user);
		
	    });
	//edit a user
	socket.on("user",function(user){
		//user=JSON.parse(msg);
		for(i in users){
		    if(users[i].sig==user.sig){
			users[i]=user;
			break;
		    }		
		}
		io.sockets.emit("users",users);
		
	    });
	//send log to user
	socket.on('log',function(msg){
		//create some lag if the log is quite big
		//TODO move the handling of this to the static server
		//socket.volatile.emit("log",JSON.stringify(log));   
		for(i in log){
		    socket.volatile.emit("log",log[i]);
		}
	    });
	socket.on('m',function(msg){
		//sig x y ( move caret)
		for(i in users){
		    if(users[i].sig==msg.sig){

			users[i].x=msg.x;
			users[i].y=msg.y;
		    }		
		}

		io.sockets.emit("m",msg);
	    });
	socket.on('c',function(msg){
		//char sig
		for(i in users){
		    if(users[i].sig==msg.sig){
			users[i].str=msg.str;
		    }		
		}
		io.sockets.emit("c",msg);
	    
	    });
	socket.on("bksp",function(msg){
		//BACKSPACE BITCHES
		socket.volatile.broadcast.send("bksp",msg);
		socket.volatile.emit("bksp",msg);
	    });
	socket.on("v",function(msg){
		
		//CRLF
		console.log("crlf begin")
		io.sockets.emit("v",msg);
		console.log(msg);
		console.log("crlf end");
		for(i in users){
		    if(users[i].sig==msg.sig){
			users[i].str="";
			users[i].x=msg.x;
			users[i].y=msg.y;
			msg.colorindex=users[i].colorindex;
			msg.fontindex=users[i].fontindex;
			msg.size=users[i].size;
			msg.rot=users[i].rot;
		    }		
		}
		if(msg.str!=""){
		    
		    log.push(msg);
		}
		console.log("no bug around");
	    });
	
	socket.on('disconnect', function () {
		//remove the disconnected user from the list
		console.log("deco begin");
		for(i in users){
		    if(users[i].sig==socket.sig){
			users.splice(i,1);
			break;
		    }		
		}
		io.sockets.emit("users",users);
		console.log("deco ok");
	    });
	
       	socket.on('message', function(msg) {
		console.log(msg);/**
		   if(msg.indexOf('log')!=0){
		    var message=JSON.parse(msg);
		    socket.volatile.send(msg);
		    socket.volatile.broadcast.send(msg);
		      messages.push(msg);
		      if(message.sig==0&&message.str!=""){
			  
			  log.push(message);
		      }
		}else{
		    
		}*/
	    });
	
    });
