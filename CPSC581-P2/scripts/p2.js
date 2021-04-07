
let bookPages = ["../images/p2/blue-truck-1.jpeg", "../images/p2/blue-truck-2.jpeg"]
let bookIndex = -1;
let readingBook = false;
let next;
let canvas;
let base_image = new Image();
let ctx;
let popup;
// const { networkInterfaces } = require("os");
let streaming;
const MessageType = {
    SERVER_INFO: 0,
    CLIENT1: 1,
    CLIENT2: 2,
    CALL_REQUEST: 3,
    BOOK: 4,
    SOUND: 5,
    CELEBRATE: 6,
    PEEKABOO: 7
};

var aSocket;
var localStream;
var peerConnection;
var localVideo;
var liveLocalView;
let peekaboo;
let overlay;
let vid_width;
let vid_height;
let remoteVideo;
let didParty = false;
var confetti;

let overlayCC;
let webgl_overlay;

let ctrack;
let fd;
var trackingStarted = false;



const peerConnectionConfig = {
    iceServers: [
        { urls: "stun:stun.stunprotocol.org:3478" },
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.ekiga.net" },
        { urls: "stun:stun.fwdnet.net" },
        { urls: "stun:stun.ideasip.com" },
        { urls: "stun:stun.iptel.org" },
    ],
};

/* CLIENT */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var client = getParameterByName('client');

/* CLIENT */
window.onload = function () {
    localVideo = document.getElementById('local-video');
    remoteVideo = document.getElementById('remote-video');
    liveLocalView = document.getElementById("liveLocalView");
    popup = document.getElementById('popup');

    getWebcam();

    if (client == "Rhys") {
        canvas = document.getElementById("canvas-rhys");
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
    }

    console.log('ws://' + location.host + '/' + client);
    aSocket = new WebSocket('ws://' + location.host + '/' + client);

    aSocket.onmessage = handleMessage;
    aSocket.onclose = handleRemoveTrackEvent;
    //check if other socket  exists first!
    updateUserList(aSocket);

    tippy('#one', {
        content: 'Read Book',
    });
    tippy('#seven', {
        content: 'Play Peekaboo',
    });
    tippy('#two', {
        content: 'Beep!',
    });
    tippy('#five', {
        content: 'Bell!',
    });
    tippy('#six', {
        content: 'Guitar!',
    });
    tippy('#three', {
        content: 'Squeak!',
    });
    tippy('#four', {
        content: 'Celebration',
    });

}
// check whether browser supports webGL
function getWebcam() {
    if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia is supported.');

        var constraints = { audio: true, video: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                localStream = stream;

                if ("srcObject" in localVideo) {
                    localVideo.srcObject = stream;
                } else {
                    localVideo.src = (window.URL && window.URL.createObjectURL(stream));
                }

                vid_width = localVideo.width;
                vid_height = localVideo.height;

            })
            .catch(function (err) {
                console.error('error: ' + err);
            });
    } else {
        console.error('getUserMedia not supported by browser');
    };
}

function start(isCaller) {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.ontrack = gotRemoteStream;
    peerConnection.addStream(localStream);

    if (isCaller) {
        peerConnection.createOffer().then(createdDescription).catch(errorHandler); // using chained Promises for async
    }
}

function gotIceCandidate(event) {
    if (event.candidate != null) {
        aSocket.send(
            JSON.stringify({
                type: MessageType.CALL_REQUEST,
                ice: event.candidate,
                message: "Sending ICE candidate",
            })
        );
        console.log("Sending ICE candidate");
    }
}

function createdDescription(description) {
    console.log("got description");

    peerConnection
        .setLocalDescription(description)
        .then(() => {
            aSocket.send(
                JSON.stringify({
                    type: MessageType.CALL_REQUEST,
                    sdp: peerConnection.localDescription,
                    message: "Requesting call",
                })
            );
            console.log("Requesting call");
        })
        .catch(errorHandler);
}

