// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"minecraft_river_side.jpg":[function(require,module,exports) {
module.exports = "/minecraft_river_side.a61234ec.jpg";
},{}],"steve.png":[function(require,module,exports) {
module.exports = "/steve.b046c8b7.png";
},{}],"anvilImage.png":[function(require,module,exports) {
module.exports = "/anvilImage.9bce50fe.png";
},{}],"diamondImage.png":[function(require,module,exports) {
module.exports = "/diamondImage.bba42025.png";
},{}],"project.js":[function(require,module,exports) {
//Variable Declaration
var startScreen = document.getElementById("startGame");
var endScreen = document.getElementById("endGame");
var messageArea = document.getElementById("header");
var message = document.getElementById("message");
var videoArea = document.getElementById("videoArea");
var topScore = localStorage.getItem("currentTopScore");
var game_started_here = false;
var waitingForJump = false; //Background image

const bgImg = require('./minecraft_river_side.jpg');

var bg = new Image();
bg.src = bgImg; //Declaring player sprite

const playerSource = require('./steve.png');

var playerSprite = new Image();
playerSprite.src = playerSource; //Declaring anvil sprite

const anvilSource = require('./anvilImage.png');

var anvilSprite = new Image();
anvilSprite.src = anvilSource; //Declaring diamond sprite

const diamondSource = require('./diamondImage.png');

var diamondSprite = new Image();
diamondSprite.src = diamondSource;
startGame();

function startGame() {
  game_started = false; //Check if there is already a game started

  setInterval(checkIfPersonDetected, 1000); //Check for a person every second (=1000ms)
}

function checkIfPersonDetected() {
  if (person_detected && !game_started) {
    message.innerHTML = "Detected person. Calibrating, please don't move.";

    if (calibrated && !waitingForJump) {
      waitingForJump = true;
    }
  }

  if (!person_detected) {
    waitingForJump = false;
    message.innerHTML = "Waiting to detect person...";
    return;
  }

  if (!game_started_here && game_started) {
    message.innerHTML = "Calibrated! Jump to start.";

    if (stack_jumps.length > 0) {
      var jump = stack_jumps.pop();
      stack_jumps = [];

      if (jump) {
        game();
        game_started_here = true;
        messageArea.style.display = "none";
        videoArea.style.top = "50%";
      }
    }
  }
} //Game loop


function game() {
  var isJumping = false;
  var jumpUp = true;
  var arrayOfAnvils = [];
  var score = 0;
  var anvilAdded = false;
  startScreen.style.display = "none";
  endScreen.style.display = "none"; //Defining canvas

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = screen.width / 3;
  canvas.height = screen.height - 200;
  canvas.style.display = "block"; //Declaring player

  var mySprite = {
    x: 0,
    y: canvas.height - 120,
    width: 54,
    height: 120,
    speed: 200,
    jumpSpeed: 2,
    draw: function () {
      ctx.drawImage(playerSprite, this.x, this.y, this.width, this.height);
    }
  }; //Declaring anvil

  class anvil {
    constructor() {
      this.width = 77;
      this.height = 48;
      this.x = Math.floor(Math.random() * (canvas.width - 77));
      this.y = 0;
      this.speed = 2.5;
    }

    draw() {
      ctx.drawImage(anvilSprite, this.x, this.y, this.width, this.height);
    }

  }

  arrayOfAnvils.push(new anvil()); //Declaring diamond

  var diamond = {
    width: 41,
    height: 41,
    x: Math.floor(Math.random() * (canvas.width - 41)),
    y: canvas.height - mySprite.height - 90,
    //Diamonds spawn a bit higher than the y value of the player when they jump
    draw: function () {
      ctx.drawImage(diamondSprite, this.x, this.y, this.width, this.height);
    } //Declaring line which separates score from game

  };
  var line = {
    draw: function () {
      ctx.beginPath();
      ctx.moveTo(0, 35);
      ctx.lineTo(canvas.width, 35);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }
  }; //Function to draw canvas

  function paintCanvas() {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var background = ctx.createPattern(bg, "no-repeat");
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = background;
    ctx.fill();
  } //Function to draw the falling anvils


  function fallingObjects() {
    for (myAnvil in arrayOfAnvils) {
      arrayOfAnvils[myAnvil].draw();
    }
  } //Function to get input from web-cam


  function update(mod) {
    //changes x-position of player character
    if (stack_actions.length > 0) {
      var pos = stack_actions.pop();
      stack_actions = [];
      mySprite.x = pos * (canvas.width - 54);
    } //checks whether player is jumping


    if (stack_jumps.length > 0) {
      var jump = stack_jumps.pop();
      stack_jumps = [];

      if (jump) {
        isJumping = true;
      }
    } //depending on if the player is jumping, the player character will be moved accordingly


    if (isJumping) {
      if (jumpUp) {
        mySprite.y -= mySprite.jumpSpeed;

        if (mySprite.y < canvas.height - 190) {
          jumpUp = false;
        }
      } else {
        mySprite.y += mySprite.jumpSpeed;

        if (mySprite.y >= canvas.height - 120) {
          isJumping = false;
          jumpUp = true;
        }
      }
    }
  } //Function to show score 


  function updateScore() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, 10, 10);
    line.draw();
  } //Main function to draw the canvas and every element in it


  function render() {
    paintCanvas();
    mySprite.draw();
    updateScore(); //Anvils

    for (myAnvil in arrayOfAnvils) {
      fallingObjects(); //Repeat the object when it falls out of view

      if (arrayOfAnvils[myAnvil].y > canvas.height) {
        arrayOfAnvils[myAnvil].y = arrayOfAnvils[myAnvil].height; //Account for the image size

        arrayOfAnvils[myAnvil].x = Math.floor(Math.random() * (canvas.width - 77));
        ; //Make it appear randomly along the width  
      } //Anvil colision detection


      if (arrayOfAnvils[myAnvil].x < mySprite.x + mySprite.width && arrayOfAnvils[myAnvil].x + arrayOfAnvils[myAnvil].width > mySprite.x && arrayOfAnvils[myAnvil].y < mySprite.y + mySprite.height && arrayOfAnvils[myAnvil].y + arrayOfAnvils[myAnvil].height > mySprite.y) {
        clearInterval(collision);
        endScreen.style.display = "block";
        endScreen.innerHTML = "GAME OVER" + "<br>You scored " + score + " point(s)!<br>A new game will start shortly...";
        setTimeout(function () {
          location.reload();
        }, 5000);
      }
    } //Diamonds


    diamond.draw();

    if (diamond.x < mySprite.x + mySprite.width && diamond.x + diamond.width > mySprite.x && diamond.y < mySprite.y + mySprite.height && diamond.y + diamond.height > mySprite.y) {
      score += 1;

      if (score > topScore) {
        localStorage.setItem("currentTopScore", score);
      }

      if ((score == 2 || score == 10 || score == 20 || score == 45) && !anvilAdded) {
        anvilAdded = true;
        arrayOfAnvils.push(new anvil());
      }

      anvilAdded = false;
      diamond.x = canvas.width + 82;
      setTimeout(function () {
        diamond.x = Math.floor(Math.random() * (canvas.width - 41));
      }, 5000);

      for (myAnvil in arrayOfAnvils) {
        //Check if smaller than max speed, if not increase speed by 0.1
        if (arrayOfAnvils[myAnvil].speed < 5) {
          arrayOfAnvils[myAnvil].speed += 0.1;
        }
      }
    }
  }

  function run() {
    if (started) {
      console.timeEnd("1");
    } else {
      started = true;
      console.time("1");
    }

    update();

    for (myAnvil in arrayOfAnvils) {
      arrayOfAnvils[myAnvil].y += arrayOfAnvils[myAnvil].speed;
    }

    render();
  }

  var started = false;
  var collision = setInterval(run, 10);
}
},{"./minecraft_river_side.jpg":"minecraft_river_side.jpg","./steve.png":"steve.png","./anvilImage.png":"anvilImage.png","./diamondImage.png":"diamondImage.png"}]},{},["project.js"], null)
//# sourceMappingURL=/project.b5dfbff8.js.map