
//BossAtLevel decides which level the boss will spawn at.
var boss = undefined; //this variable is essential for the boss spawning in
var bossAtLevel = 5;
/*
* this array contains the different enemytypes that can spawn. The "level" attribute is what determines when
* the specific type can spawn. "level" relies on the "score"-variable.
*/

var enemyTypes = [
  {
    maxHP: 50,
    attackInterval: 0.8,
    imageID: "Enemyship",
    damage: 5,
    level: 0,
    bulletimg: "fiendeskott"
  },
  {
    maxHP: 75,
    attackInterval: 0.6,
    imageID: "Enemyship2",
    damage: 5,
    level: 3,
    bulletimg: "fiendeskott"
  },
  {
    maxHP: 100,
    attackInterval: 0.3,
    imageID: "Enemyship3",
    damage: 1,
    level: 7,
    bulletimg: "fiendeskott"
  }
];


/*
* This function is responsible for spawning the enemies. It has a cooldown which
* controlls the rate at which enemies spawn, and it also takes care of spawning
* a boss at the right time. This function also checks which level the game is at,
* and when the player reaches the right level it starts spawning a new type of
* enemy. The spawnrate increases with with each level.
*/

var EnemySpawner = function() {
  this.time = 0;
  this.spawnRate = 4;
  this.cooldown = 0;
  this.score = 0;
  this.level = 0;
  this.biss = false;
  this.enemies = [];
  this.tick = function(dt) {
    this.level = Math.floor(this.score/400);//the level is based on the score
    this.spawnRate = (4*Math.pow(0.96, this.level));//he spawnrate increases exponatioally and gets harder as the game progresses.
    for(var i = 0; i < enemyTypes.length; i++) {
      if(enemyTypes[i].level <= this.level && !this.enemies.includes(i)) {//pushes new types of enemies into the enemy-array as the level increases
        this.enemies.push(i);
      }
      else if(enemyTypes[i].level > this.level && this.enemies.includes(i)) {
        this.level = 0;
        this.enemies.splice(this.enemies[i], this.enemies.length-1);
      }
      /*
      *the above else if-statement basically resets the array "enemies" when the
      * game is restarted. It is essential for the replay-mechanic of the game
      * to work.
      */
    }

    //This segment of the function is dedicated to spawning the boss.

    var x = Math.random()*(canvas.width - 400);

    if(this.level >= bossAtLevel && !this.biss) {
      this.biss = true;
      music.pause();
      bossmusic1.play();

      if (Math.random() >= 0.5){
        boss = new LaserBeamBoss(x, -100, 80, 120);
      } else {
        boss = new Thonfors(x, -100, 60, 100);
      }

      Sprites.push(boss);
      bossAtLevel+=10;
    }
    //this if-statement checks if it's time for a boss to spawn, and if that's
    //the case, then a new boss is spawned in.

    if(this.biss && boss.HP <= 0) {
      hero.HP = hero.maxHP;
      this.biss = false;
      bossmusic1.pause();
      music.play();
      boss = undefined;
      bossExplosion.volume = 1;

      bossExplosion.addEventListener('ended', function(){
        Powerup.play();
        hero.ammoResetCooldown = hero.ammoResetTime;
        hero.reload();
        hero.upgrade = true;
      });

      bossExplosion.play();
    }
    //this if-statement decides what happens when the boss dies

    if(this.biss && hero.HP <= 0){
      boss = undefined;
      LaserBossBeam.currentTime = 0;
      this.biss = false;
      gameOver();
    }

    if(hero.upgradeAmount <= 0){
      Powerdown.play();
      hero.ammoResetCooldown = hero.ammoResetTime;
      hero.upgrade = false;
      hero.upgradeAmount = 90;
    }
    //this if-statement is essential for when the player dies during a boss-fight

    if(this.biss) {
      return;
    }

    else if(this.cooldown <= 0) {
      this.spawnEnemy();
      this.cooldown = this.spawnRate;
    }
    //this if-statement spawns a new enemy when cooldown has decreased down to 0
    else {
      this.cooldown -= dt;
    }
    //if cooldown is not yet 0, it will decrease with dt
  }

  /*
  * This function is the function that randomizes the necessary variables and
  * pushes the right values into the constructors for hostile entities
  */

  this.spawnEnemy = function() {
    var i = Math.floor(Math.random()*this.enemies.length);
    var x = Math.random()*canvas.width;
    if(x < 50){
      x = 50;
    }
    else if( x > canvas.width-50){
      x = canvas.width - 50;
    }
    var Fiende = new Fiender(x, -100, enemyTypes[i], 10, 70);
    Sprites.push(Fiende);
    Monster.push(Fiende);

    /*
    * This segment of the function is for spawning asteroids. The asteroidSpawnRate
    * variable is meant to limit and randomize when an asteroid spawns. If an
    * asteroid is destroyed, the players HP will be set to max.
    */

    var dx;
    var decide_dx = Math.random();

    if(decide_dx > 0.5){
      dx = -0.1;
    }
    else{
      dx = 0.1;
    }
    var asteroidSpawnRate = Math.random()*100;
    var Asteroider = new Asteroids(x, -Asteroid.height, dx, 0.5, Asteroid.width, Asteroid.height, Math.floor((Asteroid.width*2)/3));
    if(Math.floor(asteroidSpawnRate) >=95){
      Sprites.push(Asteroider);
      Monster.push(Asteroider);
    }
  }
}

