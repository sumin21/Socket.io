import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Axios from "axios";
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

const AddRoom = styled.div<{ active?: boolean }>`
  background-color: #ebc6c7;
  border-radius: 20px;
  margin-top: 1rem;
  cursor: pointer;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-right: 1.2rem;
  padding-left: 1.2rem;
  font-weight: bold;
  color: #e69999;
  display: ${(props) => (props.active ? "block" : "none")};
`;

const AddRoomBtn = styled.div<{ active?: boolean }>`
  background-color: #e59999;
  border-radius: 10px;
  margin-top: 1rem;
  cursor: pointer;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  font-weight: bold;
  color: white;
  display: ${(props) => (props.active ? "block" : "none")};
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RoomTitleInputBox = styled.input`
  //padding: 2rem;
  /* display: inline-block; */
  /* min-width: 100px;
  max-width: 160px; */
  margin-top: 0.5rem;
`;

const RoomLocationInputBox = styled.input`
  //padding: 2rem;
  /* display: inline-block; */
  min-width: 100px;
  max-width: 160px;
`;

const RoomMaxMemberInputBox = styled.input`
  //padding: 2rem;
  /* display: inline-block; */
  min-width: 100px;
  max-width: 160px;
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

type Roomtype = {
  id: number;
  lastChatTime: string;
  location: string;
  maxNumber: number;
  title: string;
};

const Rooms = (props: any) => {
  const [rooms, setRooms]: [
    rooms: Array<Roomtype>,
    setRooms: (x: any) => void
  ] = useState([]);
  const [countList, setCountList] = useState([0]);
  const [newRooms, setNewRooms]: [
    rooms: Array<Roomtype>,
    setRooms: (x: any) => void
  ] = useState([]);
  useEffect(() => {
    console.log("rooms 접속");

    // 로그인 안된 유저는 요청 못보내게 막아야 하나?
    Axios.get("/api/sockets/showrooms") //
      .then(function (response) {
        console.log("showrooms result:", response.data.results);
        //rooms component 생성
        let result = response.data.results;

        //newRooms: promise 객체
        const newRoomsFunc = async () => {
          const newRooms = result.map(async (row: Roomtype) => {
            let body = {
              roomId: row.id,
            };
            const newRoom = await Axios.post("/api/sockets/showmembers", body) //
              .then(function (response) {
                const newRow = {
                  ...row,
                  memberLength: response.data.memberLength,
                };
                return newRow;
              })
              .catch(function (error) {
                console.log(error);
                return;
              });
            return newRoom;
          });
          const newRoomsPromise = await Promise.all(newRooms);
          console.log(newRoomsPromise); //
          setRooms(newRoomsPromise);
          console.log("rooms", rooms);
        };
        newRoomsFunc();
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

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

  const [isBlock, setIsBlock] = useState(false);
  const [addChatTxt, setAddChatTxt] = useState("채팅방 개설하기");
  const [chatTitle, setChatTitle] = useState("");
  const [chatLocation, setChatLocation] = useState("");
  const [chatMaxMember, setChatMaxMember] = useState(0);

  const addChatRoomClick = () => {
    if (isBlock) {
      setAddChatTxt("채팅방 개설하기");
    } else {
      setAddChatTxt("닫기");
    }
    setIsBlock(!isBlock);
  };

  const onRoomTitleHandler = (event: any) => {
    setChatTitle(event.currentTarget.value);
  };
  const onRoomLocationHandler = (event: any) => {
    setChatLocation(event.currentTarget.value);
  };
  const onRoomMaxMenberHandler = (event: any) => {
    setChatMaxMember(event.currentTarget.value);
  };

  const addChatRoomBtnClick = () => {
    let body = {
      title: chatTitle,
      location: chatLocation,
      maxNumber: chatMaxMember,
    };

    console.log(body);

    // if (isBlock) {
    //   setAddChatTxt("채팅방 개설하기");
    // } else {
    //   setAddChatTxt("닫기");
    // }
    // setIsBlock(!isBlock);
  };

  return (
    <RoomsCss>
      <ChatStart onClick={addChatRoomClick}>{addChatTxt}</ChatStart>
      <AddRoom active={isBlock}>
        <FlexBetween>
          <RoomLocationInputBox
            type="email"
            name="email"
            className="form-control"
            id="chat-location"
            aria-describedby="chatHelp"
            placeholder="채팅방 지역"
            defaultValue={chatLocation}
            onChange={onRoomLocationHandler}
          ></RoomLocationInputBox>
          <RoomMaxMemberInputBox
            type="email"
            name="email"
            className="form-control"
            id="chat-maxMember"
            aria-describedby="chatHelp"
            placeholder="채팅방 최대인원"
            defaultValue={chatMaxMember}
            onChange={onRoomMaxMenberHandler}
          ></RoomMaxMemberInputBox>
        </FlexBetween>
        <RoomTitleInputBox
          type="email"
          name="email"
          className="form-control"
          id="chat-title"
          aria-describedby="chatHelp"
          placeholder="채팅방 제목"
          defaultValue={chatTitle}
          onChange={onRoomTitleHandler}
        ></RoomTitleInputBox>
        <AddRoomBtn active={isBlock} onClick={addChatRoomBtnClick}>
          채팅방 개설하기
        </AddRoomBtn>
      </AddRoom>
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
          <Room rooms={rooms} />
        </ChatRooms>
      </ChatRoomsContainer>
    </RoomsCss>
  );
};
export default Rooms;
function getPromise() {
  throw new Error("Function not implemented.");
}
