/*
* This function is essential for the score meter and the ammo meter down in the
* bottom right corner. It allows for 6 zeroes to be drawn and for them to be updated
* at a specified interval.
*/

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/*
* This function counts the fps by subtracting the last time (and dividing it by 1000) from the current time.
* The user can then read the fps
*/

var delta;
var lastCalledTime;
var fps;
function showFPS() {

  if(!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
     return;
  }
  delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
  return Math.ceil(fps);
}

function backgroundLoop(t) {
  t0 = t;
  updateBackground();
  drawBackground();
  if(!controller.playing) {
    window.requestAnimationFrame(backgroundLoop);
  }
}

/*
* This function draws the UI, which includes the scoremeter, the ammometer, the
* player's HP-bar and the crosshair of the mouse.
*/

function drawUI(){
  c.font = "bold 25px Lucida Console, Monaco, monospace";
  c.fillStyle = "rgb(255, 184, 0)";
  c.fillText(pad(hero.score, 6),canvas.width - 150,canvas.height-30);
  //draws the scoremeter

  c.beginPath();
  c.font = "bold 25px Lucida Console, Monaco, monospace";
  c.fillStyle = "rgb(255, 184, 0)";
  c.fillText(pad("Ammo: " + hero.ammo + "/" + hero.fullAmmo, 2),canvas.width - 400,canvas.height-30);
  //draws the ammo-meter

  if(hero.upgrade) {
    c.font = "bold 15px Lucida Console, Monaco, monospace";
    c.fillStyle = "rgb(255, 184, 0)";
    c.fillText(pad("UpgradedAmmo: " + hero.upgradeAmount, 2),canvas.width - 400,canvas.height-60);
  }

  drawHealthBars(30, canvas.height-50, 250, 25, hero.HP/hero.maxHP, 0.4);

  //draws the fps in the top right corner
  c.beginPath();
  c.font = "bold 15px Lucida Console, Monaco, monospace";
  c.fillStyle = "rgb(255, 184, 0)";
  c.fillText(pad("FPS: " + showFPS(), 2),canvas.width - 100, 30);

  //draws the player's healtbar
  c.beginPath();
  c.font = "bold 25px Lucida Console, Monaco, monospace";
  c.fillStyle = "rgb(255, 184, 0)";
  c.fillText(pad("HP: " + Math.ceil(hero.HP) + "/" + Math.ceil(hero.maxHP), 2),310 ,canvas.height-30);
  //draws the HP counter

  if(!controller.paused){
    c.drawImage(hero.crosshair,mouse.x-25, mouse.y-25, 50, 50);
  }
  //this if-statement draws the crosshair if the game is not paused.
}
