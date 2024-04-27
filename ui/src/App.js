
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StarsBackground from "./components/Star";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full h-screen">
        <StarsBackground style={{ zIndex: 0, position: "absolute" }} />
        <Navbar style={{ zIndex: 1, position: "absolute" }} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/" element={<Home style={{ zIndex: 2, position: "absolute" }} />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