function gotRemoteStream(event) {
    console.log("got remote stream");
    remoteVideo.srcObject = event.streams[0];
}
/* CAMERA STREAM STUFF */

/* BUTTON STUFF */
// animal button
var webGLContext;

var flag = 0;
const moreButton = document.getElementById("more");
if (moreButton) {
    moreButton.onclick = function () {

        // moreButton.addEventListener("click", function () {
        if (flag == 0) {
  
            $(this).siblings('.one').animate({
                top: '75%',
                left: '99px',
            }, 200);
            $(this).siblings('.seven').animate({
                top: '75%',
                left: '160px',
            }, 200);
            $(this).siblings('.two').delay(200).animate({
                top: '82%',
                left: '99px'
            }, 200);
            $(this).siblings('.three').delay(200).animate({
                top: '82%',
                left: '160px'
            }, 200);
            $(this).siblings('.five').delay(200).animate({
                top: '82%',
                left: '222px'
            }, 200);
            $(this).siblings('.six').delay(200).animate({
                top: '82%',
                left: '284px'
            }, 200);

            $(this).siblings('.four').delay(300).animate({
                top: '89%',
                left: '99px'
            }, 200);
            $(".one i,.two i,.three i,.four i, .five i, .six i, .seven i").delay(500).fadeIn(200);
            flag = 1;
        } else {
            $(".one, .two, .three, .four, .five, .six, .seven").animate(
                {
                    top: '96%',
                    left: '99px'
                },
                200
            );

            $(".one i,.two i,.three i,.four i,.five i, .six i, .seven i").delay(500).fadeOut(200);
            flag = 0;
        }
    }
}


// animal button
// const animalButton = document.getElementById("eight");
// var webGLContext;

// animalButton.onclick = function () {
//     if(localVideo){
//         if (window.WebGLRenderingContext) {
//             webGLContext = document.getElementById('webgl').getContext('webgl') || webgl_overlay.getContext('experimental-webgl');
//             if (!webGLContext || !webGLContext.getExtension('OES_texture_float')) {
//                 webGLContext = null;
//             }
//             ctrack.start(localVideo);
//             positionLoop();

//         }
//         if (webGLContext == null) {
//             alert("Your browser does not seem to support WebGL. Unfortunately this face mask example depends on WebGL, so you'll have to try it in another browser. :(");
//         }
//     }

//     //adjustVideoProportions();
//     //startVideo();
// }

//book button
const bookButton = document.getElementById("one");

bookButton.onclick = function () {
    //show the text slideshow
    //add the sound buttons
    //change the local stream of OmaOpa to the image of the book!!
    console.log("the book button was clicked");

    //if (client == "OmaOpa") {
    if (document.getElementById('text-slideshow').style.display == "none") {
        document.getElementById('popup-text').textContent = "Rhys is viewing the book";
        popup.style.display = "block";

        bookIndex = 0;
        slideIndex = 1;
        // base_image.src = bookPages[bookIndex];
        // ctx.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, canvas.width, canvas.height);
        // canvas.style.visibility = 'visible';
        // localVideo.style.visibility = 'hidden';

        aSocket.send(
            JSON.stringify({
                type: MessageType.BOOK,
                message: "OmaOpa initiate book action",
                bookIndex: bookIndex
            })
        );

        //make button color change 
        bookButton.style.backgroundColor = "#2196f3";
        bookButton.children[0].style.color = "var(--primary)";

        document.getElementById('text-slideshow').style.display = "block";

    }
    else {
        slideIndex = 1;
        aSocket.send(
            JSON.stringify({
                type: MessageType.BOOK,
                message: "OmaOpa stopped book action",
            })
        );
        // canvas.style.visibility = 'hidden';
        // localVideo.style.visibility = 'visible';
        //make button color change 
        bookButton.style.backgroundColor = "var(--primary)";
        bookButton.children[0].style.color = '#2196f3';

        document.getElementById('text-slideshow').style.display = "none";
    }
}
document.getElementById('popup-close').onclick = function () {
    popup.style.display = "none";
}

