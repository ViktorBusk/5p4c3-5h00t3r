var Sprites = [];
var Monster = [];
var EnemySprites = [
  document.getElementById("Enemyship"),
  document.getElementById("Enemyship2"),
  document.getElementById("Enemyship3")
];
/*
* The monster-and sprite arrays contains all monsters and sprites,
* The different images of the enemies are loaded into an array
*/

var EnemyLaserBeamsSoundEffect = undefined;

function Fiender(x, y, type, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.type = type;
  this.HP = this.type.maxHP;
  this.cooldown = 0;
  this.angle = 0;
  var img = document.getElementById(this.type.imageID); //gets the specific type image for an enemy
  var bullet = document.getElementById(this.type.bulletimg);//gets the specific type of bullet for an enemy
  this.radius = img.width/9;

  this.draw = function(){ //draws the image and healthbars
    c.drawImage(img,
      Math.floor(this.x-img.width/8),
      Math.floor(this.y-img.height/8),
      img.width/4,
      img.height/4);
    drawHealthBars(this.x-50, this.y-65, 100, 10, this.HP/this.type.maxHP);
  }
  this.update = function(dt){//gets rid of the enemies if they are dead or out of frme
    this.y += this.dy*dt;
    this.angle = Math.atan2(this.y - hero.y, this.x - hero.x);
    if(this.y - 75 > canvas.height){
      Sprites.splice(Sprites.indexOf(this), 1);
    }
    else if(this.HP <= 0){
      Monster.splice(Monster.indexOf(this), 1);
      Sprites.splice(Sprites.indexOf(this), 1);
      pickDeadSound();
      particles = 50;
      explosion(this.x, this.y,((Math.random() * 5) + 1));
    }

    this.cooldown-=dt; //the cooldown is decreased by 1
    this.fire();
  }
  this.applyDamage = function(damage){ //applys the damage to the enemeis
    this.HP -= damage;
  }
  this.fire = function(){
    if(this.cooldown > 0) return;// cooldown > 0 => funktion cannot activate
    var v = 1000;
    var dx = -Math.cos(this.angle);
    var dy = -Math.sin(this.angle);
    Sprites.push(new this.Skott(this.x+dx*this.radius, this.y+dy*this.radius, dx*v, dy*v, this.type.damage));
    this.cooldown = this.type.attackInterval; //when function is activated, cooldown is set to greater than 0 to cool down
   }

   // Enemy bullet constructor. Works exactly like hero.skott, however with minor
   //adjustments.
   this.Skott = function(x,y,dx,dy,damage) {
     this.x = x;
     this.y = y;
     this.dx = dx;
     this.dy = dy;
     this.damage = damage;
     this.angle = Math.atan2(-dy, -dx);
     this.draw = function() {
       c.translate(this.x, this.y);
       c.rotate(this.angle - Math.PI/2);
       c.drawImage(bullet,-30,-30,60,60);
       c.rotate(-this.angle + Math.PI/2);
       c.translate(-this.x, -this.y);
     }

     this.update = function(dt) {
       this.x += this.dx*dt;
       this.y += this.dy*dt;
       //Tests collision
       var DeltaX = this.x - hero.x;
       var DeltaY = this.y - hero.y;
       if(Math.sqrt(DeltaX*DeltaX + DeltaY*DeltaY) < hero.radius){
           hero.takeDamage(this.damage);
           Sprites.splice(Sprites.indexOf(this), 1);
         }
       // removes bullets from screen when outside of canvas.
       if(this.x < 0 || this.x > window.innerWidth
       || this.y < 0 || this.y > window.innerHeight) {
         Sprites.splice(Sprites.indexOf(this), 1);
       }
    }
  }
}
/* "Thonfors" is the boss for the game and has its own constructor due to his different attributes but
 * there are still many similarities.
 */
