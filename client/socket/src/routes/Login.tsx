import "bootstrap/dist/css/bootstrap.min.css";

import { Dropdown, DropdownButton } from "react-bootstrap";
import React, { useState } from "react";

import Axios from "axios";
import { createGlobalStyle } from "styled-components";
import { io } from "socket.io-client";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const LoginForm = styled.form<{ active?: boolean }>`
  text-align: center;
  flex-wrap: wrap;
  flex-direction: column; /*수직 정렬*/
  align-items: center;
  justify-content: center;
  display: ${(props) => (props.active ? "none" : "flex")};
  border: 1px solid #ebc6c7;
  padding-bottom: 2rem;
`;

const RegisterForm = styled.form<{ active?: boolean }>`
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column; /*수직 정렬*/
  align-items: center;
  justify-content: center;
  display: ${(props) => (props.active ? "flex" : "none")};
  border: 1px solid #ebc6c7;
  padding-bottom: 2rem;
`;

const LoginTitle = styled.div`
  margin-top: -15px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  color: #ebc6c7;
  background-color: #e59999;
  padding-right: 10px;
  padding-left: 10px;
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

const RegisterBtnBox = styled.div`
  width: auto;
  margin-top: 2rem;
  max-width: 400px;
  min-width: 300px;
`;

const RegisterBtn = styled.button`
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

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RegisterLocationInputBox = styled.div`
  //padding: 2rem;
  /* display: inline-block; */
  min-width: 300px;
  /* max-width: 160px; */
  margin-bottom: 2rem;
`;

const RegisterSexInputBox = styled.div`
  //padding: 2rem;
  /* display: inline-block; */
  min-width: 130px;
  max-width: 140px;
`;

