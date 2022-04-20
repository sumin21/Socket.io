import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

import { Prompt, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Axios from "axios";

import { io } from "socket.io-client";
import styled from "styled-components";

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

const ChatMembers = styled.div`
  background-color: #ebc6c7;
  border-radius: 10px;
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  flex-basis: 100px; //item너비
  padding-top: 5px;
`;

const ChatMember = styled.div`
  display: flex;
  margin-right: 10px;
  background-color: #e6b2b4;
  margin-bottom: 5px;
  border-radius: 10px;
  padding: 3px 5px;
`;

const ChatMemberInfor = styled.div`
  color: grey;
  font-size: 9px;
  margin-left: 5px;
  margin-top: 3px;
`;

const ChatMemberName = styled.div`
  /* color: grey; */
  font-size: 15px;
  color: #664141;
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

type Membertype = {
  name?: string;
  location?: string;
  sex?: string;
  age?: number;
};

const Home = (props: any) => {
  const history = useHistory();

  const [axiosUserName, setAxiosUserName] = useState("");
  const [axiosRoomId, setAxiosRoomId] = useState(0);
  const [axiosUserLocation, setAxiosUserLocation] = useState("");
  const [axiosUserSex, setAxiosUserSex] = useState("");
  const [axiosUserAge, setAxiosUserAge] = useState(0);

  const [content, setContent] = useState("");
  const [codes, setCodes] = useState("");

  const [codes2, setCodes2] = useState("1");
  const [bol, setbol] = useState(true);
  const [codeClassName2, setcodeClassName2] = useState("");
  const [message2, setMessage2] = useState("");
  const [chatTime2, setChatTime2] = useState("");
  const [chatUser2, setChatUser2] = useState("");

  const [bolMember, setbolMember] = useState(true);
  const [chatMembers2, setChatMembers2]: [
    chatMembers2: Array<Membertype>,
    setChatMembers2: (x: any) => void
  ] = useState([]);

  const [chatMembers, setChatMembers]: [
    chatMembers: Array<Membertype>,
    setChatMembers: (x: any) => void
  ] = useState([]);

  const codesHandler = (
    codeClassName: string,
    message: string,
    user?: string,
    time?: any
  ) => {
    console.log("codesss");
    console.log(codes); //
    let newCode = codes + `<div class=${codeClassName}>${message}</div>`;
    if (user) {
      setChatUser2(user);
    }
    if (time) {
      time = time.slice(0, 16).replace("T", " ");
      newCode = `<div class="chatTime">${time}</div>` + newCode;
      setChatTime2(time);
    }
    setcodeClassName2(codeClassName);
    setMessage2(message);
    setbol(true);
    setCodes2(newCode);
    console.log(newCode);
    setCodes(newCode);
    console.log(codes);
  };

  const memberHandler = (member: Array<Membertype>) => {
    setChatMembers(member);
    // console.log(chatMembers);
    setbolMember(true);
    setChatMembers2(member);
  };

  // 빈배열 넣음으로 -> 새로고침 시에만 재적용
  useEffect(() => {
    console.log("room 접속!!!");

    // userName 가져오기
    Axios.get("/api/users/auth") //
      .then(function (response) {
        // chatroomid
        // setUserName(response.data.name);
        const userName: string = response.data.name;
        const userLocation: string = response.data.location;
        const userSex: string = response.data.sex;
        const userAge: number = response.data.age;

        console.log(userName);
        setAxiosUserName(userName);
        setAxiosUserLocation(userLocation);
        setAxiosUserSex(userSex);
        setAxiosUserAge(userAge);

        //roomId 가져오기
        Axios.get(`/api/sockets/getroomid`)
          .then((response) => {
            if (response.data.success) {
              const roomId: number = response.data.roomId;
              console.log(roomId);
              setAxiosRoomId(roomId);

              //새로고침 -> 새로 연결 (이슈)
              socket = io("ws://localhost:5000/", {});

              //connect
              socket.on("connect", () => {
                console.log(`connect ${socket.id}`);
              });

              //join
              socket.emit(
                "joinRoom",
                roomId,
                userName,
                userLocation,
                userSex,
                userAge
              );

              //leaveRoom (roomId, userName, userLocation, userSex, userAge)
              socket.on(
                "leaveRoom",
                (
                  num: number,
                  name: string,
                  location: string,
                  sex: string,
                  age: number,
                  members: Array<Membertype>
                ) => {
                  console.log(`leaveRoom!`, num, name, location, sex, age);
                  const body = {
                    roomId: roomId,
                  };
                  //본인인 경우
                  if (name === userName) {
                    Axios.post(`/api/sockets/leaveroom`, body)
                      .then((response) => {
                        if (response.data.success) {
                          console.log(response.data.allDelete);
                          if (name === userName) {
                            history.push("/");
                          }
                        } else {
                          alert("방 나가기에 실패했습니다.");
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                        return;
                      });
                  }
                  //타인인 경우
                  else {
                    console.log("tq", members);
                    memberHandler(members);
                    // console.log("kk", chatMembers);
                    codesHandler(
                      "joinRoom",
                      `${name}님이 채팅방을 나가셨습니다.`
                    );
                  }
                }
              );

              //joinRoom  (roomId, userName, userLocation, userSex, userAge)
              socket.on(
                "joinRoom",
                (
                  num: number,
                  name: string,
                  location: string,
                  sex: string,
                  age: number,
                  members: Array<Membertype>,
                  replay: boolean
                ) => {
                  console.log(`joinRoom!`, num, name);

                  //이전 채팅기록 가져오기
                  const body = {
                    roomId: roomId,
                  };
                  //본인인 경우
                  if (name === userName) {
                    Axios.post(`/api/sockets/showmembers`, body)
                      .then((response) => {
                        if (response.data.success) {
                          const membersArr = response.data.members;
                          console.log(membersArr);

                          for (let u = 0; u < membersArr.length; u++) {
                            const uName = membersArr[u]["name"];
                            const uLocation = membersArr[u]["location"];
                            const uSex = membersArr[u]["sex"];
                            const uAge = membersArr[u]["age"];

                            console.log(chatMembers);

                            let newMembers = chatMembers.push({
                              name: uName,
                              location: uLocation,
                              sex: uSex,
                              age: uAge,
                            });
                            setChatMembers(chatMembers);

                            console.log("kk", chatMembers);
                          }

                          Axios.post(`/api/sockets/getmsg`, body)
                            .then((response) => {
                              if (response.data.success) {
                                const msgObjs = response.data.result;
                                console.log(msgObjs);

                                for (let i = 0; i < msgObjs.length; i++) {
                                  const ownerBool = msgObjs[i]["owner"];
                                  const msg = msgObjs[i]["coment"];
                                  const msgTime = msgObjs[i]["sendTime"];
                                  const msgName = msgObjs[i]["name"];

                                  let codeClassName: string = "";
                                  if (ownerBool) {
                                    codeClassName = "senderChat";
                                  } else {
                                    codeClassName = "receiverChat";
                                  }
                                  codesHandler(
                                    codeClassName,
                                    msg,
                                    msgName,
                                    msgTime
                                  );
                                }
                                codesHandler(
                                  "joinRoom",
                                  `${name}님이 채팅방에 입장하셨습니다.`
                                );
                              }
                            })
                            .catch(function (error) {
                              console.log(error);
                              return;
                            });
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                        return;
                      });
                  } else {
                    console.log("tq", members);
                    console.log("다른 사람 입장");

                    if (!replay) {
                      memberHandler(members);
                      console.log("kk", chatMembers);
                      codesHandler(
                        "joinRoom",
                        `${name}님이 채팅방에 입장하셨습니다.`
                      );
                    }
                  }
                }
              );

              //send message
              socket.on(
                "send message",
                (
                  name: string,
                  msg: { content: string; sender: string; time: any }
                ) => {
                  console.log(`send message!`, name, msg);
                  let messages = {
                    message: msg.content,
                    sender: msg.sender,
                    time: msg.time,
                  };
                  let codeClassName: string = "";
                  if (messages.sender === socket.id) {
                    codeClassName = "senderChat";
                  } else {
                    codeClassName = "receiverChat";
                  }
                  codesHandler(
                    codeClassName,
                    messages.message,
                    name,
                    messages.time
                  );
                  setContent("");
                }
              );
            } else {
              alert("해당 room에 참여할 수 없습니다.");
            }
          })
          .catch(function (error) {
            console.log(error);
            return;
          });
      })
      .catch(function (error) {
        console.log(error);
        return;
      });
  }, []);

  useEffect(() => {
    if (bol) {
      console.log(codes, "///"); //
      console.log(chatUser2, "///"); //
      let userName = chatUser2;

      let newCode = "";
      if (codeClassName2 === "senderChat") {
        newCode =
          codes +
          `<div class="rightChat"><div class="userName">${userName}</div><span class="chatTimeRight">${chatTime2}</span><span class=${codeClassName2}>${message2}</span></div>`;
      } else if (codeClassName2 === "receiverChat") {
        newCode =
          codes +
          `<div class="leftChat"><div class="userName">${userName}</div><span class=${codeClassName2}>${message2}</span><span class="chatTimeLeft">${chatTime2}</span></div>`;
      } else {
        newCode = codes + `<div class=${codeClassName2}>${message2}</div>`;
      }
      setCodes(newCode);
      // setCodes2(newCode);
    }
    return () => {
      setbol(false);
      setCodes2("");
    };
  }, [codes2]);

  useEffect(() => {
    console.log("zzz");
    if (bolMember) {
      console.log(chatMembers2, "///"); //
      setChatMembers(chatMembers2);
      console.log(chatMembers, "///2"); //
      // setCodes2(newCode);
    }
    return () => {
      setbolMember(false);
      // setChatMembers2([]);
    };
  }, [chatMembers2]);

  // const [chatStartTxt, setchatStartTxt] = useState("채팅 시작하기");

  const onContentHandler = (event: any) => {
    setContent(event.currentTarget.value);
  };

  const endClickHandler: any = () => {
    console.log("그만");
    // console.log(roomId);
    socket.emit(
      "leaveRoom",
      axiosRoomId,
      axiosUserName,
      axiosUserLocation,
      axiosUserSex,
      axiosUserAge
    );

    // setCodes("");
  };

  //채팅 전송
  const handleClick: any = (num: number) => {
    const offset = new Date().getTimezoneOffset() * 60000;

    const today = new Date(Date.now() - offset);
    const time = today.toISOString().slice(0, 19).replace("T", " ");
    console.log(time);
    let message = {
      content,
      sender: socket.id,
      time,
    };
    console.log(message);

    if (message.content != "") {
      console.log("msg 전달");
      socket.emit("message", axiosRoomId, axiosUserName, message);

      const body = {
        roomId: axiosRoomId,
        msg: message.content,
        time: message.time,
      };
      Axios.post(`/api/sockets/sendmsg`, body)
        .then((response) => {
          if (!response.data.success) {
            alert(response.data.error);
          }
        })
        .catch(function (error) {
          console.log(error);
          return;
        });

      setContent("");
    }
  };

  return (
    <div>
      <Prompt
        message={(location, action) => {
          if (action === "POP") {
            console.log("Backing up...");
            console.log("나감");
            endClickHandler();
          }

          return true;
        }}
      />
      <ChatStart onClick={endClickHandler}>채팅 그만하기</ChatStart>
      <ChatInputs>
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

      <HrCss />
      <ChatMembers>
        {chatMembers.length &&
          chatMembers.map((member: Membertype) => (
            <ChatMember key={member["name"] + "member"}>
              <ChatMemberName key={member["name"] + "memberName"}>
                {member["name"]}
              </ChatMemberName>
              <ChatMemberInfor key={member["name"] + "memberInfor"}>
                {member["location"]}/{member["sex"]}/{member["age"]}
              </ChatMemberInfor>
            </ChatMember>
          ))}
      </ChatMembers>
      <Chat>
        <div
          className="chats"
          dangerouslySetInnerHTML={{ __html: codes }}
        ></div>
      </Chat>
    </div>
  );
};
export default Home;
