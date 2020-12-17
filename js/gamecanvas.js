
//These two variables are what draw the canvas
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

//here we set the canvas measures equal to the window measures.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//This array is used for giving the stars in the background random colors
var starColors = [
  'rgb(255, 214, 0)',
  'rgb(0, 255, 181)',
  'rgb(0, 79, 255)'
];

///this array is used for giving the explosion particles different colors
var explosionColor1 = [
  'rgba(225, 160, 0, 1)',
  'rgba(240, 255, 0, 1)',
  'rgba(225, 180, 0, 1)'
];

///this array is used for giving the explosion particles different colors
var explosionColor2 = [
  'rgba(255, 101, 0, 1)',
  'rgba(255, 130, 0, 1)',
  'rgba(255, 140, 0, 1)'
];

///this array is used for giving the explosion particles different colors
var explosionColor3 = [
  'rgba(246, 19, 0, 1)',
  'rgba(255, 50, 0, 1)',
  'rgba(255, 10, 0, 1)'
];

var exploded = false;

/*
* This eventlistener makes it so that when the window is resized, the canvas
* resizes with it. This way, if the window is minimized and then maximized, the
* canvas and everything on it will stay proportionate.
*/
window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});//Denna resizar canvasen efter rutans storlek

/*
* This is the constructor for drawing the asteroids. When the player collides
* with an asteroid, the player dies instantly. The asteroid can take damage, and
* when it dies, it exploads and gives the player max HP.
*/
function Asteroids(x, y, dx, dy, width, height, radie, drop){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.width = width;
  this.height = height;
  this.radius = radie;
  this.drop = drop;
  this.img = Asteroid;
  this.damage = hero.HP;
  this.maxHP = 200;
  this.HP = this.maxHP;
  this.draw = function(){
    c.drawImage(this.img, this.x-this.width, this.y-this.height, this.width*2, this.height*2);
    drawHealthBars(this.x - 50, this.y-this.height, 100, 10, this.HP/this.maxHP);
  } //this draws the asteroid and its healtbar
  this.applyDamage = function(damage){
    this.HP -= damage;
  }
  this.update = function(){
    this.x += this.dx;
    this.y += this.dy;
    this.draw();

    if(this.HP <= 0){
      hero.HP = hero.maxHP;
      particles = 600;
      asteroidExplosion.play();
      explosion(this.x+20, this.y+20);
      explosion(this.x-20, this.y-20);
      explosion(this.x, this.y);
      Sprites.splice(Sprites.indexOf(this), 1);
      Monster.splice(Monster.indexOf(this), 1);
    }
    //this is the if-statement that decides what happens when the asteroid is
    //destroyed.

    if(this.x + this.width/2 < 0
      || this.x - this.width/2 > window.innerWidth
      || this.y - this.height/2 > window.innerHeight) {
      Sprites.splice(Sprites.indexOf(this), 1);
      Monster.splice(Monster.indexOf(this), 1);
      //When the asteroid moves outside of the screen, it's spliced out of the array.
    }
    var DeltaX = this.x - hero.x;
    var DeltaY = this.y - hero.y;
    if(Math.sqrt(DeltaX*DeltaX + DeltaY*DeltaY) < hero.radius){
        hero.takeDamage(this.damage);
    }
    //if the player is inside the asteroid, the hero takes damage equal to his HP
    //for instant death.
  }
}

/*
* This is the constructor for drawing the stars on the canvas (the background).
* This.draw draws the stars, and this.update moves them downward on the screen.
* When they move outside of the canvas, their y-value is reset to 0, however their
* x-value is randomized, as to give the effect of encountering new stars and not
* the old ones.
*/

function Stars(x, y, dx, dy, radie, color, glow) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.dySave = dy;
  this.dxSave = dx;
  this.radie = radie;
  this.color = color;
  this.glow = glow;
  this.minsk = 1;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radie, 0, Math.PI * 2, false);
    c.strokeStyle = this.color;
    c.stroke();
    c.fillStyle = this.color;
    c.shadowBlur = 2;
    c.shadowColor = this.glow;
    c.fill();
  }

