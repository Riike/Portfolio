
function doHijack() {
  var element = document.getElementById("button");

  element.addEventListener("transitionend", myEndFunction);
  element.addEventListener("transitionstart", myStartFunction);

  if (miro.style.visibility === "visible" || recipe.style.visibility === "hidden") {

    element.classList.remove("default");
    element.classList.add("hijacked");

  }
  else {
    element.classList.remove("hijacked");
    element.classList.add("default");

  }
}
function myStartFunction() {
  var miro = document.getElementById("miro");
  var hijack = document.getElementById("chef-bandit");

  miro.style.visibility = "hidden";
  hijack.style.visibility = "hidden";

  //initiate conufusion from teacher
  setTimeout(function () {
    var emojiArray = document.querySelectorAll('.confused');
    for (var i = 0; i < emojiArray.length; i++) {
      emojiArray[i].style.opacity = "100";
    }
  }, 600);
}

function myEndFunction() {
  var greenBox = document.getElementById("green-box");
  var speechBox = document.getElementById("speech-box");
  var notifyText = document.getElementById("button-text");
  var emojiArray = document.querySelectorAll('.happy');
  var confusion = document.querySelectorAll('.confused');

  var recipe = document.getElementById("recipe");

  recipe.style.visibility = "visible";
  greenBox.style.visibility = "hidden";
  speechBox.style.visibility = "hidden";

  notifyText.classList.add("notify");
  notifyText.style.visibility = "visible";

  confusion[0].style.opacity = "0";

  //show laughter and hearts
  for (var i = 0; i < emojiArray.length; i++) {
    emojiArray[i].classList.add("blink");
  };

}