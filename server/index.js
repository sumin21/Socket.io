const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log('13', socket.id);
  
});

httpServer.listen(5000);

// const cors = require('cors');
// const io = require('socket.io')(server,{
//     cors : {
//         origin :"*",
//         credentials :true
//     }
// });
// const webSocket = require('./socket');


// app.get('/', function(req, res) {
//   res.send('hello world');
// });

// // io.on('connection', socket=>{
// //   console.log('18',socket.id);
// // })

// server.listen(5000, function(){
//   console.log(`Example app listening on port 5000!`);
// });

// const io = require('socket.io')(server,{
//   cors : {
//       origin :"*",
//       credentials :true
//   }
// });




// app.listen(port, () => console.log(`Example app listening on port ${port}!`));



// webSocket(server);