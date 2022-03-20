import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Room from "./Room";
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

const ChatRoomsContainer = styled.div``;

const ChatRooms = styled.div`
  background-color: #ebc6c7;
  border-radius: 10px;
  /* margin-top: 1rem; */
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column; /*수직 정렬*/
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  /* height: expression( this.scrollHeight > 99 ? "200px" : "auto" ); */
`;

const RoomCss = styled.div`
  /* color: white; */
  background-color: #f1e0e0;
  border-radius: 15px;
  /* padding-top: 3rem */
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  max-width: 500px;
  min-width: 330px;
  max-height: 100px;
  min-height: 50px;
  padding: 0.5rem 1rem;
`;

const RoomTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const RoomTitles = styled.div`
  display: flex;
`;

const RoomLocation = styled.div`
  margin-right: 0.5rem;
`;

const RoomTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const RoomPeople = styled.div`
  display: flex;
  margin-right: 0.5rem;
`;
const RoomPeopleCount = styled.div``;
const RoomPeopleMax = styled.div``;

const Rooms = (props: any) => {
  const [searchValue, setSearchValue] = useState("");
  const [beforeSearchValue, setBeforeSearchValue] = useState("");
  const onSearchHandler = (event: any) => {
    setSearchValue(event.currentTarget.value);
  };

  const searchClick = (event: any) => {
    if (beforeSearchValue != searchValue) {
      console.log(searchValue);
    } else if (searchValue == "") {
      //모든 채팅방
    }
    setBeforeSearchValue(searchValue);
  };

  const [countList, setCountList] = useState([0]);

  const onAddDetailDiv = () => {
    let countArr = [...countList];
    let counter = countArr.slice(-1)[0];
    counter += 1;
    countArr.push(counter); // index 사용 X
    // countArr[counter] = counter	// index 사용 시 윗줄 대신 사용
    setCountList(countArr);
    console.log(countList);
  };

  return (
    <RoomsCss>
      <ChatStart onClick={onAddDetailDiv}>채팅방 개설하기</ChatStart>
      <ChatInputs>
        <ChatInputBox
          type="email"
          name="email"
          className="form-control"
          id="chat-content"
          aria-describedby="emailHelp"
          placeholder="채팅방 이름 검색"
          defaultValue={searchValue}
          onChange={onSearchHandler}
        />
        <SendBtn
          type="button"
          className="btn btn-warning"
          onClick={searchClick}
        >
          검색
        </SendBtn>
      </ChatInputs>

      <HrCss />
      <ChatRoomsContainer>
        <ChatRooms>
          <Room countList={countList} titleProps="kk" />
        </ChatRooms>
      </ChatRoomsContainer>
    </RoomsCss>
  );
};
export default Rooms;
