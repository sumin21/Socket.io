import "bootstrap/dist/css/bootstrap.min.css";

import { Dropdown, DropdownButton } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Axios from "axios";
import Room from "./Room";
import axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

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

const RoomLocationInputBox = styled.div`
  //padding: 2rem;
  /* display: inline-block; */
  min-width: 150px;
  max-width: 160px;
`;

const RoomMaxMemberInputBox = styled.div`
  //padding: 2rem;
  /* display: inline-block; */
  min-width: 150px;
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
  flex-direction: column; /*?????? ??????*/
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
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

const NoRooms = styled.div`
  font-size: small;
  font-weight: bold;
  color: #e59999;
`;

type Roomtype = {
  id: number;
  lastChatTime: string;
  location: string;
  maxNumber: number;
  title: string;
};

const Rooms = (props: any) => {
  const history = useHistory();

  const [rooms, setRooms]: [
    rooms: Array<Roomtype>,
    setRooms: (x: any) => void
  ] = useState([]);

  const [useEffectBool, setUseEffectBool] = useState(true);

  useEffect(() => {
    console.log("rooms ??????");

    Axios.get("/api/users/auth") //
      .then(function (response) {
        console.log(response.data.isAuth);
        //????????? ??? ??????
        if (response.data.isAuth) {
          // ????????? ?????? ????????? ?????? ???????????? ????????? ???????
          Axios.get("/api/sockets/showrooms") //
            .then(function (response) {
              if (response.data.success) {
                console.log("showrooms result:", response.data.results);
                //rooms component ??????
                let result = response.data.results;
                //newRooms: promise ??????
                const newRoomsFunc = async () => {
                  const newRooms = result.map(async (row: Roomtype) => {
                    let body = {
                      roomId: row.id,
                    };
                    const newRoom = await Axios.post(
                      "/api/sockets/showmembers",
                      body
                    ) //
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
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
  }, [useEffectBool]);

  const [searchValue, setSearchValue] = useState("");
  const [beforeSearchValue, setBeforeSearchValue] = useState("");
  const onSearchHandler = (event: any) => {
    setSearchValue(event.currentTarget.value);
  };

  const searchClick = (event: any) => {
    if (beforeSearchValue != searchValue) {
      console.log(searchValue);
    } else if (searchValue == "") {
      //?????? ?????????
    }
    setBeforeSearchValue(searchValue);
  };

  const [isBlock, setIsBlock] = useState(false);
  const [addChatTxt, setAddChatTxt] = useState("????????? ????????????");
  const [chatTitle, setChatTitle] = useState("");
  const [chatLocation, setChatLocation] = useState("??????");
  const [chatMaxMember, setChatMaxMember] = useState(5);

  const addChatRoomClick = () => {
    if (isBlock) {
      setAddChatTxt("????????? ????????????");
    } else {
      setAddChatTxt("??????");
    }
    setIsBlock(!isBlock);
  };

  const onRoomTitleHandler = (event: any) => {
    setChatTitle(event.currentTarget.value);
  };
  const onRoomLocationHandler = (event: any) => {
    console.log(event);
    setChatLocation(event);
  };
  const onRoomMaxMenberHandler = (event: any) => {
    setChatMaxMember(event);
  };

  const addChatRoomBtnClick = () => {
    let body = {
      title: chatTitle,
      location: chatLocation,
      maxNumber: chatMaxMember,
    };

    Axios.post("/api/sockets/creatroom", body) //
      .then(function (response) {
        // chatroomid
        if (response.data.success) {
          console.log(response.data.chatroomid);
          // setUseEffectBool(!useEffectBool);
          history.push(`/room?id=${response.data.chatroomid}`);
        } else {
          alert("???????????? ???????????????. ?????? ????????? ??????????????????.");
        }
      })
      .catch(function (error) {
        console.log(error);
        return;
      });
    console.log(body);
  };

  const onLogoutClickHandler = () => {
    axios
      .get(`/api/users/logout`)
      .then((response) => {
        if (response.data.success) {
          // socket.emit("leaveRoom", 0, userName);
          history.push("/login");
        } else {
          alert("???????????? ????????? ?????? ????????????.");
        }
      })
      .catch(function (error) {
        console.log(error);
        return;
      });
  };

  return (
    <RoomsCss>
      <ChatStart onClick={addChatRoomClick}>{addChatTxt}</ChatStart>
      <AddRoom active={isBlock}>
        <FlexBetween>
          <RoomLocationInputBox>
            <DropdownButton
              id="dropdown-location-button"
              className="w-100"
              style={{ maxHeight: "28px" }}
              title={chatLocation}
              onSelect={(eventKey) => onRoomLocationHandler(eventKey)}
            >
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
              <Dropdown.Item eventKey="??????">??????</Dropdown.Item>
            </DropdownButton>
          </RoomLocationInputBox>
          <RoomMaxMemberInputBox>
            <DropdownButton
              id="dropdown-maxnumber-button"
              className="w-100"
              title={chatMaxMember}
              onSelect={(eventKey) => onRoomMaxMenberHandler(eventKey)}
            >
              <Dropdown.Item eventKey="2">2</Dropdown.Item>
              <Dropdown.Item eventKey="3">3</Dropdown.Item>
              <Dropdown.Item eventKey="4">4</Dropdown.Item>
              <Dropdown.Item eventKey="5">5</Dropdown.Item>
              <Dropdown.Item eventKey="6">6</Dropdown.Item>
              <Dropdown.Item eventKey="7">7</Dropdown.Item>
              <Dropdown.Item eventKey="8">8</Dropdown.Item>
              <Dropdown.Item eventKey="9">9</Dropdown.Item>
              <Dropdown.Item eventKey="10">10</Dropdown.Item>
              <Dropdown.Item eventKey="11">11</Dropdown.Item>
              <Dropdown.Item eventKey="12">12</Dropdown.Item>
              <Dropdown.Item eventKey="13">13</Dropdown.Item>
              <Dropdown.Item eventKey="14">14</Dropdown.Item>
              <Dropdown.Item eventKey="15">15</Dropdown.Item>
            </DropdownButton>
          </RoomMaxMemberInputBox>
        </FlexBetween>
        <RoomTitleInputBox
          type="email"
          name="email"
          className="form-control"
          id="chat-title"
          aria-describedby="chatHelp"
          placeholder="????????? ??????"
          defaultValue={chatTitle}
          onChange={onRoomTitleHandler}
        ></RoomTitleInputBox>
        <AddRoomBtn active={isBlock} onClick={addChatRoomBtnClick}>
          ????????? ????????????
        </AddRoomBtn>
      </AddRoom>
      <ChatInputs>
        <ChatInputBox
          type="email"
          name="email"
          className="form-control"
          id="chat-content"
          aria-describedby="emailHelp"
          placeholder="????????? ?????? ??????"
          defaultValue={searchValue}
          onChange={onSearchHandler}
        />
        <SendBtn
          type="button"
          className="btn btn-warning"
          onClick={searchClick}
        >
          ??????
        </SendBtn>
      </ChatInputs>
      <LogoutBox>
        <LogoutBtn
          type="button"
          className="btn btn"
          onClick={onLogoutClickHandler}
        >
          ????????????
        </LogoutBtn>
      </LogoutBox>

      <HrCss />
      <ChatRoomsContainer>
        <ChatRooms>
          {rooms.length === 0 ? (
            <NoRooms>?????? ????????? ???????????? ????????????.</NoRooms>
          ) : (
            <Room rooms={rooms} />
          )}
        </ChatRooms>
      </ChatRoomsContainer>
    </RoomsCss>
  );
};
export default Rooms;
