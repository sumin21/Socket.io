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
  color: #e65065;
  font-weight: bold;
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

  // user name
  const location: any = useLocation<string>();
  let userName: string = "";
  try {
    userName = location.state.userName;
  } catch (err) {
    userName = "";
  }

  const handleClick: any = (num: number) => {
    let message = {
      content,
      sender: socket.id,
    };
    console.log(message);

    // num. name. msg
    socket.emit("message", 0, userName, message);
    // let newCode = codes + `<div class="senderChat">${message.content}</div>`;
    // setCodes(newCode);
    setContent("");
    // console.log(codes);
  };

  let chat: boolean = true;
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

      // socket.on("connect_error", () => {
      //   setTimeout(() => {
      //     socket.connect();
      //   }, 1000);
      // });

      socket.emit("joinRoom", 0, userName);
    } else {
      setDisplayClass(false);
      setchatStartTxt("채팅 시작하기");
      console.log("그만");
      socket.emit("leaveRoom", 0, userName);
      setCodes("");
    }
  };

  const socketHandler: any = () => {
    console.log("chat");
    socket.on("leaveRoom", (num: number, name: string) => {
      console.log(`leaveRoom!`, num, name);
    });

    socket.on("joinRoom", (num: number, name: string) => {
      console.log(`joinRoom!`, num, name);
      setcodeClassName2("joinRoom");
      setMessage2(`${name}님이 채팅방에 입장하셨습니다.`);
      let newCode =
        codes +
        `<div class='joinRoom'>${name}님이 채팅방에 입장하셨습니다.</div>`;
      setbol(true);
      setCodes2(newCode);
    });

    // sender & receiver message
    socket.on(
      "send message",
      (name: string, msg: { content: string; sender: string }) => {
        console.log(`send message!`, name, msg);
        let messages = {
          message: msg.content,
          sender: msg.sender,
        };
        let codeClassName: string = "";
        if (messages.sender == socket.id) {
          codeClassName = "senderChat";
        } else {
          codeClassName = "receiverChat";
        }
        codesHandler(codeClassName, messages.message);
        setContent("");
      }
    );
  };

  const [codes2, setCodes2] = useState("1");
  const [bol, setbol] = useState(true);
  const [codeClassName2, setcodeClassName2] = useState("");
  const [message2, setMessage2] = useState("");

  useEffect(() => {
    if (bol) {
      console.log(codes, "///"); //
      let newCode = codes + `<div class=${codeClassName2}>${message2}</div>`;
      setCodes(newCode);
      // setCodes2(newCode);
    }
    return () => {
      setbol(false);
      setCodes2("");
    };
  }, [codes2]);

  const codesHandler = (codeClassName: string, message: string) => {
    console.log("codesss");
    console.log(codes); //
    let newCode = codes + `<div class=${codeClassName}>${message}</div>`;
    setcodeClassName2(codeClassName);
    setMessage2(message);
    setbol(true);
    setCodes2(newCode);
    console.log(newCode);
    console.log(codes);
  };

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        socket.emit("leaveRoom", 0, userName);
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
              <ChatStart
                onClick={() => {
                  startClickHandler();
                  socketHandler();
                }}
              >
                {chatStartTxt}
              </ChatStart>
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
                  className="btn btn-warning"
                  onClick={() => handleClick(1)}
                >
                  전송
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
