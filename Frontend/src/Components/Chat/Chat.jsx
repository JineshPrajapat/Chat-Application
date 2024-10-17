import React, { useEffect, useState } from "react";
import { connectWithSocketServer } from "../../realTimeCommunication/socketConnection";
import { useSelector } from 'react-redux';
import Conversation from "./Conversation/Conversation";
import { NavLink, useLocation, Routes, Route } from "react-router-dom";
import ChatBox from "./ChatBox/ChatBox";
import LogOutButton from "../LogOutButton/LogOutButton";
import { formatMessageDate } from "./ChatBox/helper/formatMessageDate";

const Chat = () => {
    const conversationData = useSelector((state) => state.chat.conversation);
    // console.log("conversationData", conversationData);
    const userData = useSelector((state) => state.chat.allUser);
    // console.log("userData", userData);

    const [showChats, setShowChats] = useState(true);
    const [searchName, setSearchName] = useState("");
    const [filteredConversation, setFilteredConversation] = useState([]);
    const [filteredchats, setFilteredchats] = useState([]);

    const location = useLocation();
    const isChatBox = location.pathname !== "/";
    let currentUserName = location.pathname.split("/")[1];
    const profileImage = localStorage.getItem("profileImage");

    useEffect(() => {
        connectWithSocketServer();
    }, []);

    const handleSearchInputChange = (event) => {
        setSearchName(event.target.value);
        filterConversation(event.target.value);
    }

    const filterConversation = (query) => {
        if (query.trim() === "") {
            setFilteredConversation([]);
            setFilteredchats([]);
        }
        else {
            if (showChats) {
                const filtered = conversationData.filter(conv =>
                    conv?.opponent?.fullName.toLowerCase().includes(query.toLowerCase()) || conv?.opponent?.email.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredConversation(filtered);
            }
            else {
                let chatfiltered = userData?.filter(user =>
                    user?.fullName.toLowerCase().includes(query.toLowerCase()) || user.email.includes(query.toLowerCase()) || user.username.includes(query.toLowerCase())
                );
                setFilteredchats(chatfiltered);
                // console.log("filteredchats", chatfiltered);
            }
        }

    }

    const conversation = searchName.trim() === "" ? conversationData : filteredConversation;
    const Users = searchName.trim() === "" ? userData : filteredchats;


    return (
        <div className="Chat h-[100vh] flex ">
            {/* Add sidebar content here */}
            <aside className={`md:w-1/4 md:min-w-96 w-full h-full bg-gray-800 text-white p-2 md:p-4 border-r-[1px] border-r-white ${isChatBox ? "hidden md:block" : "block"}`}>
                <div className=" ">
                    <div className="flex justify-between mb-4 py-1">
                        <div className="flex flex-row items-center">
                            <div className=" flex items-center text-2xl text-white w-8 h-8 rounded-full">
                                <img className="w-full h-full rounded-full" src={profileImage} alt="userImage" />
                            </div>
                            <p className="text-xl pl-2">{`${localStorage.getItem("fullName")}`}</p>
                        </div>
                        <LogOutButton />
                    </div>
                    <input type="search" className="w-full  px-3 h-[5vh] text-black outline-none focus:border-b-2 focus:border-red-500"
                        placeholder="seacrh by username, email"
                        value={searchName}
                        onChange={handleSearchInputChange} />

                    <div className="flex justify-start gap-2 px-2 my-3">
                        <div
                            className={`cursor-pointer label rounded-xl p-2 text-xs font-bold duration-500 ${showChats ? 'bg-[#028391]' : 'bg-slate-600'}`}
                            onClick={() => setShowChats(true)}
                        >
                            Chats
                        </div>
                        <div
                            className={`cursor-pointer label rounded-xl p-2 text-xs font-bold duration-500 ${!showChats ? 'bg-[#028391]' : 'bg-slate-600'}`}
                            onClick={() => setShowChats(false)}
                        >
                            Discover Users
                        </div>
                    </div>

                    <ul className=" h-[calc(100vh-24vh)] md:h-[calc(100vh-22vh)] overflow-x-hidden overflow-y-scroll scrollbar">
                        {showChats ? (
                            <>
                                {conversation?.length === 0 ? (
                                    <div className="mt-12">
                                        <div className="flex justify-center items-center my-4 text-white">
                                            {/* <i class="fa-solid fa-magnifying-glass"></i> */}
                                        </div>
                                        <p className='text-lg text-center text-slate-400'>Explore users to start a conversation with.</p>
                                    </div>
                                ) : (
                                    conversation.map((conv, index) => {
                                        return (
                                            <NavLink to={`/${conv?.opponent?.username}`} key={conv?._id} >
                                                <div className={`p-2 duration-500 hover:bg-[#b1b0b02b] cursor-pointer ${currentUserName === conv?.opponent?.username && "bg-gray-900"} `}>
                                                    <div className='flex items-center gap-3 w-full relative '>
                                                        <div className='relative'>
                                                            <div className='w-12 h-12 rounded-full'>
                                                                <img
                                                                    src={conv?.opponent?.profileImage}
                                                                    alt="Profile"
                                                                    className="followerImage w-full h-full rounded-full"
                                                                />
                                                            </div>
                                                            {conv?.online && (
                                                                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                                                            )}
                                                        </div>
                                                        <div className="name text-left w-full">
                                                            <div className='flex justify-between items-center'>
                                                                <span className='text-sm md:text-[16px] whitespace-nowrap text-ellipsis line-clamp-1'>{conv?.opponent.fullName}</span>
                                                                <time className=' whitespace-nowrap text-[9px]'>{formatMessageDate((conv?.lastMsg?.createdAt))}</time>
                                                            </div>
                                                            <p className='text-xs text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                                        </div>
                                                        {
                                                            Boolean(conv?.unseenMsg) && (
                                                                <p className='text-[8px] w-4 h-4 flex justify-center items-center ml-auto p-1 bg-green-500 text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </NavLink>
                                        )
                                    })
                                )}
                            </>
                        ) :
                            (
                                <>
                                    {Users && Users?.map((user, id) => {
                                        return (
                                            <Conversation userId={user._id} username={user.username} fullName={user.fullName} email={user.email} online={user.online} profileImage={user.profileImage} />
                                        )
                                    })}
                                </>
                            )}
                    </ul>

                </div>
            </aside>

            {/* Main Chat Content */}
            <main className={`md:w-3/4 w-full h-full bg-gray-100 ${isChatBox ? " " : "hidden md:flex md:justify-center"}`}>
                {isChatBox ? (
                    <Routes>
                        <Route path=":currentUserName" element={<ChatBox />} />
                    </Routes>
                ) : (
                    <span className={`chatbox-empty-message flex flex-col justify-center items-center `}>
                        <div className="text-xl text-white w-40 h-40">
                            <img src="../../../../chatLogo.svg"  alt="logo"/>
                        </div>
                        <ul className="flex flex-col justify-start text-left gap-2 list-disc mt-4">
                            <li>Real-time peer-to-peer communication</li>
                            <li>Update and delete shared messages</li>
                            <li>View chat history with precise timestamps</li>
                            <li>Track whether messages have been seen or unseen</li>
                            <li>Search conversations and find new users</li>
                            <li>Green dot on profile indicates the user is online</li>
                            <li>Display timestamps for when messages are delivered and seen</li>
                            <li>Highlight unseen messages with a count of unread messages</li>
                        </ul>


                        <p className='text-lg mt-4 text-gray-600'>Select user to start message.</p>
                    </span>
                )}
            </main>
        </div>
    )
};

export default Chat;