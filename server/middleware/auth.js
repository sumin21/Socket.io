const mql = require('../models/mysql-db');
const jwt = require("jsonwebtoken");

let auth = (req, res, next) => {
    //인증 처리
    //client에서 가져온 token과 db에 보관된 token 비교
    //client cookie
    let token = req.cookies.x_auth;

    jwt.verify(token, 'secretToken', (err, decoded) =>{
        //user id로 user 찾기
        console.log(decoded);
        console.log(token);
        mql.query('SELECT * FROM users WHERE id=? AND token=?', [decoded, token], (err, row) =>{
            if(err) throw err;
            if(row.length > 0){
                //유저 인증 ok
                console.log('auth token=', token);
                req.token = token;
                console.log('auth userInfo=', row[0]);
                req.user = row[0];//
                next();
            } else{
                //유저 인증 no
                return res.json({
                    isAuth: false,
                    err: true
                });
            }
        })  
    })
}

module.exports = {auth}