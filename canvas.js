/////////////////////////////////////////////////
//            Alaeri 2011
//    ask me to put this on github
//   and I will include a nice how-to                   
/////////////////////////////////////////////
//    This code could use some love
//              ME TOO
//////////////////////////////////////////////


// Init stuff we will need later
// I dont know how to code in js :/

var img="http://zombilical.org/avatar1";
var buffer="";
var x=100;
var y=100;
var editing=false;
var ctx=$('#c').get(0).getContext("2d");
var ctx2=$('#c2').get(0).getContext("2d");
var ctx3=$('#c3').get(0).getContext("2d");
ctx2.fillStyle="#efefef";
ctx2.fillRect(0,0,1400,2000);
var sig=Math.random();
var ws;
var mimages=new Array();
var user=new User();
var fonts=new Array('Delius Unicase', 
		    'Vidaloka',
		    'Questrial',
		    'Comfortaa', 
		    'Rationale',
		    'Geostar Fill',
		    'Rokkitt', 
		    'Buda');



var nick='Inspector Tiger';
var fbid='';



var intros=new Array('Bonjour','Ceci est un salon de discussion, anonyme, instantanee et ephemere','Il est moins contraint que les salons normaux','Vous pouvez cliquer sur la page et commencer a parler ','Il y a une barre a droite avec trois boutons','pour changer la police et la couleur du texte','Si vous voulez pouvoir voir les discussions precedentes, ou effacer la discussion,','plaignez vous','Les barres grises des cotes se reduisent en les cliquant','Ce n est plus completement anonyme en fait','Le chargement est fini mais je rajoute une ligne','pour que ca ait l air plus complexe');
//INTRODUCTION
var introidx=0;
var charidx=0;
var introy=500;
var introx=500;

var introIntervalId=setInterval(function(){
	if(charidx==0){
	    introy+= 20;
	}
	var intromsg=new message();
	sentence=intros[introidx].substr(0,charidx++);
	intromsg.sig=sig;
	if(charidx==intros[introidx].length+1){
	    charidx=0;
	    introidx++;
	    intromsg.sig=0;
	    if(introidx==intros.length){
		clearInterval(introIntervalId);
	    }
	}
	
	intromsg.x=introx;
	intromsg.y=introy;
	intromsg.str=sentence;

	//receiveLettre(JSON.stringify(intromsg));
    },1);

for (i in fonts){
    $("#hidden").append("<span style='font-family:"+fonts[i]+"'>the quick fox jumps over the lazy dog</span>");
}
var colors=new Array("000000","111188","ff00cc","234567","999999","00cc10","111166");
var nickinput=$("#nickinput").get(0);
var input=$("#input").get(0);
input.value=buffer;
setInterval(function() {
	if (input.value!=buffer) {
	    buffer=divide(input.value);
	    input.value=buffer;
	    //sendLettre(buffer);
	    
	}
	//	if(!canvasFocus && nickinput.value.contains('\n')){
	//    nick=nickinput.value;
	//    sendUser();
	//    canvasFocus=true;
	//}
	if(canvasFocus){
	    input.focus();
	}
	
    }, 10);

