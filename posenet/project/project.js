//Variable Declaration
var startScreen = document.getElementById("startGame");
var endScreen = document.getElementById("endGame");
var messageArea = document.getElementById("header");
var message = document.getElementById("message");
var videoArea = document.getElementById("videoArea");
var topScore = localStorage.getItem("currentTopScore");
var game_started_here = false;
var waitingForJump = false;

//Background image
const bgImg = require('./minecraft_river_side.jpg') ;
var bg = new Image();
bg.src = bgImg;

//Declaring player sprite
const playerSource = require('./steve.png');
var playerSprite = new Image();
playerSprite.src = playerSource;

//Declaring anvil sprite
const anvilSource = require('./anvilImage.png');
var anvilSprite = new Image();
anvilSprite.src = anvilSource;

//Declaring diamond sprite
const diamondSource = require('./diamondImage.png');
var diamondSprite = new Image();
diamondSprite.src = diamondSource;

startGame()

function startGame(){
	game_started = false; //Check if there is already a game started
	setInterval(checkIfPersonDetected, 1000); //Check for a person every second (=1000ms)
}

function checkIfPersonDetected(){
	if(person_detected && !game_started){
		message.innerHTML = "Detected person. Calibrating, please don't move."

		if(calibrated && !waitingForJump){
			waitingForJump = true;
		}
	}

	if(!person_detected){
		waitingForJump = false;
		message.innerHTML = "Waiting to detect person..."
		return;
	}

	if(!game_started_here && game_started){
		message.innerHTML = "Calibrated! Jump to start.";
		if(stack_jumps.length > 0){
			var jump = stack_jumps.pop();
			stack_jumps = [];
			if(jump){
				game();
				game_started_here = true;
				messageArea.style.display = "none";
				videoArea.style.top = "50%";
			}
		}
	}
}