function showCanvasRhys() {
    bookIndex = 0;
    base_image.src = bookPages[bookIndex];
    ctx.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, canvas.width, canvas.height);
    // canvas.style.visibility = 'visible';
    canvas.style.display = 'block';
    remoteVideo.style.display = 'none';
}
function hideCanvasRhys() {
    canvas.style.display = 'none';
    remoteVideo.style.display = 'block';
}

function setCanvas() {
    base_image.src = bookPages[bookIndex];
    ctx.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, canvas.width, canvas.height);
}

const hornButton = document.getElementById('two');
// if (hornButton) {
hornButton.onclick = function () {
    aSocket.send(
        JSON.stringify({
            type: MessageType.SOUND,
            message: "Play horn",
        })
    );
    // hornButton.addEventListener("click", function () {
    hornButton.style.backgroundColor = "#00e5ff";
    hornButton.children[0].style.color = "var(--primary)";

    let src = '../audio/sf_horn_21.mp3';
    let audio = new Audio(src);
    audio.play();
    setInterval(function () {
        audio.pause();
        hornButton.style.backgroundColor = "var(--primary)";
        hornButton.children[0].style.color = '#00e5ff';
    }, 1500);
}//);
// }

const guitarButton = document.getElementById('six');
// if (hornButton) {
guitarButton.onclick = function () {
    aSocket.send(
        JSON.stringify({
            type: MessageType.SOUND,
            message: "Play guitar",
        })
    );
    // hornButton.addEventListener("click", function () {
    guitarButton.style.backgroundColor = "#00e5ff";
    guitarButton.children[0].style.color = "var(--primary)";

    let src = '../audio/strum.mp3';
    let audio = new Audio(src);
    audio.play();
    setInterval(function () {
        audio.pause();
        guitarButton.style.backgroundColor = "var(--primary)";
        guitarButton.children[0].style.color = '#00e5ff';
    }, 1500);
}//);
// }

const bellButton = document.getElementById('five');
// if (hornButton) {
bellButton.onclick = function () {
    aSocket.send(
        JSON.stringify({
            type: MessageType.SOUND,
            message: "Play bell",
        })
    );
    // hornButton.addEventListener("click", function () {
    bellButton.style.backgroundColor = "#00e5ff";
    bellButton.children[0].style.color = "var(--primary)";

    let src = '../audio/bell.mp3';
    let audio = new Audio(src);
    audio.play();
    setInterval(function () {
        audio.pause();
        bellButton.style.backgroundColor = "var(--primary)";
        bellButton.children[0].style.color = '#00e5ff';
    }, 1500);
}

const squeakButton = document.getElementById("three");
squeakButton.onclick = function () {
    aSocket.send(
        JSON.stringify({
            type: MessageType.SOUND,
            message: "Play squeak",
        })
    );
    // hornButton.addEventListener("click", function () {
    squeakButton.style.backgroundColor = "#00e5ff";
    squeakButton.children[0].style.color = "var(--primary)";

    let src = '../audio/squeak.mp3';
    let audio = new Audio(src);
    audio.play();
    setInterval(function () {
        audio.pause();
        squeakButton.style.backgroundColor = "var(--primary)";
        squeakButton.children[0].style.color = '#00e5ff';
    }, 1500);
}


var recording = false;

var Recording = function (cb) {
    var recorder = null;
    var audioInput = null;
    var volume = null;
    var audioContext = null;
    var callback = cb;
    if (localStream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        volume = audioContext.createGain(); // creates a gain node
        audioInput = audioContext.createMediaStreamSource(localStream); // creates an audio node from the mic stream
        audioInput.connect(volume);// connect the stream to the gain node
        recorder = audioContext.createScriptProcessor(2048, 1, 1);

        recorder.onaudioprocess = function (e) {
            if (!recording) return;
            var left = e.inputBuffer.getChannelData(0);
            //var right = e.inputBuffer.getChannelData(1);
            callback(new Float32Array(left));
        };
        volume.connect(recorder);// connect the recorder
        recorder.connect(audioContext.destination);

    } else { //failure
        alert('Error capturing audio.');
    }
}
function confettiPage() {
    party.screen();
}

