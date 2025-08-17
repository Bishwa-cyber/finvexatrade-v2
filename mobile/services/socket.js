import { io } from "socket.io-client";

// Replace with your machine's local IP and backend port
export const socket = io("http://192.168.40.6:5001", {
  transports: ["websocket"],
});

