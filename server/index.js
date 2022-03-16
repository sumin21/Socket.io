const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {auth} = require("./middleware/auth");
const {creatUser, loginUser, authUser, logoutUser} = require('./controller/user');

const mysql = require('mysql');

const mql = require('./models/mysql-db');

mql.connect(function(err){
  if(err) throw err;
  console.log('mysql connected..')
});

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

let room = ['room1', 'room2'];

const namespace1 = io.of('/namespace1');

namespace1.on("connection", (socket) => {
  console.log('namespace1', socket.id);

  // 방 나감 (방번호, 이름) 0/1
  socket.on('leaveRoom', (num, name) => {
    socket.leave(room[num], () => {
      console.log(name + ' leave a ' + room[num]);
      namespace1.to(room[num]).emit('leaveRoom', num, name);
    });
  });

  socket.on('joinRoom', (num, name) => {
    socket.join(room[num], () => {
      console.log(name + ' join a ' + room[num]);
      namespace1.to(room[num]).emit('joinRoom', num, name);
    });
  });


  socket.on('message', (num, name, msg) => {
    console.log(msg);
    namespace1.to(room[num]).emit('send message', name, msg);
  });

  socket.on("disconnect", (reason) => {
    console.log('disconnection');
  });
  
});










const namespace2 = io.of('/namespace2');

namespace2.on("connection", (socket) => {
  console.log('namespace2', socket.id);
  socket.emit('namespace2 send message');
  socket.on("disconnect", (reason) => {
    console.log('disconnection');
  });
  
});
const cors = require("cors");

app.use(cors());
// app.use((req, res) => {
// 	res.header("Access-Control-Allow-Origin", "*");
// });
//application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
//application.json 을 분석해서 가져옴
app.use(bodyParser.json());
//cookie
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('hi');
  console.log('hi');
});

//회원가입 route
app.post('/api/users/register', creatUser);

//login route
app.post('/api/users/login', loginUser);


//middleware
app.get('/api/users/auth', auth, authUser);

//logout (login된 상태이기 때문에 auth를 넣어준다.)
app.get('/api/users/logout', auth, logoutUser);

//login route
app.post('/api/users/login', loginUser);


//middleware
app.get('/api/users/auth', auth, authUser);

//logout (login된 상태이기 때문에 auth를 넣어준다.)
app.get('/api/users/logout', auth, logoutUser);


//회원가입 + 로그인

//메세지 전송
// 시간, 보내느 유저jwt, 받는 유저?, 내용,
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