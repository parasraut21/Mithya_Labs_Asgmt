import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSocket } from "../socket/SocketContext";
import { useOnlineUsers } from "../socket/OnlineUsersContext";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  const updateOnlineUsers = (userId, isOnline) => {
    setOnlineUsers((prevOnlineUsers) => {
      const newOnlineUsers = new Map(prevOnlineUsers);
      newOnlineUsers.set(userId, isOnline);
      return newOnlineUsers;
    });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    setCurrentUserName(data?.username);
    setCurrentUserImage(data?.avatarImage);

    // Fetch initial online status for all contacts
    fetchInitialOnlineStatus();

  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const socket = useSocket();

  useEffect(() => {
    const handleUserOnline = (data) => {
      updateOnlineUsers(data.userId, true);
    };

    const handleUserOffline = (data) => {
      updateOnlineUsers(data.userId, false);
    };

    if (socket) {
      socket.on("userOnline", handleUserOnline);
      socket.on("userOffline", handleUserOffline);
    }

    return () => {
      if (socket) {
        socket.off("userOnline", handleUserOnline);
        socket.off("userOffline", handleUserOffline);
      }
    };
  }, [socket, updateOnlineUsers]);

  const fetchInitialOnlineStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/initialonlinestatus`);
      const initialOnlineStatus = await response.json();
      
      // Update online status for all contacts
      initialOnlineStatus.forEach((user) => {
        updateOnlineUsers(user._id, user.online);
      });
    } catch (error) {
      console.error("Error fetching initial online status", error);
    }
  };

  return (
    <>
    {currentUserImage && (
      <Container>
        <div className="brand">
          <h3>Made by Paras Raut</h3>
        </div>
        <div className="contacts">
          {contacts.map((contact, index) => {
            const isOnline = onlineUsers.get(contact._id);

            return (
              <div
                key={contact._id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" />
                </div>
                <div className="username">
                  <h3>
                    {contact.username}
                    {isOnline && <span className="dot"></span>}
                  </h3>
                  <span>
                    <b className={`${isOnline ? "gr" : "r"}`}>
                      {isOnline ? "Online" : "Offline"}
                    </b>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
          </div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      </Container>
    )}
  </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  // background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .username {
    .dot {
      width: 11px;
      height: 11px;
      background-color: #4CAF50; /* Green dot color */
      border-radius: 50%;
      margin-left: 5px; /* Adjust the spacing */
      display: inline-block; /* Ensure inline block display */
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .gr{
      color:green;
    }
    .r{
      color:red;
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