var EnemySpawnRate = 0;
var spawner = new EnemySpawner();

// This function updates all the sprites on the screen, which means it updates
// all objects that do not take or do damage.
function updateObjects(dt) {
  spawner.score = hero.score;
  spawner.tick(dt);

  for(i = Sprites.length - 1; i >= 0; i--) {
    Sprites[i].update(dt);
  }
}

//This function draws all the sprites
function drawSprites() {
  c.shadowBlur = 0;
  c.shadowColor = undefined;
  for(i = 0; i < Sprites.length; i++) {
    Sprites[i].draw();
  }
}


/*
* This function is the initiative function. When you press the button to start the
* game, init is the function that is run. It resets all values to their primitive ones,
* and loads the requestAnimationFrame-function to initiate the game.
*/
function init(){
  preload();
  loadKeys();
  bossAtLevel = 5;
  LaserSoundEffect.volume = 0.2;
  Powerup.volume = 0.5;
  BossCanon.volume = 0.5;
  asteroidExplosion.volume = 0.5;
  LaserBossBeam.volume = 0.6;
  Powerdown.volume = 0.8;
  bossmusic1.volume = 0.5;
  boom.volume = 0.15;
  chrash3.volume = 0.2;
  Sprites.push(hero);
  mouse.x = canvas.width/2;
  mouse.y = canvas.height/3;
  hero.HP = hero.maxHP;
  hero.score = 0;
  hero.ammo = hero.fullAmmo;
  hero.x = canvas.width/2;
  hero.y = canvas.height*2/3;
  music.currentTime = 0;
  setPaused(false);
  music.loop = true;
  pausemusic.loop = true;
  window.requestAnimationFrame(loop);
}

/*
* This function checks if the boolean "v" is true or false, and depending on that
* it decides what functions to play. This is essential for the player to be able to
* pause the game, but also for when the player dies or before the game has even started.
*/
function setPaused(v) {
  controller.paused = v;
  if(v) {
    music.pause();
    pausemusic.play();
    bossmusic1.pause();
    LaserBossBeam.pause();
    if(explodeEars) {
      pausemusic.volume = 1;
    } else {
    pausemusic.volume = 0.35;
  }
    document.body.className = "paused";
  }
  else {
    pausemusic.pause();
    pausemusic.currentTime = 0;
    if(boss != undefined){
      bossmusic1.play();
      LaserBossBeam.play();
      document.body.className = "";
    }
    else{
      music.play();
      music.volume = 0.5;
      document.body.className = "";
    }
  }
}

/*
* When the player dies, this is the function that is played. It stops everything
* and calls on css code to display a return to main menu button and some text.
*/
function gameOver() {
  controller.playing = false;
  hero.upgrade = false;
  ESCAPE_KEY = undefined;
  backgroundLoop();
  Sprites.splice(0, Sprites.length);
  Monster.splice(0, Monster.length);
  music.pause();
  bossmusic1.pause();
  LaserBossBeam.pause();
  GameOver.volume = 0.9;
  GameOver.play();
  document.body.className = "gameover";
}

//this function calls on a css function, which in turn calls on html code when
//the button is clicked.
function goToMainMenu() {
  document.body.className = "notplaying";
}

//this function is called when the start game button is pressed.
function startGame() {
  controller.playing = true;
  document.body.className = "";
  init();
}

var t0 = 0;

/*
* This function is the function responsible for keeping the background and canvas
* active. The function is called even if the game is paused, so that the background
* keeps moving.
*/
function backgroundLoop(t) {
  t0 = t;
  updateBackground();
  drawBackground();
  if(!controller.playing) {
    window.requestAnimationFrame(backgroundLoop);
  }
}

var time = 0;
var scoreCooldown = 0;

//This function is called 60 times each second and updates every object on the
//screen just as often. This function is only called when the game is not paused.
function loop(t) {
  var dt = (t - t0)/1000;
  time += dt;
  if(!controller.paused) {
    updateObjects(dt);
    scoreCooldown -= dt;
    if(scoreCooldown <= 0) {
      hero.score += 1;
      scoreCooldown = 0.3;
    }
  }
  updateBackground();
  drawBackground();
  drawSprites();
  t0 = t;
  drawUI();
  if(controller.playing) {
    window.requestAnimationFrame(loop);
  }
}
