//global

var lastClap = (new Date()).getTime();
var gameRunning = false;

var icarusPos;
var sun;
var sunPos;
var health;
var icarus;
var gameWindow;
var gameWindowPos;
var birdPos;
var bird1;
var bird2;
var bird3;

var icarusHeight;
var overlay;

window.addEventListener('load', (e) => {
  calcElements();

  doInstructions();
  //cheat to wait until person clicks the ok button to use microphone
  // setTimeout(startGame(), 1000);
})

window.addEventListener("resize", (e) => {
  calcElements();
})

function doInstructions(){
    if(overlay.style.display == "block"){
      //then do this
    }
    else{
      // startGame();
    }
}

function calcElements() {
  icarus = document.getElementsByClassName("icarus-holder")[0];
  sun = document.getElementsByClassName("sun")[0];
  icarusPos = window.getComputedStyle(icarus);
  sunPos = window.getComputedStyle(sun);
  health = document.getElementById("health");
  gameWindow = document.getElementsByClassName("background-container")[0];
  gameWindowPos = window.getComputedStyle(gameWindow);
  bird1 = document.getElementsByClassName("bird")[0];
  bird2 = document.getElementsByClassName("bird")[1];
  bird3 = document.getElementsByClassName("bird")[2];
  birdPos1 = window.getComputedStyle(bird1);
  birdPos2 = window.getComputedStyle(bird2);
  birdPos3 = window.getComputedStyle(bird3);
  icarusHeight = parseInt(icarusPos.getPropertyValue('height'));
  console.log(icarusHeight);
  overlay = document.getElementsByClassName("overlay")[0];
}

var Recording = function (cb) {
  var microphone;
  var recorder = null;
  var recording = true;
  var volume = null;
  var audioContext = null;
  var callback = cb;

  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is supported.');
    var constraints = { audio: true }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        microphone = audioContext.createMediaStreamSource(stream);
        volume = audioContext.createGain();
        microphone.connect(volume);
        recorder = audioContext.createScriptProcessor(2048, 1, 1);

        recorder.onaudioprocess = function (e) {
          if (!recording) {
            return;
          }
          var left = e.inputBuffer.getChannelData(0);
          callback(new Float32Array(left));
        };
        volume.connect(recorder);// connect the recorder
        recorder.connect(audioContext.destination);
      })
      .catch(function (err) {
        console.error('error: ' + err);
      })
  } else {
    console.error('getUserMedia not supported by browser');
  }
}

//source: https://gist.github.com/pachacamac/d7b3d667ecaa0cd39f36
function detectSound(data) {
  var t = (new Date()).getTime();
  if (t - lastClap < 200) {
    return false; 
  }
  var zeroCrossings = 0, highAmp = 0;
  for (var i = 1; i < data.length; i++) {
    if (Math.abs(data[i]) > 0.25) {
      highAmp++;
    }
    if (data[i] > 0 && data[i - 1] < 0 || data[i] < 0 && data[i - 1] > 0) {
      zeroCrossings++;
    }
  }
  if (highAmp > 20 && zeroCrossings > 30) {
    console.log(highAmp + ' / ' + zeroCrossings);
    lastClap = t;
    return true;
  }
  return false;
}

function deductHealth(amount) {
  health.value -= amount;

  if (health.value == 0) {
    gameRunning = false;
    if(!alert('GAME OVER')){
      window.location.reload(); 
      document.location.reload();}
  }
}

function addHealth(amount) {
  health.value += amount;
}

function startGame() {
  overlay.style.display = "none";
  gameRunning = true
  if (gameRunning) {
    startDeduction();
    var rec = new Recording(function (data) {
      if (detectSound(data)) {
        moveIcarus(-30, 1);
      }
      else {
        moveIcarus(2, 2);
      }
    });
  }
}

function moveIcarus(amountTop, amountLeft) {
  let topValue = parseInt(icarusPos.getPropertyValue("top"));
  let leftValue = parseInt(icarusPos.getPropertyValue("left"));

  let windowWidth = parseInt(gameWindowPos.getPropertyValue("width"));
  let windowHeight = parseInt(gameWindowPos.getPropertyValue("height"));

  var icarusBoundTop = parseInt(icarus.getBoundingClientRect().top);
  var icarusBoundBottom = parseInt(icarus.getBoundingClientRect().bottom);
  var icarusBoundRight = parseInt(icarus.getBoundingClientRect().right);
  var icarusBoundLeft = parseInt(icarus.getBoundingClientRect().left);

  if(icarusBoundRight === windowWidth){
    if(!alert("YOU WIN!!")){
      window.location.reload(); 
      document.location.reload();
    }
  }
  else{
    if (0 < icarusBoundTop && icarusBoundTop < windowHeight) {//&& 0 < icarusBoundBottom && icarusBoundBottom < windowHeight){
      icarus.style.top = (Number(topValue) + Number(amountTop)) + "px";
    }
    if (0 < icarusBoundLeft && icarusBoundLeft < windowWidth && icarusBoundRight < windowWidth) {
      icarus.style.left = (Number(leftValue) + Number(amountLeft)) + "px";
    }
  }
   
}
 function startDeduction(){
  setInterval(function () {

    if (isOverlap("#icarus", "#bird1")) {
      deductHealth(0.1);
    }
    else if(isOverlap("#icarus", "#bird2")) {
      deductHealth(0.1);
    }
    else if (isOverlap("#icarus", "#bird3")) {
      deductHealth(0.1);
    }
    else if(isOverlap("#icarus", "#sun")){
      deductHealth(2);
    }
  }, 1);
 }


function birdsRandomized(theBird) {
  if (gameRunning) {
    let x = Math.floor(Math.random() * parseInt(gameWindowPos.getPropertyValue("height")));

    let h = Math.random() * 100;
    theBird.style.top = x + 'px';
  }
};

let moveBird1 = setInterval(function () {
  birdsRandomized(bird1);
}, 4000);

let moveBird2 = setInterval(function(){
  birdsRandomized(bird2);
}, 3000);


let moveBird3 = setInterval(function(){
  birdsRandomized(bird3);
}, 2000);

function isOverlap(idOne, idTwo) {
  var objOne = $(idOne),
    objTwo = $(idTwo);
  let d1Offset = objOne.offset();
  let d1Height = objOne.outerHeight(true);
  let d1Width = objOne.outerWidth(true);
  let d1Top = d1Offset.top + d1Height;
  let d1Left = d1Offset.left + d1Width;

  let d2Offset = objTwo.offset();
  let d2Height = objTwo.outerHeight(true);
  let d2Width = objTwo.outerWidth(true);
  let d2Top = d2Offset.top + d2Height;
  let d2Left = d2Offset.left + d2Width;

  return !(d1Top < d2Offset.top || d1Offset.top > d2Top || d1Left < d2Offset.left || d1Offset.left > d2Left);
}