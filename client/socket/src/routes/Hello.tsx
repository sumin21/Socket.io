import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from "socket.io-client";
import styled from "styled-components";

const RoomsScroll = styled.div`
  max-height: 450px;
  overflow-y: auto;
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

type Rooms = {
  id: number;
  lastChatTime: string;
  location: string;
  maxNumber: number;
  title: string;
  memberLength: number;
};

const Hello = (props: any) => {
  //   const { search } = props.location;
  //   console.log(search);

  return <div>hello</div>;
};

export default Hello;
