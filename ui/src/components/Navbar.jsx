import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import { useSocket } from "../socket/SocketContext";
const Navbar = () => {
  const socket = useSocket();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const navigate = useNavigate();
  const storedUserq = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
  useEffect(() => {
    const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (storedUser) {
      const data = JSON.parse(storedUser);
      if (data.username && data.avatarImage) {
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      }
    }
  }, [storedUserq]);

  const handleLogout = async() => {

    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      socket.emit("disconnectMian",id)
      console.log("logout successful");
      localStorage.clear();
      navigate("/login");
    localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
    setCurrentUserName(undefined);
    setCurrentUserImage(undefined);
    }

  
  };

  return (
    <>
      <nav className="fixed top-0 left-0 bg-opacity-20 backdrop-filter backdrop-blur-lg py-4 px-6 flex items-center justify-between w-full">
        <Link to="/" className="text-white text-2xl font-bold">
          Home
        </Link>
        <div className="flex items-center space-x-4">
          {currentUserName ? (
            <div className="flex items-center space-x-2 text-white font-bold">
              {currentUserImage && (
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-white  px-4 py-2 rounded font-bold hover:underline" >{currentUserName}</span>
              <button
                onClick={handleLogout}
                className="text-black bg-white px-4 py-2 rounded font-bold hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white font-bold hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-4 py-2 rounded font-bold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
