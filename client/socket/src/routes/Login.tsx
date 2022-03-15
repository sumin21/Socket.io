import React, { useState } from "react";

import Axios from "axios";
import { io } from "socket.io-client";
import { useHistory } from "react-router-dom";

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
    <div className="landing-page">
      <div className="container landing-page-margin">
        <div className="row">
          <div className="col-md-5 mx-auto">
            <div id="first" className="display-class">
              <div className="myform form ">
                <div className="logo mb-3">
                  <div className="col-md-12 text-center">
                    <h1 className="login-text">Studeet</h1>
                  </div>
                </div>
                <form action="" method="post" name="login">
                  <div className="form-group name-box">
                    <label className="name-text">Name</label>
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
                  </div>
                  <div className="form-group password-box">
                    <label className="password-text">Password</label>
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
                  </div>
                  <div className="login-btn-box col-md-12 text-center ">
                    <button
                      type="submit"
                      className=" login-btn btn btn-block btn-primary tx-tfm"
                      onClick={chatBtnClick}
                    >
                      로그인
                    </button>
                  </div>
                  <div className="col-md-12 ">
                    <div className="login-or">
                      <hr className="hr-or" />
                      <span className="span-or">or</span>
                    </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
