import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";

import Axios from "axios";
import { createGlobalStyle } from "styled-components";
import { io } from "socket.io-client";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const LoginForm = styled.form`
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column; /*수직 정렬*/
  align-items: center;
  justify-content: center;
`;

const NameBox = styled.div`
  /* margin-right: 2rem;
  margin-left: 2rem; */
  max-width: 400px;
  min-width: 300px;
`;

const PasswordBox = styled.div`
  max-width: 400px;
  min-width: 300px;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const Txt = styled.label`
  font-size: 13px;
`;

const LoginBtnBox = styled.div`
  width: auto;
  margin-top: 2rem;
  max-width: 400px;
  min-width: 300px;
`;

const LoginBtn = styled.button`
  padding: 0.4rem;
  width: 100%;
`;

const LoginOr = styled.div`
  position: relative;
  color: white;
  /* height: 3px; */
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
  width: 50px;
  text-align: center;
  color: white;
  background-color: #e59999;
`;

const HrOr = styled.hr`
  height: 1px;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  width: 70%;
  position: absolute;
  left: 15%;
  text-align: center;
  color: white;
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
          const userName: string = response.data.name;
          console.log(userName);
          history.push({
            pathname: "/rooms",
            state: {
              userName: userName,
            },
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <LoginForm action="" method="post" name="login">
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
        <p className="text-center">Don't have account? Sign up here</p>
      </div>
    </LoginForm>
  );
};
export default Login;
