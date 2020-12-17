var hero = new Object();

hero.x = window.innerWidth / 2; //start position for hero in x
hero.y = window.innerHeight / 2; //start position for hero in y
hero.w = 100; //width of hero.
hero.h = 100; //height of hero
hero.dy = 0;
hero.dx = 0;
hero.radius = 50;
hero.movement = 1500; //speed-variable
hero.angle = 0;
hero.img = document.getElementById("ship"); //image of ship
hero.crosshair = undefined; //set to defined when game starts
hero.LaserSoundEffect = undefined;//set to defined when game starts
hero.deathsound = undefined; //sets to defined when game starts
hero.cooldown = 0; //cooldown variable for later uses
hero.maxHP = 100;
hero.HP = hero.maxHP;
hero.score = 0;
hero.level = 0; //Math.floor(score/400)
hero.fullAmmo = 15;
hero.ammo = hero.fullAmmo;
hero.ammoResetTime = 2; //necessary for reload to work
hero.ammoResetCooldown = 0; //necessary for reload to work, makes it so that you can't shoot immideately
hero.upgrade = false;
hero.upgradeAmount = 90;

hero.draw = function() {
  c.translate(hero.x, hero.y);
  c.rotate(this.angle - Math.PI / 2);
  c.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
  c.rotate(-this.angle + Math.PI / 2);
  c.translate(-hero.x, -hero.y);
}

/*
* The clamp function is used to set limits to certain variables. For the hero to
* accelerate and de-accelerate, the clamp function is used to set a limit so that
* this.dx and this.dy can only reach a specific limit.
*/
function clamp(min, max, value) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/*
* This function is used to update the heroe's position.
*/
hero.update = function(dt) {
  this.angle = Math.atan2(hero.y - mouse.y, hero.x - mouse.x);
  this.cooldown -= dt;
  this.ammoResetCooldown -= dt;
  if (controller.up) {
    hero.dy -= hero.movement * dt;
  }
  if (controller.down) {
    hero.dy += hero.movement * dt;
  }
  if (controller.right) {
    hero.dx += hero.movement * dt;
  }
  if (controller.left) {
    hero.dx -= hero.movement * dt;
  }
  if (controller.space) {
    hero.fire();
  }
  if (controller.up == controller.down) {
    hero.dy -= hero.dy * dt * 2;
  }
  if (controller.right == controller.left) {
    hero.dx -= hero.dx * dt * 2;
  }

  //this is the code responsible for the accelerative movements of the hero. Here,
  //clamp is used to make it so that hero.dx and hero.dy can only increase to a value of 500 or -500.
  hero.dy = clamp(-500, 500, hero.dy);
  hero.dx = clamp(-500, 500, hero.dx);
  hero.x += hero.dx * dt;
  hero.y += hero.dy * dt;

  if (this.HP <= 20) {//this code plays a soundeffect when HP is low
    turn.volume = 0.34;
    turn.play();
  }
  if (this.HP <= 0 && boss == undefined) {
    gameOver();
  }//if the player dies outside of a bossfight, gameOver() is initiated.

  /*
  * The below for-loop checks if the player is colliding with the enemies. If that's
  * the case, then the player takes 15 damage per second. It also checks collision with
  * the boss, if boss is defined.
  */
  for (var i = Monster.length - 1; i >= 0; i--) {
    var DeltaHX = this.x - Monster[i].x;
    var DeltaHY = this.y - Monster[i].y;
    if (Math.sqrt(DeltaHX * DeltaHX + DeltaHY * DeltaHY) < Monster[i].radius + this.radius) {
      hero.takeDamage(15 * dt);
    }

    if (boss != undefined) {
      var DeltaHX = this.x - boss.x;
      var DeltaHY = this.y - boss.y;
      ensureBounds(hero);
      if (Math.sqrt(DeltaHX * DeltaHX + DeltaHY * DeltaHY) < boss.radius + this.radius) {
        hero.takeDamage(100);
      }
  }
  ensureBounds(hero);
  }
  ensureBounds(hero);
}


