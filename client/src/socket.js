import { io } from "socket.io-client";

const userId =
  sessionStorage.getItem("userId");

export const socket = io(
  import.meta.env.VITE_SERVER_URL,
  {
    query: {
      userId,
    },
  }
);