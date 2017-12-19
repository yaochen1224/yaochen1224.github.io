var gameStarted = false;
var myGamePiece;
var myHitZone;
var myProgressBar;
var outerRing;
var captionArea;
var progress;
var myObstacles = [];
var mySound;
var myMusic;
var pumpCount = 0;
var comboCount = 0;
var startTime;
var elapsedTime;

function stopGame() {
  myGameArea.stop();
  myMusic.stop();
  myObstacles = [];
  gameStarted = false;
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  myGameArea.clear();
  // drawInactive(myGameArea.context);
  outerRing = new iProgressBar(15,"#e1e1e1", 129);
  myProgressBar = new iProgressBar(0,"#e6e6e6",121);
  captionArea = new iProgressBar(0,"#fff",100);
  progress = new iProgress(0);
  myHitZone = new component(30, 30,"img/handlove.png",500,320,"image");
  myGamePiece = new component(30, 30, "#FFEBEE", myGameArea.canvas.width, myGameArea.canvas.height);
  mySound = new sound("sounds/bounce.wav");
  myMusic = new sound("sounds/Bee Gees - Stayin' Alive.mp3");
  myMusic.play();
  myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    intro_screen : function() {
        this.canvas.width = 600;
        this.canvas.height = 360;
        this.context = this.canvas.getContext("2d");
        this.canvas.style="border:1px solid #eee;"
        document.getElementById("myCanvas").appendChild(this.canvas);
        this.context.font = "30px Helvetica";
        this.context.fillStyle = "#B71C1C";
        this.context.textAlign = "center";
        this.context.fillText("Pump With Music Tempo", this.canvas.width/2, this.canvas.height/2);
        this.context.font = "20px Arial";
        this.context.fillText("Press SPACE To Start", this.canvas.width/2, this.canvas.height/2 + 50);
    },
    start : function() {
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function iProgressBar(lineWidth, color, startAngle) {
  this.update = function() {
      var ctx = myGameArea.context;
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.fillStyle = color;
      ctx.arc(myGameArea.canvas.width/2,137.5,startAngle,0,2*Math.PI);
      ctx.fill();
  }
}

function iProgress(percentage) {
  this.percentage = percentage;
  this.comboCount = 0;
  this.update = function() {
    var barCTX = myGameArea.context;
  	var quarterTurn = Math.PI / 2;
  	var endingAngle = ((2*this.percentage) * Math.PI) - quarterTurn;
  	var startingAngle = 0 - quarterTurn;

  	// bar.width = bar.width;
  	barCTX.lineCap = 'square';
  	barCTX.beginPath();
  	barCTX.lineWidth = 20;
  	barCTX.strokeStyle = '#D32F2F';
  	barCTX.arc(myGameArea.canvas.width/2,137.5,111, startingAngle, endingAngle);
  	barCTX.stroke();

    barCTX.fillStyle = "rgba(0, 0, 0, 0.7)";
    barCTX.textAlign = "center";
    barCTX.font = "30px Helvetica";
    barCTX.fillText("Combo: "+this.comboCount, myGameArea.canvas.width/2, 137.5);
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.color = color;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
      ctx = myGameArea.context;
      if (type == "image") {
        ctx.drawImage(this.image,
          this.x,
          this.y,
          this.width, this.height);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y;
    if (myMusic.sound.currentTime >= 86.517551) {
       myGameArea.stop();
       myMusic.stop();
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myObstacles[i].color = '#D32F2F';
             mySound.play();
        }
    }
    myGameArea.clear();
    if (myGameArea.key && myGameArea.key == 32) {
    myGamePiece.x=500;
    myGamePiece.y=320;
    }else {
    myGamePiece.x=myGameArea.canvas.width;
    myGamePiece.y=myGameArea.canvas.height;
    }
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(29)) {
        x = 0;
        y = 320;
        myObstacles.push(new component(30, 30, "#FFCDD2", x, y));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += 5;
        myObstacles[i].update();
    }
    myGamePiece.newPos();
    myGamePiece.update();
    myHitZone.update();
    outerRing.update();
    myProgressBar.update();
    captionArea.update();
    progress.update();
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}


var pump = function(){
  pumpCount ++;
  //document.getElementById("count").innerHTML = pumpCount
};

window.addEventListener("keydown", function (e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
  if(event.keyCode == 32  && !gameStarted){
		startGame();
	}
  if(e.keyCode == 32 && gameStarted){
    pump();
    elapsedTime = Date.now() - startTime;
    console.log('elapsedTime ='+elapsedTime);
    startTime = Date.now();
    if(500<elapsedTime && elapsedTime<700){
      comboCount ++;
      progress.percentage = comboCount/30;
      progress.comboCount = comboCount;
      // document.getElementById("combo").innerHTML = comboCount
      if (comboCount >= 30) {
        document.getElementById("feedback").innerHTML = "Great Job! Now try pumping without looking at the tempos. Feel the beat!"
      } else if (comboCount >= 30) {
        document.getElementById("feedback").innerHTML = "You just healed a person!"
      } else {
        document.getElementById("feedback").innerHTML = " "
      }
    }else{
      comboCount=0;
      // document.getElementById("combo").innerHTML = comboCount
    }
  }
});
