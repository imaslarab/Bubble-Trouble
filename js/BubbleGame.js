'use strict';
//code of bubble game starts;
function BubbleGame(){
	this.gameWindow=document.getElementById("game-window");
	var scoreboardDisplay = document.getElementById("score");
	var livesDisplay = document.getElementById("lives");
	this.player;
	this.bullet;
	
	this.bubbles=[];

	this.score=0;
	this.collisionInterval;
	this.punch = new Audio("sounds/punch.mp3"); // sound when bubble hits player
	var that=this;
	this.init=function(){
		//initial function of game loop
		that.player=new Player(that);//instance of player
		that.player.createPlayer();//creates new player at the start
		
		that.bullet=new Bullet(that);//instance of bullet
		
		var bubble = new Bubble(that);//instance of bubble
		bubble.createBubble({bubbleClass:"bubble-red",top:"60px",left:"60px",width:"40px"});
		
		that.bubbles.push(bubble);//pushing bubble to array

		that.collisionInterval=setInterval(that.collisionCheck,50);
		document.addEventListener('keydown', that.onkeydown, false);
	}
	that.onkeydown=function(event){
		// keyboard keys handler
		if(event.keyCode == 32){//for space key
			that.bullet.fireBullet();
		}
		if(event.keyCode == 37 ){//for left Arrow
			that.player.moveLeft();
		}
		if(event.keyCode == 39){//for Right Arrow
			that.player.moveRight();
		}
	}
	this.collisionCheck=function (argument){
		scoreboardDisplay.innerHTML=that.score;
		//function to check collision with bullet and player
		
		for (var i = 0; i < that.bubbles.length; i++) {
			var currentBubble = that.bubbles[i];
			var currentBounce = currentBubble.bounce;

			if(that.bullet.fired==true){
				// console.log(currentBounce.positionX , that.bullet.bulletPosX+that.bullet.bulletWidth-that.bubbles[i].bubbleWidth);
				if(currentBounce.positionX>(that.bullet.bulletPosX+that.bullet.bulletWidth-that.bubbles[i].bubbleWidth) && currentBounce.positionX<(that.bullet.bulletPosX+that.bullet.bulletWidth)){
						if((currentBounce.positionY+that.bubbles[i].bubbleWidth)>that.bullet.bulletPosY){
							console.log('bubble collided')


							clearInterval(currentBounce.intervalId);//clear bubble update interval
							var newBubbles = currentBubble.splitBubble(i);//split bubble till end

							currentBubble.destroyBubble();

							that.bubbles.splice(i, 1);//remove bubble from array
							that.bullet.destroyBullet();//clears bullet update interval and removes bullet
							
							if (newBubbles.length == 0) {
								
							} else {
								that.bubbles.push(newBubbles[0]);
								that.bubbles.push(newBubbles[1]);
							}

							console.log(that.bubbles);
						}
					}
			}
			// collision with player
			if(currentBounce.positionX>(that.player.playerPosX-parseInt(currentBubble.bubbleWidth)) && currentBounce.positionX<(that.player.playerPosX+that.player.playerWidth)){
				if(currentBounce.positionY>(400-(that.player.playerHeight+parseInt(currentBubble.bubbleWidth)))){
					that.punch.play();
					clearInterval(currentBounce.intervalId);
					clearInterval(that.collisionInterval);
					that.reset();
					break;
				}
			}
		};
	}
	//reset function
	this.reset=function(){	
		// if(that.player.lives>1){
		// 	that.player.lives--;
		// 	livesDisplay.innerHTML=that.player.lives;
		// 	for (var i = 0; i < that.bubbles.length; i++) {
		// 		//destroy all bubbles in screen
		// 		var currentBubble = that.bubbles[i];
		// 		currentBubble.destroyBubble()
		// 	};
		// 	var bubble = new Bubble(that);//instance of bubble
		// 	bubble.createBubble({bubbleClass:"bubble-red",top:"60px",left:"60px",width:"30px"});
		// 	that.collisionInterval=setInterval(that.collisionCheck,120);	
		// }else{
		// 	that.player.lives--;
		// 	livesDisplay.innerHTML=that.player.lives;
		// 	that.gameOver();
		// }
	}
	//game over function
	this.gameOver=function(){
		console.log('game over');
		that.player.removePlayer();
	}

}
//start of game
var game=new BubbleGame();
game.init();