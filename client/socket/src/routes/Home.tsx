import React, { useEffect, useState } from "react";

import io from "socket.io-client";
import styled from "styled-components";

const AppCss = styled.div`
  background-color: #e59999;
`;

const socket = io("http://localhost:5000");

const Home = () => {
  // 빈배열 넣음으로 -> 새로고침 시에만 재적용
  useEffect(() => {
    console.log("접속");
  }, []);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

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
    </AppCss>
  );
};
export default Home;
