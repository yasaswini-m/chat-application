import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { addMsgToConversation } from "./controllers/msgs.controller.js";
import msgsRouter from "./routes/msgs.route.js";
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
const server = http.createServer(app); //creating http server on top of app
const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
      }
 });

const userSocketMap = {};

io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    userSocketMap[username] = socket;
    socket.on('chat msg', (msg) => {
        console.log(msg.text);
        console.log(msg.sender);
        console.log(msg.receiver);
        const receiverSocket = userSocketMap[msg.receiver];
        if (receiverSocket) {
            receiverSocket.emit('chat msg', msg);
        }
        addMsgToConversation([msg.sender, msg.receiver],
            {
                text: msg.text,
                sender: msg.sender,
                receiver: msg.receiver
            });
    });
});

app.use('/msgs', msgsRouter);

// route
app.get('/', (req, res) => {
    res.send('congratulations HHLD Folks!');
});

// server
server.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is listening at http://localhost:${port}`);
});


/*
Socket.IO is composed of two parts:

A server that integrates with (or mounts on) the Node.JS HTTP Server (the socket.io package)
A client library that loads on the browser side (the socket.io-client package)
*/
