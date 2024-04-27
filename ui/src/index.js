import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { SocketProvider } from "./socket/SocketContext";
import { OnlineUsersProvider } from "./socket/OnlineUsersContext";
ReactDOM.render(
  <React.StrictMode>
     <SocketProvider>
    <OnlineUsersProvider>
   
    <App />
  
    </OnlineUsersProvider>
    </SocketProvider>,
  </React.StrictMode>,
  document.getElementById("root")
);
