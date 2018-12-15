// Basic Template
// CBP 15-06-13
    // drawing variables
    var canvas;
    var gc;

    // Sounds
    // Howler library short code referencing library source code
    var intro = new Howl({
        src: ['sounds/CS_Noise A-05.wav'] // links to mp3 file
    });
    var enemyDeath = new Howl({
        src: ['sounds/CS_Noise A-20.wav'],
        volume: 0.5 // changes volume
    });
    var playerShoot = new Howl({
        src: ['sounds/CS_Noise A-25.wav']
    });
    var bulletsCollide = new Howl({
        src: ['sounds/CS_VocoBitB_Noise-14.wav'],
        volume: 2.5
    });
    var playerHurt = new Howl({
        src: ['sounds/CS_VocoBitA_Noise-08.wav']
    });
    var playerDeath = new Howl({
        src: ['sounds/CS_VocoBitB_Noise-01.wav'],
        volume: 0.75
    });
    var backing = new Howl({
        src: ['sounds/CS_FMArp B_130-A.wav'],
        loop: true, // loops through the mp3 file
        volume: 0.2
    });
    var newlevel = new Howl({
        src: ['sounds/CS_VocoBitB_Noise-10.wav'],
        volume: 1.25
    });
    // Initialises first instance of background music
    backing.rate(0.7); // changes playback speed of the mp3 file
    backing.play(); // plays audio file

    // Row variables
    var row = 0;
    var maxRow = 4;
    var row1Count;
    var row2Count;
    var row3Count;
    var row4Count;

    // Game Attributes
    var game = {
        score: 0,
        level: 0
    };
    var start = true;
    var music = true;
    var deathSound = false;
    var sensitivityVal;

    // Enemy attributes
    var enemy = {
        xLoc: 80,
        xVelo: 0.05,
        yLoc: 0,
        array: [],
        allDead: false
    };

	var DT = 5;

	// Bullet Variables
    var x ;
    var y;
	var bullet = {y: y, x: x, width: 15, height: 20};
	var bulletVelo = 5;
    var shootDone = true;
    var collided = false;

    // Enemy Bullet Variables
    var enemyY;
    var enemyX;
    var enemyBullet = {y: enemyY, x: enemyX, width: 10, height: 10};
    var enemyBulletVelo = 2;
    var enemyShootDone = true;

	// Key presses
	var rightPressed = false;
	var leftPressed = false;
	var spacePressed = false;

	// Player Object
	var player = {
	    hp: 3,
        x: 0,
        y: 0
    };
	
    // Images
    var background;
    var Enemy;
    var playerPic;

// Start up menu system
$(document).ready(function(){
    // jQuery code
    $("#startbtn").click(function(){
        intro.play();
        $("#start").hide();
        $("#myCanvas").show();
        gameStart();
    })
});

function keyDownHandler(e) {
    // d and -> move right when key down
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    }
    // w and <- move left when key down
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    // stops moving left and right when key released
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    }
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}

function keyPressHandler(e){
    // fires bullet when key pressed
    if(e.keyCode == 32){
        spacePressed = true;
    }
}

function death(){
    // player death sequence, resets values and attributes
    bulletVelo = 0;
    enemyBulletVelo = 0;
    if(deathSound == false){ // plays death noise once
        playerDeath.play();
        deathSound = true;
    }
    $("#myCanvas").hide();
    $("#Game_Over").show();
    $("#respawnbtn").click(function() {
        $("#Game_Over").hide();
        $("#myCanvas").show();
        enemyBulletVelo = 2;
        bulletVelo = 5;
        game.level = 0;
        game.score = 0;
        player.x = 600;
        enemy.xVelo = 0.05;
        player.hp = 3;
        start = true;
        nextLvl();
        start = false;
    })
}

function musicToggle(){
    // Turns background music on and off
    if (music == true){
        backing.stop(); // librray short code to stop mp3 file playback
        music = false;
        document.getElementById("musicbtn").value = "Music: off";
    }
    else if (music == false){
        backing.play();
        music = true;
        document.getElementById("musicbtn").value = "Music: on";
    }

}

