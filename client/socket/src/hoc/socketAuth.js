import React, { useEffect } from 'react';

import Axios from 'axios';
import Home from "../routes/Home";
import Login from "../routes/Login";
import { useHistory } from 'react-router-dom';

// import LandingPage from '../components/views/LandingPage/LandingPage';


// import { useDispatch } from 'react-redux';
// import { auth } from '../_actions/user_action';

function SocketAuth(SpecificComponent, option) {
    const history = useHistory();
    // console.log(SpecificComponent);
    //option:
    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        console.log((window.location.pathname));
        const { search } = props.location;
        const roomId = search.substr(4);
        const body = {
            roomId
        };
        console.log(body);
            Axios.post('/api/sockets/memberauth', body)//
            .then(function (response) {
                if(!response.data.success){
                    console.log('해당 채팅방에 참여중이지 않은 유저는 출입금지');
                    history.push('/rooms');
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

export default SocketAuth