const celebrateButton = document.getElementById("four");
function startCelebrate(color) {
    document.body.style.backgroundColor = color;
}
function stopCelebrate() {
    document.body.style.backgroundColor = 'var(--primary)';
}
var onetime2 = true;
celebrateButton.onclick = function () {
    if (onetime2) {
        document.getElementById('popup-text').textContent = "Click again & make noise to start celebration";
        popup.style.display = "block";
        onetime2 = false;
    }
    var rec;
    if (celebrateButton.style.backgroundColor == "var(--primary)") {
        celebrateButton.style.backgroundColor = "#6a1b9a";
        celebrateButton.children[0].style.color = "var(--primary)";
        recording = true;

        rec = new Recording(function (data) {

            if (detectClap(data)) {
                var color = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';

                console.log('clap!');
                aSocket.send(
                    JSON.stringify({
                        type: MessageType.CELEBRATE,
                        message: "start celebrate",
                        color: color
                    })
                );
                startCelebrate(color);

            }
        });
        confetti = setInterval(confettiPage, 1000);

    } else {
        celebrateButton.style.backgroundColor = "var(--primary)";
        celebrateButton.children[0].style.color = "#6a1b9a";
        document.body.style.backgroundColor = 'var(--primary';
        recording = false;
        aSocket.send(
            JSON.stringify({
                type: MessageType.CELEBRATE,
                message: "stop celebrate",
            })
        );
        clearInterval(confetti);
    }
}

let model = null;

const peekabooButton = document.getElementById("seven");

//add counter 3, 2, 1 then send the stop peebakoo
var onetime = true;
peekabooButton.onclick = function () {
    var rec;
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    if (onetime) {
        document.getElementById('popup-text').textContent = "Click the peekaboo button to toggle between visible and invisible to Rhys";
        popup.style.display = "block";
        onetime = false;
    }


    if (peekabooButton.style.backgroundColor == "var(--primary)") {
        peekabooButton.style.backgroundColor = "#2196f3";
        peekabooButton.children[0].style.color = "var(--primary)";
        ctx.font = "30px Roboto";
        ctx.fillStyle = 'rgb(' + Math.random() * 100 + ',' + Math.random() * 100 + ',' + Math.random() * 100 + ')';
        ctx.fillText("PEEKABOO", canvas.width / 4, canvas.height / 2);
        var color = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        aSocket.send(
            JSON.stringify({
                type: MessageType.PEEKABOO,
                message: "start peekaboo",
                color: color
            })
        );

        canvas.style.visibility = "visible";
        canvas.style.backgroundColor = color;
        localVideo.style.visibility = "hidden";


    } else {
        peekabooButton.style.backgroundColor = "var(--primary)";
        peekabooButton.children[0].style.color = "#2196f3";
        aSocket.send(
            JSON.stringify({
                type: MessageType.PEEKABOO,
                message: "stop peekaboo",
            })
        );
        canvas.style.visibility = "hidden";
        localVideo.style.visibility = "visible";

    }

}

function startPeekabooRhys(color) {
    let peekaboo = document.getElementById("peekaboo");
    peekaboo.style.display = "block";

    peekaboo.style.height = window.getComputedStyle(remoteVideo).getPropertyValue('height');
    peekaboo.style.width = window.getComputedStyle(remoteVideo).getPropertyValue('width');
    peekaboo.style.bottom = window.getComputedStyle(remoteVideo).getPropertyValue('bottom');
    peekaboo.style.background = color;
}

function stopPeekabooRhys() {
    let peekaboo = document.getElementById("peekaboo");
    peekaboo.style.display = "none";
}
var lastClap = (new Date()).getTime();