function sensitivity(){
    // Sets the movement speed of the player
    if (document.getElementById("high").checked === true){
        sensitivityVal = 7;
    }
     else if (document.getElementById("medium").checked === true){
        sensitivityVal = 4;
    }
    else if (document.getElementById("low").checked === true){
        sensitivityVal = 2;
    }
}

function shoot(){
    // Draws bullet
    gc.beginPath();
    gc.rect (bullet.x, bullet.y, bullet.width, bullet.height);
    gc.fillStyle = "#fff407";
    gc.fill();
    gc.closePath();
    bullet = {y: y, x: x, width: 15, height: 20};

    // fires bullet
    if (spacePressed == true && shootDone == true && bulletVelo > 0){
        playerShoot.play();
        x = player.x+32;
        y = player.y;
        spacePressed = false;
    }

    // checks if bullet has finished motion cycle
    if (bullet.y <= -30 || collided == true){
        shootDone = true;
        collided = false;
    }

    if (bullet.y > 0){
        shootDone = false
    }

    y-= bulletVelo; // bullet movement
}

function enemyShoot(){
    // Drawing enemy bullet
    gc.beginPath();
    gc.rect (enemyBullet.x, enemyBullet.y, enemyBullet.width, enemyBullet.height);
    gc.fillStyle = "#ff0000";
    gc.fill();
    gc.closePath();
    enemyBullet = {y: enemyY, x: enemyX, width: 15, height: 20};

    // Random Enemy bullet spawning
    if (enemyShootDone == true ){
        var randomRow = Math.floor(Math.random() * 5); // random number between 0 - 4 inclusive
        var randomColomn = Math.floor(Math.random() * 5); // random number between 0 - 4 inclusive
        if (enemy.array[randomRow][randomColomn] == 1){
            // centralise bullet onto enemy
            enemyX = enemy.xLoc + (randomRow*100) + 20;
            enemyY = enemy.yLoc + (105+(randomColomn*70));
        }
    }

    // Enemy bullet collision
    if (enemyBullet.x+enemyBullet.width >= player.x && enemyBullet.x <= player.x + 80 && enemyBullet.y <= player.y + 60 && enemyBullet.y >= player.y) {
        playerHurt.play();
        enemyY = 1300; // creates a delay for the next bullet spawn with tarvel time of bullet
        player.hp -= 1;
        game.score -= 500;
    }

    // Finds whether the bullet has finished its motion cycle
    if(enemyBullet.y >= 1900){
        enemyShootDone = true;
    }

    else if (enemyBullet.y < 1900){
        enemyShootDone = false;
    }

    enemyY+=enemyBulletVelo; // bullet movement
}

function count(){
    // detects which row of enemies are left and at what height (row) to kill player
    row1Count = 0;
    row2Count = 0;
    row3Count = 0;
    row4Count = 0;
    for (var i = 0; i < enemy.array.length; i++) {
        // first row dead
        if (enemy.array[i][3] == 0) {
            row4Count++;
            if (row4Count == 5) {
                maxRow = 5;
            }
        }
        // second row dead
        if (enemy.array[i][2] == 0) {
            row3Count++;
            if (row3Count == 5) {
                maxRow = 6;
            }
        }
        // third row dead
        if (enemy.array[i][1] == 0) {
            row2Count++;
            if (row2Count == 5) {
                maxRow = 7;
            }
        }
    }
}

function collision(){
    // Loops through the enemy array
    for (var i = 0; i < enemy.array.length; i++){
        for(var j = 0; j < enemy.array[0].length; j++){
            // locates enemy
            if (bullet.x+bullet.width >= enemy.xLoc+(i*100) &&  bullet.x <= enemy.xLoc+(i*100)+50 && bullet.y <= (row*85)+(j*105) && bullet.y >= (row*85)+(j*105)) {
                if (enemy.array[i][j] == 1){
                    // enemy death sound, adds points and recognises its collided
                    enemyDeath.stop();
                    enemyDeath.play();
                    game.score += 50;
                    collided = true;
                }
                enemy.array[i][j] = 0;
            }
        }
    }

    // Allows player to shoot enemy bullets to destroy the enemy bullet
    // enemy bullet hit box expanded so easier to hit and blow up
    if (bullet.x >= enemyBullet.x -30 &&  bullet.x <= enemyBullet.x + enemyBullet.width + 30 && bullet.y >= enemyBullet.y  &&  bullet.y <= enemyBullet.y + enemyBullet.height){
        bulletsCollide.play();
        y = -40;
        enemyY = 1300;
    }

    // Changes player bullet coordinate if there is a collision
    if(collided == true){
        y = -40;
    }
}

