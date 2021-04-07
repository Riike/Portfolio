var path = require('path'); 		// some convenient dir/path functions
var express = require('express');	// use the express module
// const { Server } = require('http');
const { sign } = require("crypto");

var app = express();			// this is our express.js instance
const PORT = process.env.PORT || 5000 // Port should be 5000 by default
const DOMAIN = "https://localhost";



// app.use(express.static(path.join(__dirname, 'public'))) // lets us serve static files from the "public" directory
//     .get('/', (req, res) => { // respond to HTTP GET request. '/' is the root endpoint.
//         res.sendFile(path.join(__dirname, 'public/pages/index.html')) // serve the landing static page
//     })
//     .listen(PORT); // keep the server listening on port 5000


const MessageType = {
    SERVER_INFO: 0,
    CLIENT1: 1,
    CLIENT2: 2,
    CALL_REQUEST: 3,
    BOOK: 4
};

const ws = require("ws");
const { Console } = require('console');

var wsServer = new ws.Server({ noServer: true });
app
    .use(express.static(path.join(__dirname, "public")))
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", DOMAIN);
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    })
    .get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "/pages/p2.html"));
    })
    .get("/model", (req, res) => {
        res.sendFile(path.join(__dirname, "/pages/p2.html"));
    })
    .listen(PORT)
    .on("upgrade", (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, (socket) => {
            wsServer.emit("connection", socket, request);
        });
    });

var clients = {}; // iterating over object key:value pairs => object[key] returns key's value
// var activeSockets = [];

wsServer.on("connection", (socket, request ) => {
    // route to endpoint handlers
    // var existingSocket = activeSockets.find(function (existingSocket) { return existingSocket === socket.id; });

    switch (request.url) {
        case "/OmaOpa":
            if (!clients.client1) {
                console.log("OmaOpa Connected");
                clients.client1 = socket;
                socket.send(
                    JSON.stringify({
                        type: MessageType.SERVER_INFO,
                        message: "Connected to server. Waiting for peer..."
                    })
                );

            } else {
                socket.close(1013, "OmaOpa already taken. Try again later.");
            }
            break;

        case "/Rhys":
            if (!clients.client2) {
                console.log("Rhys Connected");
                clients.client2 = socket;
                socket.send(
                    JSON.stringify({
                        type: MessageType.SERVER_INFO,
                        message: "Connected to server. Waiting for peer..."
                    })
                );

            } else {
                socket.close(1013, "Rhys already taken. Try again later.");
            }
            break;

        default:
            console.log("default");
            socket.close(1000, "Endpoint Not Found");
            break;
    }

    //handle and route messages to endpoint handlers
    socket.onmessage = (mEvent) => {
        var msg = JSON.parse(mEvent.data);
        switch (request.url) {
            case "/OmaOpa": //tut5exB
                if (clients.client2 != undefined) { // clients2 exists, forward the message
                    console.log("Forwarded message from OmaOpa to Rhys");
                    console.log(msg);
                    clients.client2.send(JSON.stringify(msg));
                } else {
                    console.log("Waiting for Rhys to connect...");

                    clients.client1.send(
                        JSON.stringify({
                            type: MessageType.SERVER_INFO,
                            message: "Waiting for Rhys to connect..."
                        })
                    );
                }
                break;

            case "/Rhys": //tut5exc
                if (clients.client1 != undefined) {
                    console.log("Forwarded message from Rhys to OmaOpa");
                    console.log(msg);
                    clients.client1.send(JSON.stringify(msg)); // clients1 exists, forward the message
                } else {
                    console.log("Waiting for OmaOpa to connect...");

                    clients.client2.send(
                        JSON.stringify({
                            type: MessageType.SERVER_INFO,
                            message: "Waiting for OmaOpa to connect..."
                        })
                    );
                }
                break;

            default:
                socket.close(1000, "Endpoint Not Found");
                break;
        }
    };
    // Emit to myself the other users connected array to start a connection with each them
    //find(function (existingSocket) { return existingSocket === socket.id; });

    // const otherUsers = clients.filter(socketId => socketId !== socket.id);
    // socket.emit('other-users', otherUsers);

    socket.onclose = (e) => {
        console.log("Socket closed: " + e.code + " " + e.reason); // debug message to confirm closed socket.
        clearInterval(interval); // stop heartbeat for this socket

        if (e.code == 1001) { // code 1001: client closed socket, disconnect all clients and delete them
            for (var s in clients) {
                clients[s].close(4000, 'Peer disconnected');
                clients[s] = undefined;
            }
        }
    };

    // establish ping-pong heartbeats
    socket.isAlive = true;
    socket.on("pong", () => {
        // ping-pong heartbeat
        console.log("pong at " + request.url);
        socket.isAlive = true; // a successful ping-pong means connection is still alive
    });

    var interval = setInterval(() => {
        if (socket.isAlive === false) { // didn't get a pong back within 10s
            socket.terminate(); // kill the socket in cold blood
            clients[request.url.slice(1)] = undefined;
            return;
        }

        socket.isAlive = false; // first assume connection is dead
        socket.ping(); // do the "heartbeat" to 'revive' it
    }, 10000); // 10s
});
