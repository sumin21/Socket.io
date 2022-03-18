import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from "socket.io-client";
import styled from "styled-components";

const LoginCss = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 4.2rem;
  padding-bottom: 4.2rem;
  /* background-image: url('../../../../images/loginpageimg.png'); */
  background-repeat: no-repeat;
  background-size: cover;
`;

const LoginMargin = styled.div`
  margin-top: 4.2rem;
`;

const MyForm = styled.div`
  position: relative;
  display: -ms-flexbox;
  display: flex;
  padding: 3rem;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: 0;
  /* max-width: 600px; */
  min-width: 300px;
  background-color: #e59999;
  text-align: center;
`;

const ChatTitle = styled.h1`
  font-weight: 900;
  color: white;
  margin-bottom: 2rem;
`;

const ChatInputBox = styled.input`
  margin-right: 1rem;
`;

const ChatInputs = styled.div<{ active?: boolean }>`
  display: flex;
  margin-top: 1rem;
  display: ${(props) => (props.active ? "border" : "none")};
`;

const SendBtn = styled.button`
  font-size: small;
  font-weight: 500;
  width: 20%;
`;

const LogoutBtn = styled.button`
  font-size: small;
  font-weight: bold;
  color: #e65065;
  margin-top: 0.7rem;
`;

const LogoutBox = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const HrCss = styled.hr`
  color: white;
  border: none;
  height: 2px !important;
`;

const Chat = styled.div`
  background-color: #ebc6c7;
  border-radius: 10px;
  margin-top: 1rem;
`;

const ChatStart = styled.div`
  background-color: #ebc6c7;
  border-radius: 20px;
  margin-top: 1rem;
  cursor: pointer;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  font-weight: bold;
  color: #e69999;
`;

let socket: any = null;
const Home = (props: any) => {
  const history = useHistory();
  // 빈배열 넣음으로 -> 새로고침 시에만 재적용
  useEffect(() => {
    console.log("접속");
  }, []);

  const [content, setContent] = useState("");
  const [codes, setCodes] = useState("");
  const [displayClass, setDisplayClass]: [
    displayClass: boolean,
    setDisplayClass: (x: any) => void
  ] = useState(false);

  const [chatStartTxt, setchatStartTxt] = useState("채팅 시작하기");

  const onContentHandler = (event: any) => {
    setContent(event.currentTarget.value);
  };

  const handleClick: any = (num: number) => {
    let message = {
      content,
      sender: socket.id,
    };
    console.log(message);

    // num. name. msg
    socket.emit("message", 0, "이수민", message);
    let newCode = codes + `<div class="senderChat">${message.content}</div>`;
    setCodes(newCode);
    setContent("");
    console.log(codes);
  };

  const startClickHandler: any = () => {
    console.log("클릭");
    if (!displayClass) {
      setDisplayClass(true);
      setchatStartTxt("채팅 그만하기");
      //새로고침 -> 새로 연결 (이슈)
      socket = io("ws://localhost:5000/", {});
      socket.on("connect", () => {
        console.log(`connect ${socket.id}`);
      });

      socket.on("connect_error", () => {
        setTimeout(() => {
          socket.connect();
        }, 1000);
      });

      socket.on("leaveRoom", (num: number, name: string) => {
        console.log(`leaveRoom!`, num, name);
      });

      socket.on("joinRoom", (num: number, name: string) => {
        console.log(`joinRoom!`, num, name);
      });

      // sender & receiver message
      socket.on("send message", (name: string, msg: string) => {
        console.log(`send message!`, name, msg);
      });

      socket.emit("joinRoom", 0, "이수민");
    } else {
      setDisplayClass(false);
      setchatStartTxt("채팅 시작하기");
      console.log("그만");
      socket.emit("leaveRoom", 0, "이수민");
    }
  };

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        socket.emit("leaveRoom", 0, "이수민");
        history.push("/login");
      } else {
        alert("로그아웃 하는데 실패 했습니다.");
      }
    });
  };

  return (
    <LoginCss>
      <LoginMargin className="container">
        <div className="row">
          <div className="col-md-9 mx-auto">
            <MyForm className="form">
              <ChatTitle>Simple Chat</ChatTitle>
              <ChatStart onClick={startClickHandler}>{chatStartTxt}</ChatStart>
              <ChatInputs active={displayClass}>
                <ChatInputBox
                  type="email"
                  name="email"
                  className="form-control"
                  id="chat-content"
                  aria-describedby="emailHelp"
                  placeholder="content"
                  value={content}
                  onChange={onContentHandler}
                />
                <SendBtn
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleClick(1)}
                >
                  보내기1
                </SendBtn>
                <SendBtn
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleClick(2)}
                >
                  보내기2
                </SendBtn>
              </ChatInputs>
              <LogoutBox>
                <LogoutBtn
                  type="button"
                  className="btn btn"
                  onClick={onClickHandler}
                >
                  로그아웃
                </LogoutBtn>
              </LogoutBox>
              <HrCss />
              <Chat>
                <div
                  className="chats"
                  dangerouslySetInnerHTML={{ __html: codes }}
                ></div>
              </Chat>
            </MyForm>
          </div>
        </div>
      </LoginMargin>
    </LoginCss>
  );
};
export default Home;