function playerMove(){
    // Moves player left and right by adding a value to their coordinates
    if(rightPressed && player.x <= canvas.width-85) {
        player.x += sensitivityVal; // 7
    }
    if (leftPressed && player.x >= 5) {
        player.x -= sensitivityVal;
    }
}

function areAllDead(){
    // finds if all enemies are dead
    var count = 0;
    for (var i = 0; i < enemy.array.length; i++){
        for(var j = 0;j < enemy.array[0].length; j++){
            if(enemy.array[i][j] == 0) {
                count++;
                if(count == 20){    // 20 total enemies
                    enemy.allDead = true;
                }
            }
            else{
                enemy.allDead = false;
            }
        }
    }
}

function nextLvl(){
    // Only makes a new level sound after the first level (lv 0 to lv 1)
    if(start == false) {
        newlevel.play();
    }
    deathSound = false;
    game.level++; // Increases level by 1
    game.score += (500 * (game.level-1)); // Gives points for completing a level
    enemy.xLoc = 80;
    enemy.xVelo = ((game.level/50)*2); // increases the speed of enemies each level
    row = 0;
    maxRow = 4;
    // Enemy Array Reset
    enemy.array = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];
}

function gameStart(){
    nextLvl(); //Loads first level
    start = false;

    // Init canvas, graphics context and event listeners
    canvas = document.getElementById("myCanvas");
    gc = canvas.getContext("2d");
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keypress", keyPressHandler, false);

    // Preset locations
    enemy.xLoc = 80;
    player.x = 640; // to the middle of the canvas
    player.y = canvas.height - 125; // -100 to the bottom of the canvas

    //load images
    background = document.getElementById("background");
    Enemy = document.getElementById("enemy");
    playerPic = document.getElementById("player");

    // Run main loop with an interval
    window.setInterval(runLoop,DT);
}

function enemyMovement() {
    // Moves Enemies
    enemy.yLoc = (row*75); // sets y location
    enemy.xLoc += enemy.xVelo * DT; // sets x location

    // boundaries
    if(enemy.xLoc >= (canvas.width - 550)){
        enemy.xVelo = enemy.xVelo * -1;
        row++
    }
    if(enemy.xLoc <= 80){
        enemy.xVelo = enemy.xVelo * -1;
        row++
    }

    // Checks if Enemies have reached the bottom
    if (row >= maxRow ){
        player.hp = 0;
    }
}

function runLoop() {
    // draws background and player
    gc.drawImage(background,0,0);
    gc.drawImage(playerPic, player.x, player.y);

    // draws the enemies from the array
    for (var i = 0; i < enemy.array.length; i++){
        for(var j = 0; j < enemy.array[0].length; j++){
            if (enemy.array[i][j] == 1) {
                gc.drawImage(Enemy, enemy.xLoc + (i*100),enemy.yLoc + (85+(j*70)));
            }
        }
    }

    // Game mechanic functions
    sensitivity();
    enemyMovement();
    shoot();
    playerMove();
    enemyShoot();
    collision();
    areAllDead();
    count();

    // Show and update score, level and player health
    gc.fillStyle = "yellow";
    gc.font = "30px Arial";
    gc.fillText("Score: "+ game.score, 40, 35);
    gc.fillText("Level: "+ game.level, 40, 65);
    gc.fillText("Lives: "+ player.hp, 1100, 35);

    // Player death trigger
    if (player.hp == 0){
        death();
    }

    // Next level trigger
    if (enemy.allDead == true){
        enemy.xVelo = 0;
        nextLvl();
    }
}