//Game loop
function game()
{
	var isJumping = false;
	var jumpUp = true;
	var arrayOfAnvils = [];
	var score = 0;
	var anvilAdded = false;

	startScreen.style.display = "none";
	endScreen.style.display = "none";
	
	//Defining canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = screen.width/3;
	canvas.height = screen.height-200;
	canvas.style.display = "block";
	
	//Declaring player
	var mySprite = {
		x: 0,
		y: canvas.height-120,
		width: 54,
		height: 120,
		speed: 200,
		jumpSpeed: 2,

		draw: function(){
			ctx.drawImage(playerSprite, this.x, this.y, this.width, this.height);
		}
	};


	//Declaring anvil
	class anvil{
		constructor(){
			this.width = 77;
			this.height = 48;
			this.x = Math.floor((Math.random() * (canvas.width - 77)));
			this.y = 0;
			this.speed = 2.5;
		}

		draw(){
			ctx.drawImage(anvilSprite, this.x, this.y, this.width, this.height);
		}
	}
	arrayOfAnvils.push(new anvil());

	//Declaring diamond
	var diamond = {
		width: 41,
		height: 41,
		x: Math.floor(Math.random() * (canvas.width - 41)),
		y: canvas.height - mySprite.height - 90,
		//Diamonds spawn a bit higher than the y value of the player when they jump

		draw: function(){
			ctx.drawImage(diamondSprite, this.x, this.y, this.width, this.height);
		}
	}

	//Declaring line which separates score from game
	var line = {
		draw: function()
		{
			ctx.beginPath();
			ctx.moveTo(0, 35);
			ctx.lineTo(canvas.width, 35);
			ctx.lineWidth = 5;
			ctx.strokeStyle = "#ffffff";
			ctx.stroke();
		}
	};

	//Function to draw canvas
	function paintCanvas()
	{
		ctx.fillStyle = bg;
		ctx.fillRect(0,0,canvas.width,canvas.height);

		var background = ctx.createPattern(bg, "no-repeat");
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = background;
		ctx.fill();
	}

	//Function to draw the falling anvils
	function fallingObjects()
	{
		for(myAnvil in arrayOfAnvils){
			arrayOfAnvils[myAnvil].draw();
		}
	}

	//Function to get input from web-cam
	function update(mod)
	{
		//changes x-position of player character
		if(stack_actions.length > 0){
			var pos = stack_actions.pop();
			stack_actions = [];
			mySprite.x = pos*(canvas.width-54)
		}

		//checks whether player is jumping
		if(stack_jumps.length > 0){
			var jump = stack_jumps.pop();
			stack_jumps = [];
			if(jump){
				isJumping = true;
			}
		}

		//depending on if the player is jumping, the player character will be moved accordingly
		if(isJumping){
			if(jumpUp){
				mySprite.y -= mySprite.jumpSpeed;
				if(mySprite.y < canvas.height-190){
					jumpUp = false;
				}
			}
			else{
				mySprite.y += mySprite.jumpSpeed;
				if(mySprite.y >= canvas.height-120){
					isJumping = false;
					jumpUp = true;
				}
			}
		}
	}

	//Function to show score 
	function updateScore()
	{
		ctx.fillStyle = "white";
		ctx.font = "16px Arial, sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Score: " + score, 10, 10 );

		line.draw();
	}

	//Main function to draw the canvas and every element in it
	function render()
	{
		paintCanvas();
		mySprite.draw();
		updateScore();

		//Anvils
		for (myAnvil in arrayOfAnvils){
			fallingObjects();
			//Repeat the object when it falls out of view
			if (arrayOfAnvils[myAnvil].y > canvas.height){
				arrayOfAnvils[myAnvil].y = arrayOfAnvils[myAnvil].height; //Account for the image size
				arrayOfAnvils[myAnvil].x = Math.floor((Math.random() * (canvas.width - 77)));; //Make it appear randomly along the width  
			}

			//Anvil colision detection
			if (arrayOfAnvils[myAnvil].x < mySprite.x + mySprite.width && arrayOfAnvils[myAnvil].x + arrayOfAnvils[myAnvil].width > mySprite.x && arrayOfAnvils[myAnvil].y < mySprite.y + mySprite.height && arrayOfAnvils[myAnvil].y + arrayOfAnvils[myAnvil].height > mySprite.y){
				clearInterval(collision);
				endScreen.style.display = "block";
				endScreen.innerHTML = "GAME OVER" + "<br>You scored " + score + " point(s)!<br>A new game will start shortly..."
				setTimeout(function(){
					location.reload();
				}, 5000);
			}
		}

		//Diamonds
		diamond.draw()

		if (diamond.x < mySprite.x + mySprite.width && diamond.x + diamond.width > mySprite.x && diamond.y < mySprite.y + mySprite.height && diamond.y + diamond.height > mySprite.y){
			score += 1;
			if(score > topScore){
				localStorage.setItem("currentTopScore", score);
			}
			if((score == 2 || score == 10 || score == 20 || score == 45) && !anvilAdded){
				anvilAdded = true;
				arrayOfAnvils.push(new anvil);
			}
			anvilAdded = false;
			diamond.x = canvas.width + 82;
			setTimeout(function(){ 
				diamond.x = Math.floor(Math.random() * (canvas.width - 41));
			}, 5000);
			for (myAnvil in arrayOfAnvils){
				//Check if smaller than max speed, if not increase speed by 0.1
				if(arrayOfAnvils[myAnvil].speed < 5){
					arrayOfAnvils[myAnvil].speed += 0.1;
				}
			}
		}
	}

	function run()
	{
		if(started){
			console.timeEnd("1")
		}
		else{
			started = true;
			console.time("1")
		}
		update();
		for (myAnvil in arrayOfAnvils){
			arrayOfAnvils[myAnvil].y += arrayOfAnvils[myAnvil].speed ;
		}
		render();
	}
	
	var started = false;
	var collision = setInterval(run, 10);
}