function detectClap(data) {
    var t = (new Date()).getTime();
    if (t - lastClap < 200) return false;
    var zeroCrossings = 0, highAmp = 0;
    for (var i = 1; i < data.length; i++) {
        if (Math.abs(data[i]) > 0.25) highAmp++;
        if (data[i] > 0 && data[i - 1] < 0 || data[i] < 0 && data[i - 1] > 0) zeroCrossings++;
    }
    if (highAmp > 20 && zeroCrossings > 30) {
        //console.log(highAmp+' / '+zeroCrossings);
        lastClap = t;
        return true;
    }
    return false;
}


var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {
        slideIndex = 1;


    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "block";
    if (bookIndex < (bookPages.length - 1)) {
        bookIndex++;
        //base_image.src = bookPages[bookIndex];
        //ctx.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, canvas.width, canvas.height);

        aSocket.send(
            JSON.stringify({
                type: MessageType.BOOK,
                message: "OmaOpa initiate book action",
                bookIndex: bookIndex
            })
        );
    }
    else {
        bookIndex = 0;
        //base_image.src = bookPages[bookIndex];
        //ctx.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, canvas.width, canvas.height);

        aSocket.send(
            JSON.stringify({
                type: MessageType.BOOK,
                message: "OmaOpa initiate book action",
                bookIndex: bookIndex
            })
        );
    }
}
/* BUTTON STUFF */



function handleMessage(mEvent) {
    var msg = JSON.parse(mEvent.data);

    switch (msg.type) {
        case MessageType.SERVER_INFO:
            //msgDiv.html(msg.message);
            break;

        // Message came from Client 1, Handle as Client2
        case MessageType.CLIENT1:
            break;

        // Message came from Client 2, Handle as Client1
        case MessageType.CLIENT2:
            break;
        case MessageType.BOOK:
            //bookIndex = bookIndex;
            if (msg.message == "OmaOpa initiate book action") {
                readingBook = true;
                if (peerConnection) {
                    showCanvasRhys();
                }
                if (msg.bookIndex) {
                    bookIndex = msg.bookIndex;
                    console.log(msg.bookIndex);
                    setCanvas();
                }
            }
            else {
                readingBook = false;
                hideCanvasRhys();
            }
            break;
        case MessageType.PEEKABOO:
            if (msg.message == "start peekaboo") {
                if (peerConnection) {
                    startPeekabooRhys(msg.color);
                }
            }
            else {
                stopPeekabooRhys();
            }
            break;
        case MessageType.CELEBRATE:
            if (msg.message == "start celebrate") {
                if (peerConnection) {
                    confetti = setInterval(confettiPage, 1000);
                    startCelebrate(msg.color);
                }
            }
            else {
                clearInterval(confetti);
                stopCelebrate();
            }
            break;
        case MessageType.CALL_REQUEST:
            if (!peerConnection) {
                //msgDiv.html("Receiving Call!");
                console.log("Receiving Call!");
                start(false);
            }

            // Are we on the SDP stage or the ICE stage of the handshake?
            if (msg.sdp) {
                peerConnection
                    .setRemoteDescription(new RTCSessionDescription(msg.sdp))
                    .then(() => {
                        // Only create answers in response to offers
                        if (msg.sdp.type == "offer") {
                            peerConnection
                                .createAnswer()
                                .then(createdDescription)
                                .catch(errorHandler);
                        }
                    })
                    .catch(errorHandler);
            } else if (msg.ice) {
                peerConnection
                    .addIceCandidate(new RTCIceCandidate(msg.ice))
                    .catch(errorHandler);
            }
        default:
            break;
    }
}


function errorHandler(error) {
    console.error(error);
}


// connect client code

// //update list when someone else joins the page
// aSocket.on("update-user-list", ({ users }) => {
//     updateUserList(users);
// });

