const socketIo = require('socket.io');

module.exports = (server) => {
    const io = socketIo(server, {path: '/socket.io'});

    io.on('connection', (socket)=>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        socket.on('disconnect', ()=>{
            console.log('클라이언트 접속 해제', ip, socket.id);
            // clearInterval(socket.interval)
        });
        socket.on('hello', (cb)=>{
            console.log('hello!', cb);
            socket.emit("reply", "ok hi");
        });
        
    })
}