function Thonfors(x, y, dx, dy){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.maxHP = 500;
  this.radius = 100;
  this.score = 1000;
  this.cooldown = 0;
  this.damage = 8;
  this.angle = 0;
  this.HP = this.maxHP;
  var img = document.getElementById("BigWheel");//loads bossimage
  this.draw = function(){ //loads bossimage
    c.drawImage(img,
      Math.floor(this.x-this.radius),
      Math.floor(this.y-this.radius),
      2*this.radius,
      2*this.radius);
    drawHealthBars(this.x-100, this.y-this.radius - 15, 200, 20, this.HP/this.maxHP);
  }
  this.update = function(dt){

    if(this.HP <= 0){
      particles = 50;
      explosion(this.x+20, this.y+20);
      explosion(this.x-20, this.y-20);
      explosion(this.x, this.y);
      Sprites.splice(Sprites.indexOf(this), 1);
    }
    if(this.y - this.radius > 0){
      this.x += this.dx*dt;
      this.y += this.dy*dt;

        if(this.x+this.radius >= canvas.width || this.x-this.radius <= 0){
          this.dx = -this.dx;
        }
        if(this.y+this.radius >= canvas.height || this.y-this.radius<= 0){
          this.dy = -this.dy;
        }
      }
      else{
      this.x += this.dx*dt;
      this.y += this.dy*dt;
      }
    this.cooldown -= dt;
    this.angle += dt*Math.PI;
      if(this.angle >= 2*Math.PI) {
        this.angle -= 2*Math.PI;
      }
    this.fire();
    this.draw();
    }
    this.applyDamage = function(dmg){
      this.HP -= dmg;
    }
    this.fire = function(){
      if(this.cooldown > 0) return;// cooldown > 0 => function cannot activate
      var v = 1000;
      if (!bossLaser.paused) {
        bossLaser.currentTime = 0;
      } else {
        bossLaser.play();
      }
      for(var angle = 0; angle < 2*Math.PI; angle += Math.PI/10) { //the boss can fire at all directions!
        var dx = -Math.cos(angle+this.angle);
        var dy = -Math.sin(angle+this.angle);
        Sprites.push(new this.Skott(this.x+dx*this.radius, this.y+dy*this.radius, dx*v, dy*v, this.damage)); //pushes a shot at the given angle (in radians)
      }
      this.cooldown = this.HP/this.maxHP + 0.2; //when function is activated, cooldown is set to greater than 0 to cool down
    }
    this.Skott = function(x,y,dx,dy,damage) { //draws the shots
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.damage = damage;
      this.angle = Math.atan2(-dy, -dx);
      var img = document.getElementById("fiendeskott");
      this.draw = function() {
        c.translate(this.x, this.y);
        c.rotate(this.angle - Math.PI/2);
        c.drawImage(img,-50,-50,100,100);
        c.rotate(-this.angle + Math.PI/2);
        c.translate(-this.x, -this.y);
      }

      this.update = function(dt) { //updates the shots position, possibly removing it and checkes wheter it has hit the hero or not
        this.x += this.dx*dt;
        this.y += this.dy*dt;
        var DeltaX = this.x - hero.x;
        var DeltaY = this.y - hero.y;
        if(Math.sqrt(DeltaX*DeltaX + DeltaY*DeltaY) < hero.radius){
          hero.takeDamage(this.damage);
          Sprites.splice(Sprites.indexOf(this), 1);
        }
        if(this.x < 0 || this.x > window.innerWidth
          || this.y < 0 || this.y > window.innerHeight) {
          Sprites.splice(Sprites.indexOf(this), 1);
        }
      }
    }
  }


