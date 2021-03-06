const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {auth} = require("./middleware/auth");
const {creatUser, loginUser, authUser, logoutUser} = require('./controller/user');
const {creatRoom, showRooms, joinRoom, memberAuth, leaveRoom, showMembers, sendMsg, getMsg, getRoomId} = require('./controller/socket');

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
let rooms = [];

io.on("connection", (socket) => {
  console.log('connection', socket.id);
  // console.log('namespace1 room', socket.rooms);

  // 방 나감 (방번호, 이름) 0/1
  socket.on('leaveRoom', (roomId, userName, userLocation, userSex, userAge) => {
    console.log('leave', roomId, userName);
    let index = rooms.findIndex(obj => obj['roomId']=== roomId);

    let leaveUser = rooms[index]['members'].filter(
      function (user) {
        return user['name'] !== userName;
      }
    );
    rooms[index]['members'] = leaveUser;
    let members = rooms[index]['members'];
    if(leaveUser.length === 0){
      rooms.splice(index, 1);
      members = []
    }
    io.to(roomId).emit('leaveRoom', roomId, userName, userLocation, userSex, userAge, members);
    socket.leave(roomId);
  });

  socket.on('joinRoom', (roomId, userName, userLocation, userSex, userAge) => {
    console.log('join', roomId, userName);
    let overLapRoom = rooms.filter(function (room) {
      return room["roomId"] === roomId;
    });
    let index = -1;
    let replayUser = true;
    //방이 없다면
    if(overLapRoom.length === 0){
      rooms.push({
        'roomId': roomId,
        'members' : [{
          'name': userName,
          'location' : userLocation,
          'sex' : userSex,
          'age' : userAge
        }]
      });
      index = rooms.findIndex(obj => obj['roomId']=== roomId);
      replayUser = false;
    }
    else{
      index = rooms.findIndex(obj => obj['roomId']=== roomId);
      let overLapUser = rooms[index]['members'].filter(function (user) {
        return user["name"] === userName;
      });
      if(overLapUser.length === 0){
        replayUser = false;
        rooms[index]['members'].push({
          'name': userName,
          'location' : userLocation,
          'sex' : userSex,
          'age' : userAge
        })
      }
      
    }
    
    socket.join(roomId);
    io.to(roomId).emit('joinRoom', roomId, userName, userLocation, userSex, userAge, rooms[index]['members'], replayUser);
  });


  socket.on('message', (roomId, userId, msg) => {
    console.log(userId, msg);
    console.log(userId);
    console.log(msg);
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


//--- socket controller
//createRoom route
app.post('/api/sockets/creatroom', auth, creatRoom);

//showRooms route
app.get('/api/sockets/showrooms', showRooms);


//joinRoom route
app.post('/api/sockets/joinroom', auth, joinRoom);

//memberAuth route
app.post('/api/sockets/memberauth', auth, memberAuth);

//leaveRoom route
app.post('/api/sockets/leaveroom', auth, leaveRoom);

//showMembers route
app.post('/api/sockets/showmembers', showMembers);

//sendMsg route
app.post('/api/sockets/sendmsg',auth, sendMsg);

//getMsg route
app.post('/api/sockets/getmsg',auth, getMsg);

//getRoomId route
app.get('/api/sockets/getroomid',auth, getRoomId);


httpServer.listen(5000);
