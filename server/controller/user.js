const mql = require('../models/mysql-db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = {
    creatUser: (req, res) =>{
        //회원가입 할때 필요한 정보들을 client에서 가져오면
        //그것들을 데이터 베이스에 넣어준다.
        console.log("🚀 ~ req.body", req.body)
        const param = [req.body.name, req.body.password]

        // 회원가입 시 비밀번호 
        bcrypt.hash(param[1], saltRounds, (error, hash)=>{
            param[1] = hash
            console.log(param)
            mql.query('INSERT INTO users(`name`, `password`) VALUES (?,?)', param, (err, row) => {
                if(err) return res.json({success: false, err})
                return res.json({success: true})
            })
        })
    },

    loginUser: (req, res) => {
        const param = [req.body.name, req.body.password]
        console.log("🚀 ~ param", param)
        
        mql.query('SELECT * FROM users WHERE name=?', param[0], (err, row) =>{
            if(err) return res.json({success:false, err})
            console.log('유저이름 있음')
            
            if(row.length > 0){
            //user 존재 -> 비밀번호 확인
            bcrypt.compare(param[1], row[0].password, (error, result)=>{
                if(result){
                //성공
                //비밀번호 일치 -> token 생성
                console.log('login');
                let userToken = jwt.sign(row[0].id, 'secretToken');
                mql.query('UPDATE users SET token=? WHERE name=? AND password=?', [userToken, param[0], row[0].password], (err, row)=>{
                    if(err) return res.status(400).send(err);
                    console.log('token created');          
                    res.cookie("x_auth", userToken).status(200).json({
                        login: true,
                        token: userToken
                    });
                    mql.query('SELECT * FROM users', (err, row)=>{
                    if(err) console.log(err);
                    console.log(row);
                    })
                })
                } else{
                    //비밀번호 불일치
                    return res.json({
                        login: false,
                        err: "비밀번호가 틀렸습니다."
                    });
                }
            })
            }
            else{
                //user 없음
                return res.json({
                    login: false,
                    err: "해당 이메일의 유저가 없습니다."
                });
            }
        })
    },
    authUser: (req, res) => {
        //인증 완료
        let user = req.user;
        //role:0 -> 일반인
        //role:1,2.... -> 관리자
        res.status(200).json({
            id: user.id,
            name: user.name,
            isAuth: true
        });
    },
    logoutUser: (req, res) => {
        console.log('logout');
        mql.query("UPDATE users SET token='' WHERE id=?", req.user.id, (err, row)=>{
            if(err) return res.json({success: false, error: err});
            mql.query('SELECT * FROM users', (err, row)=>{
            if(err) console.log(err);
            console.log(row);
            })
            return res.status(200).send({success:true});
        })
    }
}