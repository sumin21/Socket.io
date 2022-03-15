import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from "socket.io-client";
import styled from "styled-components";

const AppCss = styled.div`
  background-color: #e59999;
`;
//새로고침 -> 새로 연결 (이슈)
const socket: any = io("ws://localhost:5000/", {});
socket.on("connect", () => {
  console.log(`connect ${socket.id}`);
});
socket.on("connect_error", () => {
  setTimeout(() => {
    socket.connect();
  }, 1000);
});
socket.on("send message", () => {
  console.log(`send!`);
});
// console.log("11", socket.id);
// socket.on("connection", () => {
//   console.log("ss", socket.id);
// });
const Home = (props: any) => {
  const history = useHistory();

  // 빈배열 넣음으로 -> 새로고침 시에만 재적용
  useEffect(() => {
    console.log("접속");
  }, []);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [codes, setCodes] = useState("<div>kkkk</div>");

  const onNameHandler = (event: any) => {
    setName(event.currentTarget.value);
  };

  const onContentHandler = (event: any) => {
    setContent(event.currentTarget.value);
  };

  const handleClick = () => {
    let obj = {
      name,
      content,
    };
    console.log(obj);
    socket.emit("message", obj);
    let newCode = codes + "<div>kkkk</div>";
    setCodes(newCode);
  };

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        history.push("/login");
      } else {
        alert("로그아웃 하는데 실패 했습니다.");
      }
    });
  };

  return (
    <AppCss>
      <h1>Simple Chat</h1>
      <input
        id="name"
        type="text"
        placeholder="name"
        value={name}
        onChange={onNameHandler}
      />
      <input
        id="content"
        type="text"
        placeholder="content"
        value={content}
        onChange={onContentHandler}
      />
      <button onClick={() => handleClick()}>보내기</button>
      <hr />
      <div id="chatbox"></div>
      <Button onClick={onClickHandler}>로그아웃</Button>
      <div className="chats" dangerouslySetInnerHTML={{ __html: codes }}></div>
    </AppCss>
  );
};
export default Home;
