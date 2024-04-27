import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import { useSocket } from "../socket/SocketContext"; // Import the useSocket hook

export default function Logout() {
  const navigate = useNavigate();
  const socket = useSocket(); // Use the useSocket hook to get the socket instance

  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    
    // Disconnect the socket before logging out
    if (socket) {
      socket.emit("disconnectMain",id)
      socket.disconnect();
    }

    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
