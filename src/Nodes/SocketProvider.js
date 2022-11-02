import React, { createContext } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
socket.on("connect", () => console.log("connected to socket"));

export default socket;