function LaserBeamBoss(x, y, dx, dy){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.v = 2500;
  this.dxSave = dx;
  this.dySave = dy;
  this.maxHP = 700;
  this.radius = 100;
  this.score = 1000;
  this.cooldown = 0;
  this.damage = 1;
  this.angle = 0;
  this.HP = this.maxHP;
  this.fullAmmo = 15;
  this.ammo = hero.fullAmmo;
  this.ammoResetTime = 1; //necessary for reload to work
  this.ammoResetCooldown = 0;
  var img = document.getElementById("BigWheel");//loads bossimage
  this.draw = function(){ //loads bossimage
    c.drawImage(img,
    Math.floor(this.x-this.radius),
      Math.floor(this.y-this.radius),
      2*this.radius,
      2*this.radius);
    drawHealthBars(this.x-100, this.y-this.radius - 15, 200, 20, this.HP/this.maxHP);
  }
  this.update = function(dt){

    if(this.HP <= 0){
      particles = 70;
      LaserBossBeam.pause();
      explosion(this.x+20, this.y+20);
      explosion(this.x-20, this.y-20);
      explosion(this.x, this.y);
      Sprites.splice(Sprites.indexOf(this), 1);
      LaserBossBeam.currentTime = 0;
    }
    if(this.y - this.radius > 0){
      this.x += this.dx*dt;
      this.y += this.dy*dt;

      this.dx = this.dx + plusOrMinus()*this.maxHP*2/this.HP;
      this.dy = this.dy + plusOrMinus()*this.maxHP*2/this.HP;

        if(this.x+this.radius >= canvas.width || this.x-this.radius <= 0){
          this.dx = -this.dx;
        }
        if(this.y+this.radius >= canvas.height || this.y-this.radius<= 0){
          this.dy = -this.dy;
        }
      }
      else{
        this.x += this.dx*dt;
        this.y += this.dy*dt;
      }
      if(dt % 3 == 0) {
        this.cooldown = 2;
      }
      this.cooldown -= dt;
      this.ammoResetCooldown -= dt;
    this.angle = Math.atan2(this.y - hero.y, this.x - hero.x);

    this.fire();
    this.draw();
    }
    this.applyDamage = function(dmg){
      this.HP -= dmg;
    }

    this.fire = function() {
      if (this.cooldown > 0 || this.ammoResetCooldown > 0) return; // cooldown > 0 => funktionen ej kan aktiveras
      if(this.ammo <= 0){
        if(this.ammoResetCooldown > 0){
          return;
        }
        else {
          this.ammo = this.fullAmmo;
        }
      }

      if (!BossCanon.paused) {
        BossCanon.currentTime = 0;
      } else {
        BossCanon.play(); //Plays a laser sound when a bullet is fired.
      }

        var dx = -Math.cos(this.angle);
        var dy = -Math.sin(this.angle);
        Sprites.push(new this.Skott(this.x - 30 +dx*this.radius, this.y - 30+dy*this.radius, dx*  this.v, dy*  this.v, this.damage));
        Sprites.push(new this.Skott(this.x + 30 +dx*this.radius, this.y + 30+dy*this.radius, dx*  this.v, dy*  this.v, this.damage));
        this.cooldown = 0.07;
        this.ammo -= 1;

        if(this.ammo <=0){
          this.ammo = this.fullAmmo;
          this.ammoResetCooldown = this.ammoResetTime;
        }
      }

    this.Skott = function(x,y,dx,dy,damage) { //draws the shots
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.damage = damage;
      this.angle = Math.atan2(-dy, -dx);
      var img = document.getElementById("fiendeskott");
      this.draw = function() {
        c.translate(this.x, this.y);
        c.rotate(this.angle - Math.PI/2);
        c.drawImage(img,-50,-50,100,100);
        c.rotate(-this.angle + Math.PI/2);
        c.translate(-this.x, -this.y);
      }

      this.update = function(dt) { //updates the shots position, possibly removing it and checkes wheter it has hit the hero or not
        this.x += this.dx*dt;
        this.y += this.dy*dt;
        var DeltaX = this.x - hero.x;
        var DeltaY = this.y - hero.y;
        if(Math.sqrt(DeltaX*DeltaX + DeltaY*DeltaY) < hero.radius){
          hero.takeDamage(this.damage);
          Sprites.splice(Sprites.indexOf(this), 1);
        }
        if(this.x < 0 || this.x > window.innerWidth
          || this.y < 0 || this.y > window.innerHeight) {
          Sprites.splice(Sprites.indexOf(this), 1);
        }
      }
    }
  }
