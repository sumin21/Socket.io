import React, { useEffect } from 'react';

import Axios from 'axios';
import { useHistory } from 'react-router-dom';

// import LandingPage from '../components/views/LandingPage/LandingPage';


// import { useDispatch } from 'react-redux';
// import { auth } from '../_actions/user_action';

function Auth(SpecificComponent, option, adminRoute = null) {
    const history = useHistory();
    // console.log(SpecificComponent);
    //option:
    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {

        useEffect(() => {
            Axios.get('/api/users/auth')//
            .then(function (response) {
                console.log(response.data.isAuth);
                //로그인 안한 상태
                if (!response.data.isAuth) {
                    if (option) {
                        history.push('/login');
                    }
                }else {
                    //로그인 한 상태 
                    if (adminRoute && !response.data.isAdmin) {
                        history.push('/');
                    } else {
                        if (option === false) {
                            console.log('로그인한 유저는 출입금지');
                            history.push('/');
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
    
}

export default Auth