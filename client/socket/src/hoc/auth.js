import React, { useEffect } from 'react';

import Axios from 'axios';
import Home from "../routes/Home";
import Login from "../routes/Login";
import { useHistory } from 'react-router-dom';

// import LandingPage from '../components/views/LandingPage/LandingPage';


// import { useDispatch } from 'react-redux';
// import { auth } from '../_actions/user_action';

function Auth(SpecificComponent, option) {
    const history = useHistory();
    // console.log(SpecificComponent);
    //option:
    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
            console.log('auth')
            Axios.get('/api/users/auth')//
            .then(function (response) {
                console.log(response.data.isAuth);
                //로그인 안한 상태
                if (!response.data.isAuth) {
                    if (option) {
                        console.log('로그인 안한 유저는 출입금지');
                        history.push('/login');
                    }
                }else {
                    //로그인 한 상태 
                    
                    if (option === false) {
                        console.log('로그인한 유저는 출입금지');
                        history.push('/rooms')
                        // history.go(-1);
                    }
                    
                }
        
            })
            .catch(function (error) {
                console.log(error);
            });
        return (
                <SpecificComponent />
                )

    }
    return AuthenticationCheck
    
}

export default Auth