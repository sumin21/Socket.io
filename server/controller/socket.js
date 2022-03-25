const mql = require('../models/mysql-db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = {
    //post
    creatRoom: (req, res) =>{
        //room 정보와 유저id를 전달하면 이를 받아 db에 넣어줌
        console.log("🚀 ~ req.body", req.body)
        //userId : auth server에서 받아옴 (client)
        let userId = req.user.id;
        const param = [req.body.title, req.body.location, req.body.maxNumber, userId]
        const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        mql.query('SELECT * FROM chatrooms WHERE title=?', param[0], (err,row) => {
            if(err) return res.json({
                success: false, 
                error: err
            });//row 있음 -> 중복 room o -> 생성불가능
            else if(row.length > 0){
                return res.json({
                    success: false,
                    error: '해당 room이 이미 존재합니다. (title 중복)'
                });
            }
            //row 없음 -> 중복 room x -> 생성가능
            else{
                mql.query('INSERT INTO chatrooms(`title`, `location`, `maxNumber`, `lastChatTime`) VALUES (?,?,?,?)', [param[0],param[1],param[2],time], (err, result) => {
                    if(err) return res.json({
                        success: false, 
                        error: err
                    })
                    // return res.json({success: true})
                    console.log('insertId', result.insertId);
                    const chatroomId = result.insertId;
                    mql.query('INSERT INTO members(`chatroomsId`, `userId`) VALUES (?,?)', [chatroomId, param[3]], (err, row) => {
                        if(err) return res.json({
                            success: false, 
                            error: err
                        });
                        return res.json({
                            success: true, 
                            chatroomid: chatroomId
                        });
                    })
                })
            }
        });
        
    },

    //get
    showRooms: (req, res) =>{
        //db에 저장된 room 목록을 order하여 client에게 전달해준다.
    
        mql.query('SELECT * FROM chatrooms ORDER BY lastChatTime', (err,row) => {
            if(err) return res.json({
                success: false,
                error: err
            });
            return res.json({
                success: true, 
                rooms: row
            });
        });
        
    },
    //post
    joinRoom: (req, res) =>{
        //roomId, userId -> members db에 추가
        console.log("🚀 ~ req.body", req.body)
        let userId = req.user.id;
        const param = [req.body.roomId, userId]
        mql.query('SELECT * FROM chatrooms WHERE id=?', param[0], (err,row) => {
            if(err) return res.json({
                success: false,
                error: err
            });//row 있음 -> 중복 room o -> 생성불가능
            else if(row.length == 0){
                return res.json({
                    success: false,
                    error: 'roomId에 해당하는 room이 존재하지 않습니다.'
                });
            }
            else {
                mql.query('SELECT * FROM members WHERE chatroomsId=?', param[0], (err,row) => {
                    if(err) return res.json({
                        success: false,
                        error: err
                    });//row 있음 -> 중복 room o -> 생성불가능
                    
                    else if(row.length == 0){
                        return res.json({
                            success: false,
                            error: 'roomId에 참여중인 member가 존재하지 않습니다.'
                        });
                    }
                    else {
                        // (chatroomsId, userId) 쌍 중복 x -> err (db)
                        mql.query('INSERT INTO members(`chatroomsId`, `userId`) VALUES (?,?)', param, (err,row) => {
                            if(err) return res.json({
                                success: false,
                                error: err
                            });
                            return res.json({
                                success: true
                            });
                        });
                    }
                });
            }
        }) 
    },
    //post
    memberAuth: (req, res) =>{
        //auth (server -> client에게 userId 전달 -> server에게 재전달)
        // (client) userId + roomId -> (server) 해당 room에 user가 접속 중인지
        console.log("🚀 ~ req.body", req.body)
        let userId = req.user.id;
        const param = [req.body.roomId, userId]
        mql.query('SELECT * FROM members WHERE chatroomsId=? AND userId=?', param, (err,row) => {
            if(err) return res.json({
                success: false,
                error: err
            });
            else if(row.length >1 || row.length==0){
                return res.json({
                    success: false,
                    error: "해당 room에 접속중인 해당 user 정보가 없거나 혹은 여러개 입니다."
                });
            }
            else{
                return res.json({
                    success: true
                });
            }
            
            
        })
    },
    //post
    leaveRoom: (req, res) =>{
        //auth (server -> client에게 userId 전달 -> server에게 재전달)
        // (client) userId + roomId -> (server) 해당 room에 user가 접속 중인지
        console.log("🚀 ~ req.body", req.body)
        let userId = req.user.id;
        const param = [req.body.roomId, userId]
        mql.query('SELECT * FROM chatrooms WHERE id=?', param[0], (err,row) => {
            if(err) return res.json({
                success: false,
                error: err
            });
            //해당 room이 없는 경우
            else if (row.length == 0){
                return res.json({
                    success: false,
                    error: "해당 room이 존재하지 않습니다."
                });
            }
            else{
                mql.query('DELETE FROM members WHERE chatroomsId=? AND userId=?', param, (err,row) => {
                    if(err) return res.json({
                        success: false,
                        error: err
                    });
                    //delete row 없는 경우
                    else if (row.affectedRows == 0){
                        return res.json({
                            success: false,
                            error: '해당 room에 해당 user가 참여중이지 않습니다.'
                        });
                    }                    
                    else{
                        mql.query('SELECT * FROM members WHERE chatroomsId=?', param[0], (err,row) => {
                            console.log(row.length);
                            if(err) return res.json({
                                success: false,
                                error: err
                            });
                            
                            //해당 room의 남은 인원 = 0
                            else if (row.length == 0){
                                //room 삭제
                                mql.query('DELETE FROM chatrooms WHERE id=?', param[0], (err,row) => {
                                    if(err) return res.json({
                                        success: false,
                                        error: err
                                    });

                                    return res.json({
                                        success: true,
                                        allDelete: true
                                    });
                                });
                            }
                            else{
                                return res.json({
                                    success: true,
                                    allDelete: false
                                });
                            }
                        });
                    }
                });
            }
        })
    },
    //post
    showMembers: (req, res) =>{
        //(cliend) roomId -> (server) 해당 room에 참여중인 인원 전달
        console.log("🚀 ~ req.body", req.body)
        const param = [req.body.roomId]
        mql.query('SELECT * FROM members WHERE chatroomsId=?', param[0], (err,row) => {
            if(err) return res.json({
                success: false,
                error: err
            });
            else if (row.length == 0) return res.json({
                success: false,
                error: '해당 room은 존재하지 않습니다.'
            });
            else{
                return res.json({
                    success: true,
                    memberLength: row.length
                });
            }
        });
    },
    //post
    sendMsg: (req, res) =>{
        //(cliend) roomId, msg -> (server) msg table에 저장
        console.log("🚀 ~ req.body", req.body);
        let userId = req.user.id;
        const param = [req.body.roomId, userId, req.body.msg];
        //해당 채팅방에 참여 중인지 확인
        mql.query('SELECT * FROM members WHERE chatroomsId=? AND userId=?', [param[0], param[1]], (err,row) => {
            if(err) return res.json({
                success: false,
                error: err
            });

            //참여 중
            else if (row.length > 0){
                mql.query('INSERT INTO messages(`chatroomsId`, `userId`, `coment`) VALUES (?,?,?)', param, (err,row) => {
                    if(err) return res.json({
                        success: false,
                        error: err
                    });
                    
                    return res.json({
                        success: true
                    });
                    
                });
            }
        });
    },
    //post
    getMsg: (req, res) =>{
        //(cliend) roomId -> (server) msg table rows 전달
        console.log("🚀 ~ req.body", req.body);
        let userId = req.user.id;
        const param = [req.body.roomId, userId];
        //해당 room이 존재하는지 확인
        mql.query('SELECT * FROM chatrooms WHERE id=?', param[0], (err,row) => {
            if(err) return res.json({
                success: false,
                error: err
            });
            //room 존재
            else if (row.length > 0){
                mql.query('SELECT * FROM messages WHERE chatroomsId=?', param[0], (err,row) => {
                    if(err) return res.json({
                        success: false,
                        error: err
                    });
                    //bool
                    //true : 본인이 보낸 메시지
                    //false : 타인이 보낸 메시지
                    const result = row.map(function(obj){
                        let bool = false;
                        if(obj['userId'] === userId){
                            bool = true;
                        }
                        let newObj = {
                            ...obj,
                            "owner": bool
                        };
                        return newObj;
                    });
                    return res.json({
                        success: true,
                        result
                    });
                    
                });
            }
        });
    },
}
