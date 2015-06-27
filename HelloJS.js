// JavaScript Document

//TODO: 
//Acceleration and reDraw problems?
//3D, with z axis
//electric charge with gaussian surface law
//electric acceleration

//how did rescale by redraw breaks mouseX mouseY values! V
//is this multi threading? onMouseHold vs reDraw? V
//initilization problems -> NaN types, undefined types V

var c = document.getElementById("HelloCanvas");
var p = document.getElementById("testOutput");
var ctx = c.getContext("2d");
var d = document.getElementById("mainDiv");
var cd = document.getElementById("HelloCanvasContainer");

var c2 = document.getElementById("canvas2");
var cd2 = document.getElementById("container");
//c.setAttribute('width', 100);
//c.setAttribute('height', 100);
c.setAttribute('width', cd.offsetWidth);
c.setAttribute('height', cd.offsetHeight);
//var grd = ctx.createLinearGradient(0,100, 500, 100);

var particleRadius = 1;

var reDrawInterval = 10;
setInterval(reDraw, reDrawInterval); 

var particlesX = new Array();
var particlesY = new Array();

var particlesFrictionMagnitude = 20;
var frictionPerDrawInterval = particlesFrictionMagnitude * reDrawInterval / 1000;

var particlesAccelerationMagnitude = 100;
var accPerDrawInterval = particlesAccelerationMagnitude * reDrawInterval / 1000;
var particlesAccelerationX = new Array();
var particlesAccelerationY = new Array();

var defaultParticlesAccelerationMagnitude = 30;
var defaultAccPerDrawInterval = defaultParticlesAccelerationMagnitude * reDrawInterval / 1000;
var defaultParticlesAccelerationX = new Array();
var defaultParticlesAccelerationY = new Array();
var defaultParticlesX = new Array();
var defaultParticlesY = new Array();

var useDefaultParticlesAcceleration = true;

var particlesVelocityX = new Array();
var particlesVelocityY = new Array();

var particleNumberX = 50;
var particleNumberY = 30;

var gravityCenterX = 0;
var gravityCenterY = 0;

var epsilonDist = 1;
var epsilonVelocity = 0.4;

var mouseHold = false;
var mouseX = 0;
var mouseY = 0;

initialize();
c.addEventListener("mousedown", onMouseDown, false);
d.addEventListener("mouseup", onMouseUp, false);
c.addEventListener("mousemove", onMouseMove, false);


function initialize(){
	
//	var grd = ctx.createRadialGradient(c.width / 2, c.height / 2, 500, c.width / 2, c.height/2, 0);
//	grd.addColorStop(0,"#FF0000");
//	grd.addColorStop(1,"#FFFF00");

//	ctx.fillStyle = grd;
    ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, c.width, c.height);
	ctx.fillStyle = "EEEEEE";
	ctx.beginPath();
	ctx.arc(250, 100, particleRadius, 0, Math.PI * 2, true);
	
	ctx.arc(c.width / 2, c.height / 2, particleRadius, 0, Math.PI * 2, true);
	
	ctx.closePath();
	ctx.fill();
	
	
	for (var i = 0; i < particleNumberX * particleNumberY; i++){
		particlesX[i] = 0;
		particlesY[i] = 0;
		defaultParticlesX[i] = 0;
		defaultParticlesY[i] = 0;
		defaultParticlesAccelerationX[i] = 0;
		defaultParticlesAccelerationY[i] = 0;
		particlesAccelerationX[i] = 0;
		particlesAccelerationY[i] = 0;
		particlesVelocityX[i] = 0;
		particlesVelocityY[i] = 0;
	}
	for (var i = 0; i < particleNumberX; i++)
		for (var j = 0; j < particleNumberY; j++){
			ctx.fillStyle = "EEEEEE";
			ctx.beginPath();
			var index = particleNumberX * j + i;
			defaultParticlesX[index] = (i + 1) * c.width /(particleNumberX + 1); 
			defaultParticlesY[index] = (j + 1) * c.height /(particleNumberY + 1);
			particlesX[index] = 0;
			particlesY[index] = c.height / 2;
			ctx.arc(particlesX[index], particlesY[index], particleRadius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		}
	//p.innerHTML = c.width + " " + c.height + " " + d.width + " " + d.height;
}

function onMouseUp(){
	mouseHold = false;
}

function onMouseDown(e){
	mouseHold = true;
	if (e.offsetX){
		mouseX = e.offsetX * c.width * 1.0 / cd.offsetWidth;
		mouseY = e.offsetY * c.height * 1.0 / cd.offsetHeight;
	}
	else if (e.layerX){
		mouseX = e.offsetX * c.width * 1.0 / cd.offsetWidth;
		mouseY = e.offsetY * c.height * 1.0 / cd.offsetHeight;
	}
}
function onMouseMove(e){
	if (mouseHold) onMouseHold(e);
}

function onMouseHold(e){
	
	if (e.offsetX){
		mouseX = e.offsetX * c.width / cd.offsetWidth;
		mouseY = e.offsetY * c.height / cd.offsetHeight;
	}
	else if (e.layerX){
		mouseX = e.offsetX * c.width / cd.offsetWidth;
		mouseY = e.offsetY * c.height / cd.offsetHeight;
	}
//	p.innerHTML = mouseHold + " " + mouseX + " " + mouseY + " "  + cd.offsetWidth + " " + cd.offsetHeight + " " + c.width + " " + c.height + " " + c2.width + " " + c2.height;
	//p.innerHTML = mouseX + " " + mouseY + " "  + cd.offsetWidth + " " + cd.offsetHeight;
	//gravityCenterX = mouseX;
	//gravityCenterY = mouseY;
}

