const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {auth} = require("./middleware/auth");
const {creatUser, loginUser, authUser, logoutUser} = require('./controller/user');
const {creatRoom, showRooms, joinRoom, memberAuth, leaveRoom, showMembers, sendMsg, getMsg} = require('./controller/socket');

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

// let room = ['room1', 'room2'];
let room = [];

io.on("connection", (socket) => {
  console.log('connection', socket.id);
  // console.log('namespace1 room', socket.rooms);

  // 방 나감 (방번호, 이름) 0/1
  socket.on('leaveRoom', (roomId, userId) => {
    console.log('leave', roomId, userId);
    socket.leave(roomId);
    io.to(roomId).emit('leaveRoom', roomId, userId);
  });

  socket.on('joinRoom', (roomId, userId) => {
    console.log('join', roomId, userId);
    socket.join(roomId);
    io.to(roomId).emit('joinRoom', roomId, userId);
  });


  socket.on('message', (roomId, userId, msg) => {
    console.log(userId, msg);
    io.to(roomId).emit('send message', userId, msg);
  });

  socket.on("disconnect", (reason) => {
    console.log('disconnection');
  });
  
});



const cors = require("cors");

app.use(cors());

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

//createRoom route
app.post('/api/users/creatroom', auth, creatRoom);

//showRooms route
app.get('/api/users/showrooms', showRooms);


//joinRoom route
app.post('/api/users/joinroom', auth, joinRoom);

//memberAuth route
app.post('/api/users/memberauth', auth, memberAuth);

//leaveRoom route
app.post('/api/users/leaveroom', auth, leaveRoom);

//showMembers route
app.post('/api/users/showmembers', showMembers);

//sendMsg route
app.post('/api/users/sendmsg',auth, sendMsg);

//getMsg route
app.post('/api/users/getmsg',auth, getMsg);


httpServer.listen(5000);
