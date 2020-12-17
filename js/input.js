var LEFT_KEY; //defines variables for each keycode
var UP_KEY;
var RIGHT_KEY;
var DOWN_KEY;
var SPACE_KEY;
var ESCAPE_KEY;
var RELOAD_KEY;

function loadKeys(){ //loads the value for each key based on the numeric keypad
  LEFT_KEY = 65;
  UP_KEY = 87;
  RIGHT_KEY = 68;
  DOWN_KEY = 83;
  SPACE_KEY = 32;
  ESCAPE_KEY = 27;
  RELOAD_KEY = 82;
}

var mouse = { //sets the mouseposition to undefined
  x: undefined,
  y: undefined
};

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
}); //listens to the mouseposition


document.onkeydown = function(evt) { //Fires an event if any key ispressed
  togglekey(evt.keyCode, true); //execetes the event/function and setting it to "true"
}

document.onkeyup = function(evt) { //Fires an event if any key released
  togglekey(evt.keyCode, false); //execetes the event/function and setting it to "false"
}

var controller = {//crates a controller object and sets every attribute to false
  left: false,
  right: false,
  up: false,
  down: false,
  paused: false,
  fire: false
};

function togglekey(keyCode, isPressed) { //runs the function based on the keyeventlisteners, isPressed is a boolean
  if (keyCode == LEFT_KEY) { //if a specific keycode is equal to the keyvalue, the hero will move at the given direction
    controller.left = isPressed;//When the key is realesed (false), the hero will stop moving at the given direction
  }
  if (keyCode == RIGHT_KEY) {
    controller.right = isPressed;
  }
  if (keyCode == UP_KEY) {
    controller.up = isPressed;
  }
  if (keyCode == DOWN_KEY) {
    controller.down = isPressed;
  }
  if (keyCode == DOWN_KEY) {
    controller.down = isPressed;
  }
  if (keyCode == SPACE_KEY) {
    controller.space = isPressed;
  }
  if (keyCode == ESCAPE_KEY && isPressed) { //when "Esc" is pressed (could also be realesed), the controller will be paused
    setPaused(!controller.paused);
  }
  if (keyCode == RELOAD_KEY && isPressed) { //when realodkey is pressed (could also be realesed), the hero will reload and coldown will reset
    hero.reload();
    hero.ammoResetCooldown = hero.ammoResetTime;
  }
}