//This function decides the explosion particles' speed depending on how large they are. Larger
//stars move faster and smaller stars move slower, as to give a 3D effect.
  this.moveRelativeToMass = function() {
      this.dy = (this.dy/this.radie)*20;
      this.dx = (this.dx/this.radie)*20;
  }
  /*
  * The "fade function" lowers the "a" for each particles "rgba-value" to create a fading effect.
  * The function works very similar to the "Kaprekar-challange" since it converts the rgba-value to a string
  * and stores it in an array, looks throught that array, and inserts a lower "a-value". Eventually the particles are removed
  * since it is very loading for the CPU to handle that many canvas objects.
  */
  this.fade = function() {
    this.color = this.color.toString("");
    var start = this.color.lastIndexOf(", ");
    var end = this.color.lastIndexOf(")");
    this.minsk = this.minsk * 0.94;
    this.minsk = " " + this.minsk;
    var aArray = this.color.split("");
    aArray.splice(start, end - start, ",", " ", this.minsk);
    this.color = aArray.join("");
    this.minsk = parseFloat(this.minsk);

    if(this.minsk < 0.01) {
      explosionArray.splice(0, explosionArray.length);
      exploded = false;
    }
  }

  this.accelerate = function() {//deaccelerates the particles from the explosion
    this.dx = this.dx*0.9;
    this.dy = this.dy*0.9;
    this.x += this.dx + hero.dx/1000;
    this.y += this.dy;
  }

  this.update = function() {
  if (this.x > innerWidth + 200 || this.x < -200) {
      this.y = -200;
      this.x = Math.random() * (1.2*innerWidth);
      this.dx = this.dxSave;
    }
    if (this.y > innerHeight + 200) {
      this.y = -200;
      this.x = Math.random() * (1.2*innerWidth);
    }
    if (controller.up == true){
      if (this.dy <= this.dySave*2.7) {
      this.dy = this.dy*1.01;
      }
    }
    else if (controller.down == true || controller.paused == true){
      if (this.dy >= this.dySave/1.7) {
      this.dy = this.dy*0.99;
      }
    }
    else {
      this.dy = this.dySave;
      this.dx = this.dxSave;
    }
    if (controller.up == true && controller.down == true) {
      this.dy = this.dySave;
    }
    this.x += this.dx - hero.dx/1000;
    this.y += this.dy;
  }
}

//This function gives the stars random colors.
function RandomfillStar(){
  var o = Math.round,
    r = Math.random(),
    s = 255;
  return 'rgba(' + o(r * s) + ',' + o(r * s) + ',' + o(r * s) + ',' + (r + 0.1).toFixed(1) + ')';
}

//this function works like moveRelativeToMass, and decides how fast the Stars in
//the background move depending on their size.
function moveRelativeToRadius(r, dy) {
  dy = (r*dy)/1.5;
  return dy;
  }

var starArray = []; //this is the array in which the stars are pushed

//in this for-loop. 50 different stars are created and pushed into starArray.
for (var i = 0; i < 50; i++) {
  var color = RandomfillStar();
  var radie = ((Math.random() * 2));
  var xC = Math.random() * (1.2*innerWidth);
  var yC = Math.random() * (1.2*innerHeight);
  var dxC = moveRelativeToRadius(radie, ((Math.random() - 0.5) * 0.01));
  var dyC = moveRelativeToRadius(radie, 15);
  var glow = starColors[Math.floor(Math.random() * starColors.length)];
  starArray.push(new Stars(xC, yC, dxC, dyC, radie, color, glow));
}

//this function keeps the canvas updated. It is called in one of the loops in gamecore.js.
function updateBackground() {
  for (var i = 0; i < starArray.length; i++) {
    starArray[i].update();

    if(i < explosionArray.length) {
    explosionArray[i].accelerate();
    explosionArray[i].fade();
    }
  }
}

//this function clears the canvas every frame and redraws it after each update.
//it is also called in gamecore.js.
function drawBackground(){
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (var i = 0; i < starArray.length; i++) {
    starArray[i].draw();

    if(i < explosionArray.length) {
    explosionArray[i].draw();
    explosionArray[i].fade();
    }
  }
}

//This constructor is used to draw healthbars for all damagable entities.
function drawHealthBars(x, y, width, height, fraction, opacity) {
  if(opacity == undefined) opacity = 1;
  c.fillStyle = "red";
  c.globalAlpha = opacity;
  c.fillRect(x + width*fraction, y, width - width*fraction, height);
  c.fillStyle = "green";
  c.fillRect(x, y, width*fraction, height);
  c.globalAlpha = 1;
}

function plusOrMinus() {
  x = Math.random() < 0.5 ? -1 : 1;
  return x;
}

var explosionArray = [];

var particles = 0;


/*
* This function is used to create the explosions when damagable entities are killed
* or destroyed. It pushes the particles into the explosionArray and uses the stars
* constructor to create the particles.
*/
function explosion(x, y) {

    for (var i = 0; i < particles; i++) {
    var radie = ((Math.random() * 5) + 1);
    var color;
    /*
    * The color of the explosion-particle is dependant on the radius since smaller particles will
    * travel faster and be darker in color
    */
    if(radie > 4) {
      color = explosionColor1[Math.floor(Math.random() * explosionColor1.length)];
    }
    else if(radie > 2.5) {
      color = explosionColor2[Math.floor(Math.random() * explosionColor2.length)];
    }
    else {
      color = explosionColor3[Math.floor(Math.random() * explosionColor3.length)];
    }
    var glow = color;
    var dxC = plusOrMinus()*Math.random();//the velocity is randomized but the vector is still 1 to create the explosion effect
    var dyC = plusOrMinus()*Math.sqrt(1 - Math.pow(dxC, 2));
    explosionArray.push(new Stars(x, y, dxC, dyC, radie, color, glow));//pushes new "stars" or particles into the array
    explosionArray[i].moveRelativeToMass();//the particles acceliration is dependant by thier mass
    exploded = true;
  }
}
