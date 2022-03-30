import React, { useEffect } from 'react';

import Auth from "./auth";
import Axios from 'axios';
import Home from "../routes/Home";
import Login from "../routes/Login";
import { useHistory } from 'react-router-dom';

// import LandingPage from '../components/views/LandingPage/LandingPage';


// import { useDispatch } from 'react-redux';
// import { auth } from '../_actions/user_action';

function Auths(SpecificComponent, option) {

    // console.log(SpecificComponent);
    //option:
    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        const NewPage = Auth(SpecificComponent, true);
        return (
                <NewPage />
                )

    }
    return AuthenticationCheck
    
}

export default Auths