function updateUserList(socketId) {
    const activeUserContainer = document.getElementById("active-user-container");
    //check if the other person is connected before assigning!!!
    const alreadyExistingUser = document.getElementById(socketId);
    if (!alreadyExistingUser) {
        const userContainerEl = createUserItemContainer(socketId);
        activeUserContainer.appendChild(userContainerEl);
    }
}

// //update list when someone leaves the page
// aSocket.on("remove-user", ({ socketId }) => {
//     const elToRemove = document.getElementById(socketId);

//     if (elToRemove) {
//         elToRemove.remove();
//     }
// });

// // ask to talk to someone
// aSocket.on("call-made", async data => {
//     await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.offer)
//     );
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

//     socket.emit("make-answer", {
//         answer,
//         to: data.socket
//     });
// });

// //place a call 
// aSocket.on("answer-made", async data => {
//     await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.answer)
//     );

//     if (!isAlreadyCalling) {
//         callUser(data.socket);
//         isAlreadyCalling = true;
//     }
// });
// if ()
//check to see if there is an active user, 
//then call this function:
// //place a call 
// async function callUser(socketId) {
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

//     // aSocket.emit("call-user", {
//     //     offer,
//     //     to: socketId
//     // });
// };

//socket id
function createUserItemContainer(socketId) {
    const userContainerEl = document.createElement("div");

    const usernameEl = document.createElement("p");

    userContainerEl.setAttribute("class", "active-user");
    userContainerEl.setAttribute("id", socketId);
    usernameEl.setAttribute("class", "username");
    if (client == "OmaOpa") {
        usernameEl.innerHTML = `Socket: Rhys`;
    }
    else if (client == "Rhys") {
        usernameEl.innerHTML = `Socket: Oma & Opa`;
    }
    else {
        usernameEl.innerHTML = `Socket: ${socketId}`;
    };

    userContainerEl.appendChild(usernameEl);

    userContainerEl.addEventListener("click", () => {
        //unselectUsersFromList();
        userContainerEl.setAttribute("class", "active-user active-user--selected");
        const talkingWithInfo = document.getElementById("talking-with-info");
        if (client == "OmaOpa") {
            talkingWithInfo.innerHTML = `Talking with: Rhys`;
        }
        else if (client == "Rhys") {
            talkingWithInfo.innerHTML = `Talking with: Oma & Opa`;
        }
        else {
            talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
        }
        // callUser(socketId);
        start(true);
        console.log("started = true")
    });
    return userContainerEl;
};

// // 2 way chat, stream eachothers video and audio feed
// peerConnection.ontrack = function ({ streams: [stream] }) {
//     const remoteVideo = document.getElementById("remote-video");
//     if (remoteVideo) {
//         remoteVideo.srcObject = stream;
//     }
// };

// var interval = setInterval(() => {
//     if (bookIndex >= 0) { // didn't get a pong back within 10s
//         console.log(bookButton);
//         return;
//     }
// }, 10000); // 10s

function handleRemoveTrackEvent(event) {
    var remoteStream = remoteVideo.srcObject;
    var trackList = remoteStream.getTracks();

    if (trackList.length == 0) {
        closeVideoCall();
    }
}

function closeVideoCall() {

    if (myPeerConnection) {
        myPeerConnection.ontrack = null;
        myPeerConnection.onremovetrack = null;
        myPeerConnection.onremovestream = null;
        myPeerConnection.onicecandidate = null;
        myPeerConnection.oniceconnectionstatechange = null;
        myPeerConnection.onsignalingstatechange = null;
        myPeerConnection.onicegatheringstatechange = null;
        myPeerConnection.onnegotiationneeded = null;

        if (remoteVideo.srcObject) {
            remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        }

        if (localVideo.srcObject) {
            localVideo.srcObject.getTracks().forEach(track => track.stop());
        }

        myPeerConnection.close();
        myPeerConnection = null;
    }

    remoteVideo.removeAttribute("src");
    remoteVideo.removeAttribute("srcObject");
    localVideo.removeAttribute("src");
    remoteVideo.removeAttribute("srcObject");
}