const RegisterAgeInputBox = styled.div`
  //padding: 2rem;
  /* display: inline-block; */
  min-width: 130px;
  max-width: 140px;
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

    if (body.name && body.password) {
      Axios.post("/api/users/login", body) //
        .then(function (response) {
          console.log(response.data.login);
          //페이지 이동
          if (response.data.login) {
            const userName: string = response.data.name;
            console.log(userName);
            history.push({
              pathname: "/",
              state: {
                userName: userName,
              },
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const [displayClass, setDisplayClass] = useState(false);

  const onChangeHandler = (event: any) => {
    setDisplayClass(!displayClass);
    console.log(displayClass);
  };

  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const onRegisterNameHandler = (event: any) => {
    setRegisterName(event.currentTarget.value);
  };
  const onRegisterPasswordHandler = (event: any) => {
    setRegisterPassword(event.currentTarget.value);
  };

  //ageArr
  const ageArr: Array<number> = [];
  for (let j: number = 8; j < 81; j++) {
    ageArr.push(j);
  }

  const [registerLocation, setRegisterLocation] = useState("서울");
  const [registerSex, setRegisterSex] = useState("남");
  const [registerAge, setRegisterAge] = useState(20);

  const onRegisterLocationHandler = (event: any) => {
    setRegisterLocation(event);
  };
  const onRegisterSexHandler = (event: any) => {
    setRegisterSex(event);
  };
  const onRegisterAgeHandler = (event: any) => {
    setRegisterAge(event);
  };

  const registerBtnClick = (event: any) => {
    // const body = {
    //   name: registerName,
    //   password: registerPassword,
    //   location: registerLocation,
    //   sex: registerSex,
    //   age: registerAge,
    // };

    //변경 없이 submit 클릭 -> 리로드 x
    event.preventDefault();

    let body = {
      name: registerName,
      password: registerPassword,
      location: registerLocation,
      sex: registerSex,
      age: registerAge,
    };

    if (body.name && body.password) {
      Axios.post("/api/users/register", body) //
        .then(function (response) {
          //페이지 이동
          if (response.data.success) {
            setDisplayClass(!displayClass);
          } else {
            alert("회원가입에 실패했습니다.");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <LoginForm active={displayClass} action="" method="post" name="login">
        <LoginTitle>Login</LoginTitle>
        <NameBox className="form-group">
          <Txt>Name</Txt>
          <input
            type="text"
            name="text"
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
          <div
            className=" register-btn btn btn-block btn-outline-secondary"
            onClick={onChangeHandler}
          >
            Signup
          </div>
        </div>
      </LoginForm>
      {/* -------- */}
      <RegisterForm active={displayClass} action="" method="post" name="login">
        <LoginTitle>Register</LoginTitle>
        <NameBox className="form-group">
          <Txt>Name</Txt>
          <input
            type="text"
            name="text"
            className="form-control"
            id="register-name"
            aria-describedby="emailHelp"
            placeholder="Enter name"
            value={registerName}
            onChange={onRegisterNameHandler}
          />
        </NameBox>
        <PasswordBox className="form-group">
          <Txt>Password</Txt>
          <input
            type="password"
            name="password"
            id="register-password"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Enter Password"
            value={registerPassword}
            onChange={onRegisterPasswordHandler}
          />
        </PasswordBox>
        <PasswordBox className="form-group">
          <RegisterLocationInputBox>
            <Txt>Location</Txt>
            <DropdownButton
              id="dropdown-register-location-button"
              className="w-100"
              style={{ maxHeight: "28px" }}
              title={registerLocation}
              onSelect={(eventKey) => onRegisterLocationHandler(eventKey)}
            >
              <Dropdown.Item eventKey="서울">서울</Dropdown.Item>
              <Dropdown.Item eventKey="부산">부산</Dropdown.Item>
              <Dropdown.Item eventKey="대구">대구</Dropdown.Item>
              <Dropdown.Item eventKey="인천">인천</Dropdown.Item>
              <Dropdown.Item eventKey="광주">광주</Dropdown.Item>
              <Dropdown.Item eventKey="대전">대전</Dropdown.Item>
              <Dropdown.Item eventKey="울산">울산</Dropdown.Item>
              <Dropdown.Item eventKey="세종">세종</Dropdown.Item>
              <Dropdown.Item eventKey="경기">경기</Dropdown.Item>
              <Dropdown.Item eventKey="강원">강원</Dropdown.Item>
              <Dropdown.Item eventKey="충청">충청</Dropdown.Item>
              <Dropdown.Item eventKey="전라">전라</Dropdown.Item>
              <Dropdown.Item eventKey="경상">경상</Dropdown.Item>
              <Dropdown.Item eventKey="제주">제주</Dropdown.Item>
            </DropdownButton>
          </RegisterLocationInputBox>
          <FlexBetween>
            <RegisterSexInputBox>
              <Txt>Sex</Txt>
              <DropdownButton
                id="dropdown-register-sex-button"
                className="w-100"
                style={{ maxHeight: "28px" }}
                title={registerSex}
                onSelect={(eventKey) => onRegisterSexHandler(eventKey)}
              >
                <Dropdown.Item eventKey="남">남</Dropdown.Item>
                <Dropdown.Item eventKey="여">여</Dropdown.Item>
              </DropdownButton>
            </RegisterSexInputBox>
            <RegisterAgeInputBox>
              <Txt>Age</Txt>
              <DropdownButton
                id="dropdown-register-age-button"
                className="w-100"
                style={{ maxHeight: "28px" }}
                title={registerAge}
                onSelect={(eventKey) => onRegisterAgeHandler(eventKey)}
              >
                {ageArr.map((age, index) => (
                  <Dropdown.Item eventKey={age} key={index}>
                    {age}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </RegisterAgeInputBox>
          </FlexBetween>
        </PasswordBox>
        <RegisterBtnBox className="col-md-12 text-center ">
          <RegisterBtn
            className="btn btn-block btn-primary"
            onClick={registerBtnClick}
          >
            회원가입
          </RegisterBtn>
        </RegisterBtnBox>
        <div className="col-md-12 ">
          <LoginOr>
            <HrOr></HrOr>
            <SpanOr>or</SpanOr>
          </LoginOr>
        </div>
        <div className="form-group">
          <p
            className="text-center"
            style={{ cursor: "pointer" }}
            onClick={onChangeHandler}
          >
            Already have an account?
          </p>
        </div>
      </RegisterForm>
    </div>
  );
};
export default Login;