ctx.font = "20pt "+fonts[0];
ctx2.font = "20pt "+fonts[1];
ctx3.font="20pt Arial";
var canvasFocus=true;
var colorindex=0;
var imageindex=1;
var fontindex=6;
var size=20;
var users=new Array();
var messages=new Array();
var rot=0;//15*Math.PI/180;
function divide(text){
    
    
    for(i in text){
	nx=x+ctx.measureText(text.substr(0,i)).width+10;
	if(text.charAt(i)=='\n'||nx>1400){
	    tempmot=text.substr(0,i);
	    reste=text.substr(i,text.length);
	    if(reste.charAt(0)=='\n'){
		reste=reste.substr(1,reste.length)
       	    }
	    y+=ctx.measureText("m").width;
	    sendMot(tempmot);
	    
	    
	    return divide(reste);
	}
    }
    addChar(text);
    return text;
}
//TODO Securise against XSS injection 
function listUsers(){

    var idImg="";
    var idNick="";
    var idDiv="";
    var i=0;
    $("#users").empty();
    for(var i in users){
	if(users[i].sig==sig){
	    idImg=" id='imageUser'"; 
            idNick=" id='nickinput' contenteditable='true'";
	    idDiv=" id='userdiv'";
	} 
	if(users[i].img!=""){
	    $("#users").append("<div class='user' "+idDiv+"style='color:"+colors[users[i].colorindex]+"; font-family:"+fonts[users[i].fontindex]+";'><img  src='"+users[i].img+"' width='50px' height='50px'" +idImg+"/><span "+idNick+">"+users[i].nick+"</span></div>");
	    
	}else if(users[i].fbid!=""){
	    $("#users").append("<div class='user' style='color:"+colors[users[i].colorindex]+"; font-family:"+fonts[users[i].fontindex]+"; '><img  src='http://graph.facebook.com/" + users[i].fbid + "/picture'/>"+ users[i].nick+"</div>");
	    
	}
	
    }
    addLetter(undefined);
    $('.user').click(function(e) {
	e.stopPropagation(); 
 	e.preventDefault();
	});
    $('#imageUser').click(function(e) {
	e.stopPropagation(); 
 	e.preventDefault();
	imageindex++;
	if(imageindex==10){
	    imageindex=0;
	}
	img="http://zombilical.org/avatar"+imageindex;
	sendUser();
	});
    $('#nickinput').click(function(e) {
	e.stopPropagation(); 
 	e.preventDefault();
	canvasFocus=false;
	this.focus();
	});
  
    
}
    


var socket;
function User(){
    this.rot=rot;
    this.sig=sig;
    this.img=img;
    this.fontindex=fontindex;
    this.colorindex=colorindex;
    this.size=size;
    this.nick=nick;
    this.fbid=fbid;
    this.str=buffer;
    this.x=x;
    this.y=y;


}
function m(){
    this.sig=sig;
    this.x=x;
    this.y=y;
    
}
function v(){
   this.sig=sig;
   this.x=x;
   this.y=y;
   this.str=buffer; 
}
function Char(str){
    this.str=buffer;
    this.sig=sig;
}

function message(){
    this.img="";
    this.str="";
    this.sig=0;
    this.x=0;
    this.y=0; 
    this.fontindex=6;
    this.colorindex=0;
    this.size=20;
    this.nick=nick;
    this.fbid=fbid;
}

$(document).ready(function() {
  socket = io.connect('http://zombilical.org:3000');
  //  socket.on('message', function (data) {
  //	  if(!data.indexOf("log")==0){
  //	      receiveLettre(data);
  //	  }else{
  //	      receiveLogs(data.substr(3,data.length));
  //	  }
  //    });
  socket.on('connect',function(){
	  //sendLettre(buffer);
	  initUser();
	  socket.emit("log","");
  });
  socket.on("m",function(data){
	  draw(data);
	  console.log(data);
      });
  socket.on("c",function(data){
	  addLetter(data);
	  console.log(data);
      });
  socket.on("v",function(data){
	  crlf(data);
	  console.log(data);
      });
  socket.on("users",function(data){
	  refreshUsers(data)
	  console.log(data);;
      });

  socket.on("log",function(data){
	  log(data);
	  console.log(data);
      });

});
function initUser(){
    socket.emit("connect",new User());
    console.log(user);
}
var logindex=0;
var msgs;
var logIntervalId=0;
/***
function receiveLogs(str){
    if(logIntervalId!=0){
	return;
    }
    try{
    msgs=JSON.parse(str);
    }catch(err){
	console.log(str);
	clearInterval(logIntervalId);
	logIntervalId=0;
	return;
    }
    logIntervalId=setInterval(function(){
	    receiveLettre(JSON.stringify(msgs[logindex++]));	
	    if(logindex>=msgs.length){
	    clearInterval(logIntervalId);
	    logindex=0;
	    logIntervalId=0;
	    }
},10);
}*/

