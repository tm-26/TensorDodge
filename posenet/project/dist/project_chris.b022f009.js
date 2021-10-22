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
})({"steve.png":[function(require,module,exports) {
module.exports = "/steve.b046c8b7.png";
},{}],"project_chris.js":[function(require,module,exports) {
//display the following message in the "startGame" element
var id = document.getElementById("startGame");
id.innerHTML = "Welcome to Blank's Project!" + "<br/>" + "Waiting to detect a person.";

const playerSource = require('./steve.png');

var playerSprite = new Image();
playerSprite.src = playerSource;
var game_started = false; //check if there is already a game started

setInterval(checkIfPersonDetected, 1000); //Check for a person every second (=1000ms) 

function checkIfPersonDetected() {
  if (person_detected && !game_started) {
    game_started = true;
    id.innerHTML = "Welcome to Blank's Project!" + "<br/>" + "Detected! Don't move, the system is calibrating...";
    setInterval(() => {
      if (!person_detected) {
        id.innerHTML = "Welcome to Blank's Project!" + "<br/>" + "Waiting to detect a person.";
        return;
      }

      if (calibrated) {
        id.innerHTML = "Calibrated! Jummp to start."; //IF USER JUMPED

        game();
      }
    }, 1000); //Check for a person every second (=1000ms) 
  }
} //main function of the game


function game() {
  //define ID for different elements used to make the game
  var id1 = document.getElementById("endGame");
  id.style.display = "none";
  id1.style.display = "none"; //define canvas and its properties

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = screen.width / 4;
  canvas.height = screen.height - 200; // canvas.width = 500; ***
  //variable to check if the canvas sides are touched or not

  var already_touched = true;
  var playsound = document.getElementById("collide");
  var endsound = document.getElementById("end");
  var count = 0;
  var touchright = false;
  var touchleft = true; //object definition for user controlled block*****

  var mySprite = {
    x: 0,
    y: canvas.height - 120,
    width: 54,
    height: 120,
    speed: 200,
    draw: function () {
      ctx.drawImage(playerSprite, this.x, this.y, this.width, this.height);
    }
  }; //circle falling object

  var anvil = {
    x: Math.floor(0 + canvas.width * Math.random()),
    y: canvas.height,
    width: 20,
    height: 20,
    speed: 150,
    draw: function () {
      ctx.beginPath();
      var anvilSprite = new Image();
      anvilSprite.src = new URL("anvilImage.png");
      ctx.fillStyle = this.c;
      ctx.drawImage(anvilSprite, self.x, self.y);
      ctx.fill();
    }
  }; //Object that draws the white line that separates the score from the rest of the canvas

  var line = {
    draw: function () {
      ctx.beginPath();
      ctx.moveTo(0, 35);
      ctx.lineTo(canvas.width, 35);
      /* *** */

      ctx.lineWidth = 5; // set line color

      ctx.strokeStyle = '#ff0000';
      ctx.stroke();
    }
  }; //Function to draw canvas

  function paintCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    /* *** */
  } //Function to draw user controlled object*****


  function player() {
    // ctx.fillStyle = mySprite.color;
    // ctx.fillRect(mySprite.x, mySprite.y, mySprite.width, mySprite.height);
    mySprite.draw();
  } //Function to draw the falling objects


  function fallingObjects() {
    anvil.draw();
  } //definition for event listener *****


  var keysDown = {};
  var keysUp = {};
  window.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
  });
  window.addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
    keysUp[e.keyCode] = true;
  }); //function to recognize the key pressed and update score each time the moving block makes a full trip from side to side

  function update(mod) {
    if (stack_actions.length > 0) {
      var pos = stack_actions.pop();
      stack_actions = [];
      mySprite.x = pos * (canvas.width - 54);
    }

    if (stack_jumps.length > 0) {
      var jump = stack_jumps.pop();
    }

    if (mySprite.x == 0 && !touchleft) {
      count += 10;
      var alert1 = document.getElementById("score");
      updateScore();
      touchright = false;
      touchleft = true;
    }

    if (mySprite.x == canvas.width - 54 && !touchright) {
      count += 10;
      var alert1 = document.getElementById("score");
      updateScore();
      touchright = true;
      touchleft = false;
    } // // *****


    if (38 in keysUp) {
      mySprite.y += mySprite.speed * mod;

      if (mySprite.y < 0) {
        mySprite.y = 0;
      }

      if (mySprite.y > canvas.height - 120) {
        mySprite.y = canvas.height - 120;
      }
    } else if (jump) {
      mySprite.y -= mySprite.speed * mod;

      if (mySprite.y > 0) {
        mySprite.y = 0;
      }

      if (mySprite.y < canvas.height - 190) {
        // 70 (jump height) + 120 (player height)
        mySprite.y = canvas.height - 190;
      }
    }
  } //function to make the falling objects fall vertically


  function update1(mod) {
    for (index in anvil) {
      if (anvil.hasOwnProperty(index)) {
        anvil[index].y += anvil[index].speed * mod;
      }
    }

    anvil.y += anvil.speed * mod;
  } //function that updates score each time a full trip is made


  function updateScore() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + count, 10, 10);
    line.draw();
  } //main function to draw the canvas and every element in it


  function render() {
    playsound.play(); //canvas		 

    paintCanvas(); //moving red object

    player();
    updateScore(); //falling objects

    for (index in anvil) {
      fallingObjects();

      if (anvil.y > canvas.height) //Repeat the object when it falls out of view***
        {
          anvil[index].y = 30; //Account for the image size

          anvil[index].x = Math.floor(0 + (1 + 420 - 0) * Math.random()); //Make it appear randomly along the width  
        } //if condition to detect collision for falling rectangle objects


      if (anvil[index].x < mySprite.x + mySprite.width && anvil[index].x + anvil[index].width > mySprite.x && anvil[index].y < mySprite.y + mySprite.height && anvil[index].y + anvil[index].height > mySprite.y) {
        playsound.pause();
        clearInterval(collision);
        id1.style.display = "block";
        id1.innerHTML = "Game Over" + "<br/>" + "You scored " + count + " points" + "<button class = \"button2\" id=\"btn2\">Replay</button>" + "<button class = \"button3\" id=\"btn2\" onclick=\"closeWin()\">Close</button>";
        document.getElementById("btn2").addEventListener("click", game, false);
        endsound.play();
      }

      if (anvil.y > canvas.height) //Repeat the object when it falls out of view***
        {
          anvil.y = 50; //Account for the image size

          anvil.x = Math.floor(0 + (1 + 475 - 0) * Math.random()); //Make it appear randomly along the width  
        } //if condition to detect collision for falling circle object


      if (anvil.x < mySprite.x + mySprite.width && anvil.x + anvil.width > mySprite.x && anvil.y < mySprite.y + mySprite.height && anvil.y + anvil.height > mySprite.y) {
        playsound.pause();
        clearInterval(collision);
        id1.style.display = "block";
        id1.innerHTML = "Game Over" + "<br/>" + "You scored " + count + " points" + "<button class = \"button2\" id=\"btn2\" onclick=\"refresh()\">Replay</button>" + "<button class = \"button3\" id=\"btn2\" onclick=\"closeWin()\">Close</button>";
        document.getElementById("btn2").addEventListener("click", game, false);
        endsound.play();
      }
    }
  } //run the game at the given time


  function run() {
    update(0.01);
    update1(0.01);
    render();
  }

  var collision = setInterval(run, 10);
} // //function to start e new game
// function refresh()
// {
// 	window.location.reload();
// }
// //function to end game
// function closeWin()
// {
// 	window.close();                                            
// }
},{"./steve.png":"steve.png"}]},{},["project_chris.js"], null)
//# sourceMappingURL=/project_chris.b022f009.js.map