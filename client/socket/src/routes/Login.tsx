import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";

import Axios from "axios";
import { createGlobalStyle } from "styled-components";
import { io } from "socket.io-client";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const LandingCss = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 4.2rem;
  padding-bottom: 4.2rem;
  background-color: #fafafa;
  /* background-image: url('../../../../images/loginpageimg.png'); */
  background-repeat: no-repeat;
  background-size: cover;
`;

const LandingMargin = styled.div`
  margin-top: 4.2rem;
`;

const MyForm = styled.div`
  position: relative;
  display: -ms-flexbox;
  display: flex;
  padding: 1rem;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: 0;
  max-width: 400px;
`;

const NameBox = styled.div`
  margin-right: 2rem;
  margin-left: 2rem;
`;

const PasswordBox = styled.div`
  margin-right: 2rem;
  margin-left: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const LoginText = styled.h1`
  margin-top: 2rem;
  margin-bottom: 0;
`;

const Txt = styled.label`
  font-size: 13px;
`;

const LoginBtnBox = styled.div`
  margin-right: 2.5rem;
  margin-left: 2.5rem;
  width: auto;
  margin-top: 2rem;
`;

const LoginBtn = styled.button`
  padding: 0.4rem;
  width: 100%;
`;

const LoginOr = styled.div`
  position: relative;
  color: #aaa;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const SpanOr = styled.span`
  display: block;
  position: absolute;
  left: 50%;
  top: -2px;
  margin-left: -25px;
  background-color: #fff;
  width: 50px;
  text-align: center;
`;

const HrOr = styled.hr`
  height: 1px;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
`;

const Login = () => {
  const history = useHistory();

  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");

  const onNameHandler = (event: any) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event: any) => {
    setPassword(event.currentTarget.value);
  };

  const chatBtnClick = (event: any) => {
    //변경 없이 submit 클릭 -> 리로드 x
    event.preventDefault();

    let body = {
      name: Name,
      password: Password,
    };

    Axios.post("/api/users/login", body) //
      .then(function (response) {
        console.log(response.data.login);
        //페이지 이동
        if (response.data.login) {
          // const so : propsState = 'kk';

          history.push("/");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <LandingCss>
      <LandingMargin className="container">
        <div className="row">
          <div className="col-md-5 mx-auto">
            <div id="first">
              <MyForm className="form">
                <div className="logo mb-3">
                  <div className="col-md-12 text-center">
                    <LoginText>Socket Chat</LoginText>
                  </div>
                </div>
                <form action="" method="post" name="login">
                  <NameBox className="form-group">
                    <Txt>Name</Txt>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="login-email"
                      aria-describedby="emailHelp"
                      placeholder="Enter name"
                      value={Name}
                      onChange={onNameHandler}
                    />
                  </NameBox>
                  <PasswordBox className="form-group">
                    <Txt>Password</Txt>
                    <input
                      type="password"
                      name="password"
                      id="login-password"
                      className="form-control"
                      aria-describedby="emailHelp"
                      placeholder="Enter Password"
                      value={Password}
                      onChange={onPasswordHandler}
                    />
                  </PasswordBox>
                  <LoginBtnBox className="col-md-12 text-center ">
                    <LoginBtn
                      type="submit"
                      className="btn btn-block btn-primary tx-tfm"
                      onClick={chatBtnClick}
                    >
                      로그인
                    </LoginBtn>
                  </LoginBtnBox>
                  <div className="col-md-12 ">
                    <LoginOr>
                      <HrOr></HrOr>
                      <SpanOr>or</SpanOr>
                    </LoginOr>
                  </div>
                  <div className="register-btn-box col-md-12 text-center ">
                    <div className=" register-btn btn btn-block btn-outline-secondary">
                      Signup
                    </div>
                  </div>
                  <div className="form-group">
                    <p className="text-center">
                      Don't have account? Sign up here
                    </p>
                  </div>
                </form>
              </MyForm>
            </div>
          </div>
        </div>
      </LandingMargin>
    </LandingCss>
  );
};
export default Login;
