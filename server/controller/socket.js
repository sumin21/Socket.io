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
        const param = [req.body.title, req.body.location, req.body.maxNumber, req.body.userId]
        const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        mql.query('SELECT * FROM chatrooms WHERE title=?', param[0], (err,row) => {
            if(err) return res.json({
                success: false, 
                error: err
            });//row 있음 -> 중복 room o -> 생성불가능
            else if(row.length > 0){
                return res.json({
                    success: true,
                    error: '해당 room이 이미 존재합니다. (title 중복)'
                });
            };
            //row 없음 -> 중복 room x -> 생성가능
            
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
        const param = [req.body.roomId, req.body.userId]
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
            };
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
                };

                mql.query('INSERT INTO members(`chatroomsId`, `userId`) VALUES (?,?)', param, (err,row) => {
                    if(err) return res.json({
                        success: false,
                        error: err
                    });
                    return res.json({
                        success: true
                    });
                });
            })
        }) 
    },
    //post
    joinMemberAuth: (req, res) =>{
        //auth
        console.log("🚀 ~ req.body", req.body)
        const param = [req.body.roomId, req.body.userId]
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
            };
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
                };

                mql.query('INSERT INTO members(`chatroomsId`, `userId`) VALUES (?,?)', param, (err,row) => {
                    if(err) return res.json({
                        success: false,
                        error: err
                    });
                    return res.json({
                        success: true
                    });
                });
            })
        })
    },
}