function refreshUsers(msg){
    users=msg;
    listUsers();
    
}
function addLetter(str){
    //empty this canvas
    ctx3.clearRect(0,0,1400,1000);
    ctx.clearRect(0,0,1400,1000);
    //c=JSON.parse(str);
    //
    c=str;
    soundPlay();
 
    for(var i in users){	
	user=users[i];
	ctx3.save();
	ctx.save();
	if(str!=undefined && user.x !=undefined && user.sig==c.sig){
	    user.str=c.str;
	}
	//add the letter to the user buffer
	ctx3.strokeStyle=colors[user.colorindex];
	ctx3.fillStyle=colors[user.colorindex];
	ctx3.font=(user.size+2)+" px "+fonts[user.fontindex];

	ctx3.translate(user.x,user.y);
	ctx.translate(user.x,user.y);
	ctx3.rotate(user.rot);
	ctx.rotate(user.rot);

	ctx3.fillText(user.str,0,0);
	ctx3.strokeText(user.str,0,0);
		//draw the user caret
	xx=ctx3.measureText("|").width;
	ctx3.fillText("|",-xx,0);
	printImage(user);
	
	ctx3.font=10+" px Arial";
	ctx3.translate(-4,0);
	ctx3.rotate(-90 * Math.PI / 180);
	
	ctx3.fillText(user.nick,0,0);
	
	ctx3.restore();
	

	
    }
 

}
function printImage(user){
    for(i in mimages){
	if( mimages[i].src == user.img ){
	    ctx.drawImage(mimages[i],-42,-30,30,30);
	    ctx.restore();

    
	    return;
	}
	
    }
    imag=new Image();   // Create new img element
    imag.onload = function(){
	ctx.drawImage(this,-42,-30,30,30);
	ctx.restore();

    
    };
    imag.src = user.img; // Set source path
    mimages.push(imag);
   
}
function save(){
    window.open($('#c2').get(0).toDataURL());
}
function draw(msg){
    for(i in users){
	if(users[i].sig==msg.sig){
    
	    user=users[i];
	    
	    ctx2.fillStyle = colors[user.colorindex];
	    ctx2.beginPath();
	    ctx2.moveTo(user.x, user.y);
	    ctx2.strokeStyle=colors[user.colorindex];
	    //ctx2.strokeWidth="2px";
	    
	    //ctx2.arc(user.x,msg.-<9y,2, 0, Math.PI * 2, true);
	    //ctx2.arc(user.x,user.y,1, 0, Math.PI * 2, true);
	    ctx2.lineTo(msg.x,msg.y);
	    ctx2.closePath();
	    ctx2.fill();
	    ctx2.stroke();
	    user.x=msg.x;
	    user.y=msg.y;
	    ctx2.fillStyle = "rgba(240, 241, 240, 0.003)";
	    ctx2.fillRect(0, 0, 1400, 2000);
	  
	}	
    }
}
function log(msg){

	    ctx2.save();
	    
	    ctx2.translate(msg.x,msg.y);
	    ctx2.rotate(msg.rot);

	    ctx2.fillStyle=colors[msg.colorindex];
	    ctx2.strokeStyle=colors[msg.colorindex];
	   
	    ctx2.font=(msg.size+2)+" px "+fonts[msg.fontindex];
	    ctx2.fillText(msg.str,0,0);

	      ctx2.restore();
	    //whiten background
	    ctx2.fillStyle = "rgba(240, 241, 240, 0.03)";
	    ctx2.fillRect(0, 0, 1400, 2000);
	  

}     
function crlf(str){
  
    //rv=JSON.parse(str);
    rv=str;
    for(i in users){
	if(users[i].sig==rv.sig){
	    //write user buffer to canvas
	    user=users[i];
	    ctx2.save();
	    
	    ctx2.translate(user.x,user.y);
	    ctx2.rotate(user.rot);

	    ctx2.fillStyle=colors[user.colorindex];
	    ctx2.strokeStyle=colors[user.colorindex];
	   
	    ctx2.font=(user.size+2)+" px "+fonts[user.fontindex];
	    ctx2.fillText(user.str,0,0);
	    //change title
	    if(user.str!=''){
		document.title="CloudOfThoughts "+user.str ;
	    }
	      ctx2.restore();
	    //whiten background
	    ctx2.fillStyle = "rgba(240, 241, 240, 0.03)";
	    ctx2.fillRect(0, 0, 1400, 2000);
	  

	    //then empty buffer and move user coordinates
	    user.str="";
	    user.x=rv.x;
	    user.y=rv.y;
	    
	    
	}

    }
    listUsers();
}

function sendUser(){
    user =new User();
    socket.emit("user",user);
}


function sendMot(str){
    
    //Si on a mis une url d image
    if(str.indexOf("/img")==0){
	img=str.substr(5,str.length);
	user.img=img;
	//$("#image").get(0).src=str.substr(5,str.length);
	sendUser();
	return;
    }
    //Si on a mis un nouveau nick
    if(str.indexOf("/nick ")==0){
	nick=str.substr(5,str.length);
	$("#name").empty();
	$("#name").append(nick);
	sendUser();
	return;
    }
    if(str.indexOf("/notif")==0){
	    soundoff=!soundoff;
	   
    }

    msg=new v();
    msg.str=str;
    console.log(msg);
    socket.emit("v",msg);
}
function addChar(str){
    c=new Char();
    c.str=str;
    socket.emit("c",c);
    input.focus();
}

