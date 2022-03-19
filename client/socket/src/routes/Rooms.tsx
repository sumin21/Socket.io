import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from "socket.io-client";
import styled from "styled-components";

const RoomsCss = styled.div``;

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

const ChatInputBox = styled.input`
  margin-right: 1rem;
`;

const ChatInputs = styled.div`
  display: flex;
  margin-top: 1rem;
  display: "border";
`;

const SendBtn = styled.button`
  font-size: small;
  font-weight: 500;
  width: 20%;
  color: #e65065;
  font-weight: bold;
`;

const HrCss = styled.hr`
  color: white;
  border: none;
  height: 2px !important;
`;

const Rooms = (props: any) => {
  return (
    <RoomsCss>
      <ChatStart>채팅방 개설하기</ChatStart>
      <ChatInputs>
        <ChatInputBox
          type="email"
          name="email"
          className="form-control"
          id="chat-content"
          aria-describedby="emailHelp"
          placeholder="채팅방 이름 검색"
          value=""
          //   onChange={onContentHandler}
        />
        <SendBtn
          type="button"
          className="btn btn-warning"
          //   onClick={() => handleClick(1)}
        >
          검색
        </SendBtn>
      </ChatInputs>

      <HrCss />
    </RoomsCss>
  );
};
export default Rooms;
