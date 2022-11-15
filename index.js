const mongoose = require('mongoose');
const slots = require('./routes/slots');
const express = require('express');
const app = express();
var http = require("http");
var server = http.createServer(app);
var io = require("socket.io")(server);

// mongoose.connect('mongodb://127.0.0.1:27017/test')
mongoose.connect('mongodb+srv://sujit:sujit@cluster0.vnf2bmp.mongodb.net/test')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/api/slots', slots);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

var clients = {};

io.on("connection", (socket) => {
  console.log("connetetd");
  console.log(socket.id, "has joined");
  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
    console.log(clients);
  });
  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });
});
