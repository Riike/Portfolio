var btn1 = $('#socket-client-oma');
var btn2 = $('#socket-client-rhys');
var theInput = $('#msgInput')
var sendBtn = $('#btn-send');
var msgDiv = $('#msgDiv');

var ws = undefined;

// btn1.on('click', () => {
//     // btn2.prop('disabled', true);
//     window.location.href = "../pages/p2-1.html?client=OmaOpa";
//     // href="p2.html?client=Rhys"
//     // destination = 'wss://' + location.host + '/client1';
//     // ws = new WebSocket(destination);
//     // ws.onopen = (e) => {
//     //     ws.send("Attempt to Connect")
//     // }
//     // ws.onmessage = (e) => {
//     //     msgDiv.html(e.data);
//     //}
// });

// btn2.on('click', () => {
//     // btn1.prop('disabled', true);
//     window.location.href = "../pages/p2.html?client=Rhys";

//     // destination = 'wss://' + location.host + '/client2';
//     // ws = new WebSocket(destination);
//     // ws.onopen = (e) => {
//     //     ws.send("Attempt to Connect")
//     // }
//     // ws.onmessage = (e) => {
//     //     msgDiv.html(e.data);
//     // }
// });

sendBtn.on('click', () => {
    if (destination != undefined) {
        console.log(theInput.val());
        ws.send(theInput.val());
    }
});