$('.fb_button fb_button_medium').click(function(e){
	console.log("click");
   e.stopPropagation(); 
   //  e.preventDefault();
    });
$('#colorbox').click(function(e) {
    e.stopPropagation(); 
    e.preventDefault();
    colorindex++;
    if(colorindex==colors.length){
	colorindex=0;
    }
    sendUser();
    //$("#name").get(0).style.color=colors[colorindex];
    this.style.backgroundColor=colors[colorindex];
});


$('#fontbox').click(function(e) {
	e.stopPropagation(); 
 	e.preventDefault();
	fontindex++;
	if(fontindex==8){
	    fontindex=0;
	}
	
	this.style.fontFamily=fonts[fontindex];
	 sendUser();
	 //	sendLettre(buffer);
    });

$('#sizebox').click(function(e) {
	e.stopPropagation(); 
 	e.preventDefault();
	size+=2;
	if(size>=30){
	    size=10;
	}
	this.style.fontSize=size+'pt';
	sendUser();

    });

$('#videobox').click(function(e){
	e.stopPropagation();
	e.preventDefault();

	//rot+=90*Math.PI/180;
	//console.log("ROTATION"+rot);
	
	//sendUser();//socket.emit("log");
	save();
    });

/**
 * Click to move the caret
 * TODO: draw with the mouse
 *
 */
var isDrawing=false;
$('#c').mousedown(function(e){
    isDrawing=true;
    if(!canvasFocus){
	
	canvasFocus=true;
	nick=$("#nickinput").get(0).innerHTML;
	sendUser();
    }
    
    input.focus();
    r=Math.sqrt(x*x+y*y);
    sendMot(buffer);
    //on passe en mode edition
    editing=true;
    buffer="";
    input.value="";
    //on enregistre les coordonnees du clic
    divcanvas=$("#canvasdiv").get(0);
	//rot+=10*Math.PI/180;
    x=e.pageX-(divcanvas.offsetLeft);
    y=e.pageY;
    
    socket.emit("v",new v());
    input.focus();
	
    });

$('#c').mouseup(function(e){
    isDrawing=false;
	

});

$('#c').mousemove(function(e){
    if(isDrawing){
	divcanvas=$("#canvasdiv").get(0);
	x=e.pageX-(divcanvas.offsetLeft);
	y=e.pageY;
	socket.emit("m",new m());

    }
    });

//======================================================================
var soundEmbed = null;
//======================================================================
var soundoff=true;
function soundPlay(which)
{
    if(soundoff){
	return;
    }
    which="typewriter-key-1"
	if (!soundEmbed)
	 {
	    soundEmbed = document.createElement("embed");
	    soundEmbed.setAttribute("src", "/snd/"+which+".mp3");
	    soundEmbed.setAttribute("hidden", true);
	    soundEmbed.setAttribute("autostart", true);
		}
	else
	 {//
	  document.body.removeChild(soundEmbed);
	  soundEmbed.removed = true;
	    soundEmbed = null;
	    soundEmbed = document.createElement("embed");
	    soundEmbed.setAttribute("src", "/snd/"+which+".mp3");
	    soundEmbed.setAttribute("hidden", true);
	    soundEmbed.setAttribute("autostart", true);
	 }
    soundEmbed.removed = false;
    document.body.appendChild(soundEmbed);

}
//======================================================================
/**
 * Animation of the side panels
 * Straigth simple
 */
var panelr=true;
var panell=true;
$('#right').click(function(){
	if(!panelr){
	    $('#right').animate({ right: '+=220'}, 500, function() {});
	    panelr=true;
	}else{
	   $('#right').animate({ right: '-=220'}, 500, function(){});
	   panelr=false;
	}
    });
$('#left').click(function(){
	if(!canvasFocus){
	    return;
	}
	if(!panell){
	    $('#left').animate({ left: '+=220'}, 500, function() {});
	    panell=true;
	}else{
	   $('#left').animate({ left: '-=220'}, 500, function(){});
	   panell=false;
	}
    });
 