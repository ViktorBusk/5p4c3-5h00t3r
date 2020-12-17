var music;
var musicTwo;
var pausemusic;
var bossmusic1;
var LaserSoundEffect;
var EnemyLaserBeamsSoundEffect;
var Asteroid;
var bossExplosion;
var asteroidExplosion;
var ReloadSound;
var bossLaser;
var LaserBossBeam;
var hitsound;
var beam2;
var beam3;
var beam4;
var beam5;
var Powerup;
var Powerdown;
var BossCanon;
var bluePowerUpImg;
var greenPowerUpImg;
var hoverSound;
var press;
var ear;
var explodeEars = false;
/*
* Preloads each variable for a specific sound effect (There are some sounds that are never used)
*/
function preload(){
  LaserSoundEffect = document.getElementById("LaserSound");
  EnemyLaserBeamsSoundEffect = document.getElementById("EnemyLaserSound");
  hero.crosshair = document.getElementById("crosshair");
  hero.deathsound = document.getElementById("DeathSound");
  press = document.getElementById("DeathSound");
  music = document.getElementById("BackgroundMusic");
  musicTwo = document.getElementById("BackgroundMusicTwo");
  pausemusic = document.getElementById("PauseMusic");
  bossmusic1 = document.getElementById("bossmusic1");
  boom = document.getElementById("boom");
  chrash3 = document.getElementById("chrash3");
  turn = document.getElementById("turn");
  Asteroid = document.getElementById("Asteroid");
  ReloadSound = document.getElementById("reloadSound");
  bossLaser = document.getElementById("BossLaser");
  LaserBossBeam = document.getElementById("LaserBossBeam");
  hitsound = document.getElementById("HitSound");
  beam2 = document.getElementById("skott2");
  beam3 = document.getElementById("skott3");
  beam4 = document.getElementById("skott4");
  beam5 = document.getElementById("skott5");
  Powerup = document.getElementById("Powerup");
  Powerdown = document.getElementById("Powerdown");
  bossExplosion = document.getElementById("BossExplosion");
  asteroidExplosion = document.getElementById("asteroidExplosion");
  BossCanon = document.getElementById("BossCanon");
  bluePowerUpImg = document.getElementById("blueSquare");
  greenPowerUpImg = document.getElementById("greenSquare");
  MenuSound = document.getElementById("MenuSound");
  earRape = document.getElementById("EarRape");
  musicSave = music;

  if (Math.random() > 0.5) {
    music = musicTwo;
  }
  else {
    music = musicSave;
  }

if (Math.random() < 0.2) {
  pausemusic = earRape;
  explodeEars = true;
  }
}
//An array of sounds that can be played if an enemy dies
var deadSoundArray = [
  boom,
  chrash3
];

function pickDeadSound() {
  var selected = deadSoundArray[Math.floor(Math.random() * deadSoundArray.length)];
  selected.play();//plays a random mp3 file from the array
}

function hoverSound() {
  MenuSound.play();
}

function pressSound() {
  press.play();
}
