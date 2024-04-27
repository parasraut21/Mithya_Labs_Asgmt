import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { Dialog, Transition } from '@headlessui/react';


export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateGroup = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  useEffect(async () => {
    
    let ob1 = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    const userObject = JSON.parse(ob1);
    const username = userObject.username;
     console.log("***********",username);

    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  console.log("current chat", contacts);
  const [group, setGroup] = useState([]);

const handleAddToGroup = (event) => {
  const contactId = event.target.value;
  if (event.target.checked) {
    setGroup(prevGroup => [...prevGroup, contactId]);
  } else {
    setGroup(prevGroup => prevGroup.filter(id => id !== contactId));
  }
};

const handlesubmit = () => {
  console.log("group", group);
  closeModal();
  setGroup([]);
}
  return (
    <>
    <Container>
      <div className="container mt-[6rem] relative">
        <Contacts contacts={contacts} changeChat={handleChatChange} socket={socket}  />
        <button onClick={handleCreateGroup} className=" mt-[-2rem] px-2 py-1 text-sm bg-blue-500 text-white rounded absolute top-0 left-0">Create Group</button>
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} contacts={contacts}/>
        )}
      </div>
      </Container>
        {isModalOpen && (
          <div className="fixed z-10 inset-0  overflow-y-auto">
            <div className="flex items-end justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Create Group
                      </h3>
                      <div className="mt-2">
  <p className="text-sm text-gray-500">
    Select a contact to add to the group:
  </p>
  <ul>
    {contacts.map((contact, index) => (
      <li key={index}>
        <input type="checkbox" id={`contact-${index}`} name={contact.name} value={contact._id} onChange={handleAddToGroup} />
        <label htmlFor={`contact-${index}`}>{contact.username}</label>
      </li>
    ))}
  </ul>
</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handlesubmit}>
           
                   Create
          
                   
                  </button>
                  <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