function dist(x1, y1, x2, y2){
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
function reDraw(){
	//p.innerHTML = c.width + " " + c.height + " " + cd.offsetWidth + " " + cd.offsetHeight;
	//refesh position
	var v = Math.sqrt(particlesVelocityX[i] * particlesVelocityX[i] + particlesVelocityY[i] * particlesVelocityY[i]);
	for (var i = 0; i < particleNumberX * particleNumberY; i++){
		
		particlesX[i] += particlesVelocityX[i];
		particlesY[i] += particlesVelocityY[i];
		
		var v = Math.sqrt(particlesVelocityX[i] * particlesVelocityX[i] + particlesVelocityY[i] * particlesVelocityY[i]);
		
		//stabilize
		if ((dist(particlesX[i], particlesY[i], defaultParticlesX[i], defaultParticlesY[i]) < epsilonDist) && (v < epsilonVelocity)) {
			particlesX[i] = defaultParticlesX[i];
			particlesY[i] = defaultParticlesY[i];
			v = 0;
		}
		
		if (v > 0){
			if (v < frictionPerDrawInterval){
				particlesVelocityX[i] = 0;
				particlesVelocityY[i] = 0;
			}
			else{
				particlesVelocityX[i] -= frictionPerDrawInterval * (particlesVelocityX[i] / v);
				particlesVelocityY[i] -= frictionPerDrawInterval * (particlesVelocityY[i] / v);
			}
		}
	}
	
	if (mouseHold){
		//change gravity center -> new acceleration
		//if (Math.abs((mouseX * c.width) / cd.offsetWidth) > 200)
			//mouseX = (mouseX * c.width) / cd.offsetWidth;
		//if (Math.abs((mouseY * c.height) / cd.offsetHeight) > 200) 
			//mouseY = (mouseY * c.height) / cd.offsetHeight;	
			
		/*p.innerHTML = mouseHold + " " + cd.offsetWidth + " " + cd.offsetHeight + " " + Math.round(mouseX.toString()) + " " + Math.round(mouseY.toString()) + " " + Math.round(particlesX[1]) + " " + Math.round(particlesY[1]);*/
//		ctx.font="30px Verdana";
		for (var i = 0; i < particleNumberX * particleNumberY; i++){
			//gravity center affects
			//p.innerHTML += particlesVelocityX[i] + "\n"; 
			particlesVelocityX[i] += particlesAccelerationX[i];
			particlesVelocityY[i] += particlesAccelerationY[i];
			var distance;				
			distance = Math.sqrt( ((particlesX[i] - mouseX) * 
									(particlesX[i] - mouseX)) + 
									((particlesY[i] - mouseY) * 
									(particlesY[i] - mouseY)) );
			if (distance > 0){					
				particlesAccelerationX[i] = accPerDrawInterval * ((mouseX - particlesX[i]) / distance);
				particlesAccelerationY[i] = accPerDrawInterval * ((mouseY - particlesY[i]) / distance);
			}
		}
	}
	if (useDefaultParticlesAcceleration) {
		for (var i = 0; i < particleNumberX * particleNumberY; i++){
			//default gravity center affects
			//stabilize 
			/*if (!((v == 0) && (particlesX[i] == defaultParticlesX[i]) && (particlesY[i] == defaultParticlesY[i]))){*/
			if (! ((v < epsilonVelocity) && (particlesX[i] == defaultParticlesX[i]) && (particlesY[i] == defaultParticlesY[i]))){
				particlesVelocityX[i] += defaultParticlesAccelerationX[i];
				particlesVelocityY[i] += defaultParticlesAccelerationY[i];
			}
			var distance;				
			distance = Math.sqrt( ((particlesX[i] - defaultParticlesX[i]) * 
									(particlesX[i] - defaultParticlesX[i])) + 
									((particlesY[i] - defaultParticlesY[i]) * 
									(particlesY[i] - defaultParticlesY[i])) );
			if (distance > 0){					
				defaultParticlesAccelerationX[i] = defaultAccPerDrawInterval * ((defaultParticlesX[i] - particlesX[i]) / distance);
				defaultParticlesAccelerationY[i] = defaultAccPerDrawInterval * ((defaultParticlesY[i] - particlesY[i]) / distance);
			}
		}
	}
	//p.innerHTML = i + " ";
	drawParticles();
}

function drawParticles(){
	//var grd = ctx.createRadialGradient(c.width / 2, c.height / 2, 500, c.width / 2, c.height/2, 0);
//	var grd = ctx.createRadialGradient(mouseX, mouseY, 200, mouseX, mouseY, 0);
//	grd.addColorStop(0,"#FF0000");
//	if (mouseHold) 
//		grd.addColorStop(1,"#FFFF00");
//	else
//		grd.addColorStop(1,"#FF0000");
//	ctx.fillStyle = grd;
    ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, c.width, c.height);
		
	/*ctx.fillStyle = "EEEEEE";
		ctx.beginPath();
		ctx.arc(250, 100, particleRadius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();*/
		
	for (var i = 0; i < particleNumberX * particleNumberY ; i++){
		ctx.fillStyle = "#FFF";
		ctx.beginPath();
		ctx.arc(particlesX[i], particlesY[i], particleRadius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}
}