/*
* This function is used for the player firing mechanics. It is called when SPACE_KEY is is pressed
* and it creates a new bullet using the Skott constructor. It also checks if the ammo-attribute
* is empty or not, and reloads if it is using the hero.reload function. The function contains a
* cooldown variable, as to cap the ammount of bullets/second.
*/
hero.fire = function() {
  if (this.cooldown > 0 || this.ammoResetCooldown > 0) return; // cooldown > 0 => funktionen ej kan aktiveras
  if(this.ammo <= 0){
    if(this.ammoResetCooldown > 0){
      return;
    }
    else{
      this.reload();
    }
  }//this checks if ammo is 0, and then reloads.

  var v = 1000;
  var dx = -Math.cos(this.angle);
  var dy = -Math.sin(this.angle);

  if (!LaserSoundEffect.paused) {
    LaserSoundEffect.currentTime = 0;
  } else {
    LaserSoundEffect.play(); //Plays a laser sound when a bullet is fired.
  }

  Sprites.push(new this.Skott(this.x + dx * this.h / 2, this.y + dy * this.h / 2, dx * v, dy * v));

  if(hero.upgrade) { //an additional upgrade for the player
    for(var angle = -Math.PI/20; angle <= Math.PI/20; angle += 2*(Math.PI/20)) {
      var dx = -Math.cos(angle+this.angle);
      var dy = -Math.sin(angle+this.angle);
      Sprites.push(new this.Skott(this.x+dx*this.radius, this.y+dy*this.radius, dx*v, dy*v, this.damage)); //pushes a shot at the given angle (in radians)
    }
    this.upgradeAmount--;
  }

  this.cooldown = 0.25; //when function is activated, cooldown is set to greater than 0 to cool down
  this.ammo -= 1;

  if(this.ammo <=0){
    this.reload();
    this.ammoResetCooldown = this.ammoResetTime;
  }
}


//this function reloads hero.ammo
hero.reload = function() {
  this.ammo = this.fullAmmo;
  ReloadSound.play();
}

//this function is called whenever anything damages the hero.
hero.takeDamage = function(dmg) {
  hero.HP -= dmg;
  if (!hitsound.paused) {
    hitsound.currentTime = 0;
  } else {
    hitsound.play();
  }
}

/*
* This function ensures that the hero does not move outside of the canvas. This is
* initiated by calling ensureBounds(hero).
*/
function ensureBounds(sprite) {
  if (sprite.x < hero.w / 2) {
    sprite.x = sprite.w / 2;
    sprite.dx = 0;
  }
  if (sprite.y < hero.h / 2) {
    sprite.y = sprite.h / 2;
    sprite.dy = 0;
  }
  if (sprite.x + sprite.w / 2 > window.innerWidth) {
    sprite.x = window.innerWidth - sprite.w / 2;
    sprite.dx = 0;
  }
  if (sprite.y + sprite.h / 2 > window.innerHeight) {
    sprite.y = window.innerHeight - sprite.h / 2;
    sprite.dy = 0;
  }
}

/*
* This is the constructor for creating the heroe's bullets. It rotates the bullets
* towards the mouse, and it also contains if-statements that decide what happens
* when a bullet collides with an enemy.
*/
hero.Skott = function(x, y, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.angle = Math.atan2(-dy, -dx);
  var img = document.getElementById("skott");
  this.draw = function() {
    c.translate(this.x, this.y); //moves the bullets to this.x, this.y
    c.rotate(this.angle - Math.PI / 2); //rotate the bullets towards mouse
    c.drawImage(img, -30, -30, 60, 60);
    c.rotate(-this.angle + Math.PI / 2); //allows a reverse rotation
    c.translate(-this.x, -this.y); //allows a bullet to move back
  }//this function draws the bullets

  this.update = function(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;

    // the below for-loop tests the bullets' collision with other entities. If a
    //collosion is detected, the bullet is removed and the enemies takes damage.
    //if an enemy dies the hero recieves 100 in score.
    for (var i = Monster.length - 1; i >= 0; i--) {
      var DeltaX = this.x - Monster[i].x;
      var DeltaY = this.y - Monster[i].y;
      if (Math.sqrt(DeltaX * DeltaX + DeltaY * DeltaY) < Monster[i].radius) {
        Monster[i].applyDamage(25);
        Sprites.splice(Sprites.indexOf(this), 1);
        if (Monster[i].HP <= 0) {
          hero.score += 100;
        }
      }
    }
    //The below if-statement is dedicated to bossfights. It does the same as the previous one
    //although with a few adjustments such as the score.
    if (boss != undefined) {
      var DeltaX = this.x - boss.x;
      var DeltaY = this.y - boss.y;
      if (Math.sqrt(DeltaX * DeltaX + DeltaY * DeltaY) < boss.radius) {
        boss.applyDamage(25);
        particles = 5;
        explosion(boss.x, boss.y);
        Sprites.splice(Sprites.indexOf(this), 1);
        if (boss.HP <= 0) {
          hero.score += boss.score;
        }
      }
    }
    //If a bullet moves outside of the screen, this if-statement removes it.
    if (this.x < 0 || this.x > window.innerWidth ||
      this.y < 0 || this.y > window.innerHeight) {
      Sprites.splice(Sprites.indexOf(this), 1); //splicar ut elementet ur arrayen
    }
    this.draw();
  }
}
