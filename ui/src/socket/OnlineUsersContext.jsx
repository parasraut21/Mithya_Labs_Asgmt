// OnlineUsersContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children }) => {
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    if (!socket) return;

    socket.on("userOnline", (data) => {
      // console.log("User online:", data);
      setOnlineUsers((prevOnlineUsers) => {
        const newOnlineUsers = new Map(prevOnlineUsers);
        newOnlineUsers.set(data.userId, true);
        return newOnlineUsers;
      });
    });

    socket.on("userOffline", (data) => {
      // console.log("User offline:", data);
      setOnlineUsers((prevOnlineUsers) => {
        const newOnlineUsers = new Map(prevOnlineUsers);
        newOnlineUsers.set(data.userId, false);
        return newOnlineUsers;
      });
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [socket]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => {
  return useContext(OnlineUsersContext);
};
