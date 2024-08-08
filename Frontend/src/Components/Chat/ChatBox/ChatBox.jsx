import React, { useState, useEffect } from "react";
import { IonIcon } from '@ionic/react';
import { NavLink, useParams } from "react-router-dom";
import { getCurrentUser, sendDirectMessage, directChatHistory, deleteMessage, updateSeen, updateMessage } from "../../../realTimeCommunication/socketConnection";
import { useSelector, useDispatch } from "react-redux";
import { chevronBackOutline, send, trashOutline, createOutline } from "ionicons/icons";
import ChatMessage from "./ChatMessage/ChatMessage";
import { groupedMessageDate } from "./helper/formatMessageDate";


const ChatBox = () => {
    const { currentUserName } = useParams();
    const currentChat = useSelector((state) => state.chat.currentChat);
    const messages = useSelector((state) => state.message.messages);

    const [loading, setLoading] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isSelected, setIsSelected] = useState(false);
    const [editMessageID, setEditMessageID] = useState(null);
    const [editMessageText, setEditMessageText] = useState("");
    const [newMessage, setNewMessage] = useState({
        text: "",
        imageUrl: "",
        videoUrl: ""
    });

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setLoading(true);
            await getCurrentUser(currentUserName);
            setSelectedMessages([]);
            setIsSelected(false);
            setEditMessageID(null);
            setEditMessageText("");
            setLoading(false);
        };
        fetchCurrentUser();
    }, [currentUserName]);

    useEffect(() => {
        if (currentChat?.currentUserID) {
            console.log("message", messages)
            directChatHistory(currentChat?.currentUserID);

            const intervalId = setInterval(() => {
                updateSeen(currentChat?.currentUserID);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [currentChat?.currentUserID, currentUserName]);

    const handleOnChange = (e) => {
        const { value } = e.target;
        setNewMessage((prev) => ({
            ...prev,
            text: value
        }));
    };

    const handleKeyPressed = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(e);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.text || newMessage.imageUrl || newMessage.videoUrl) {
            const messageData = {
                receiver: currentChat?.currentUserID,
                text: newMessage.text,
                imageUrl: newMessage.imageUrl,
                videoUrl: newMessage.videoUrl,
                createdAt: new Date().toISOString(),
                msgByUserId: localStorage.getItem("userId")
            };
            console.log("MessageData", messageData);

            sendDirectMessage({
                receiver: currentChat?.currentUserID,
                text: newMessage?.text,
                imageUrl: newMessage?.imageUrl,
                videoUrl: newMessage?.videoUrl,
            });
            setNewMessage({
                text: "",
                imageUrl: "",
                videoUrl: ""
            });
        }
    };

    const handleMessageSelection = (messageID) => {
        setSelectedMessages((prevSelectedMessages) => {
            const isSelected = prevSelectedMessages.includes(messageID);
            if (isSelected) {
                return prevSelectedMessages.filter(id => id !== messageID);
            } else {
                return [...prevSelectedMessages, messageID];
            }
        });
    };

    const handleEditMessage = (messageID, text) => {
        setEditMessageID(messageID);
        setEditMessageText(text);
    };

    const handleUpdateEditedMessage = async (messageID) => {
        // Implement your logic to update the edited message here
        // Example:
        await updateMessage({ messageID, text: editMessageText, receiverID: currentChat?.currentUserID });
        setEditMessageID(null);
        setEditMessageText("");
        setSelectedMessages("");

    };

    const handleDeleteMessage = () => {
        handleConfirmation();
    };

    const handleConfirmation = async () => {
        const data = {
            selectedMessages: selectedMessages,
            currentChat: currentChat?.currentUserID
        };
        await deleteMessage(data);
        setSelectedMessages([]);
    };

    return (
        <>
            {!loading && currentChat ?
                (
                    <div className="flex flex-col bg-white">
                        {/* Chat header */}
                        <header className="bg-gray-800 h-[8vh] md:h-[8vh] p-2 text-white">
                            {selectedMessages.length > 0 ?
                                (
                                    <div className="flex flex-row justify-between font-sans items-center font-normal">
                                        <div className="pl-2">{`${selectedMessages.length} Selected`}</div>
                                        <div className="flex flex-row justify-end gap-1 items-center">
                                            <div className="px-2 md:py-2 text-white font-normal rounded-sm duration-500 cursor-pointer hover:scale-110 relative"
                                                onClick={handleDeleteMessage}
                                            >
                                                <IonIcon className="font-normal text-2xl" icon={trashOutline} />
                                            </div>
                                            {selectedMessages.length === 1 &&
                                                <div className="px-2 md:py-2 text-white font-normal rounded-sm duration-500 cursor-pointer hover:scale-110 relative"
                                                    onClick={() => setIsSelected(!isSelected)}
                                                >
                                                    <IonIcon className="font-normal text-2xl" icon={createOutline} />
                                                </div>
                                            }
                                            <button className="bg-gray-500 hover:bg-gray-600 text-sm px-2 py-1 md:px-3 md:py-2 rounded duration-500"
                                                onClick={() => {
                                                    setSelectedMessages([]);
                                                    setIsSelected(false);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) :
                                (
                                    <div className="flex items-center gap-1 md:gap-3">
                                        <NavLink to={"/"}>
                                            <span className='text-xl flex items-center cursor-pointer duration-500 hover:scale-125'>
                                                <IonIcon icon={chevronBackOutline} />
                                            </span>
                                        </NavLink>
                                        <div className='relative'>
                                            <div className='w-8 h-8 lg:w-12 lg:h-12 rounded-full'>
                                                <img
                                                    src={currentChat?.profileImage ? currentChat?.profileImage : ""}
                                                    alt="Profile"
                                                    className="followerImage w-full h-full rounded-full"
                                                />
                                            </div>
                                            {currentChat?.online && (
                                                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white' />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-start">
                                            <span className="text-sm md:text-xl">{currentChat?.fullName}</span>
                                            {currentChat?.online && <span className="text-sm text-left -my-2">Online</span>}
                                        </div>
                                    </div>
                                )
                            }
                        </header>

                        {/* Chat body */}
                        <main className="h-[calc(100vh-15vh)] px-4 py-1 pb-2 overflow-x-hidden overflow-y-scroll">
                            {messages && Object.entries(messages)?.map(([date, messageArray]) => (
                                <div key={date}>
                                    <span className="px-2 py-1 text-xs text-white font-sans bg-gray-600 rounded">{groupedMessageDate(date)}</span>
                                    {Array.isArray(messageArray) && messageArray.map((message) => (
                                        <div key={message._id} className="my-1">
                                            {isSelected && editMessageID === message._id ? (
                                                <div className="flex flex-row items-center gap-2">
                                                    <textarea
                                                        className="w-full p-1 border rounded bg-slate-200 text-sm outline-1 outline-gray-800"
                                                        type="text"
                                                        value={editMessageText}
                                                        onChange={(e) => setEditMessageText(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && handleUpdateEditedMessage(message._id)}
                                                    />
                                                    <button className="bg-gray-800 text-sm text-white p-1 px-2 rounded-md flex items-center" onClick={() => handleUpdateEditedMessage(message._id)}>Save</button>
                                                </div>
                                            ) : (
                                                <ChatMessage
                                                    key={message._id}
                                                    message={message}
                                                    currentChat={currentChat}
                                                    isSelected={selectedMessages.includes(message._id)}
                                                    onDeleteMessage={handleMessageSelection}
                                                    onEditMessage={handleEditMessage}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {messages.length === 0 && <div className="mt-[40vh]"><p className=" text-gray-700 font-semibold "> No conversation <br/>Send and Receive messages.</p> </div>}
                        </main>

                        {/* Message input */}
                        <form onSubmit={handleSendMessage} className="flex items-center bg-slate-200 gap-2 min-h-[7vh] w-full">
                            <input
                                className="font-serif p-3 outline-none w-full h-full bg-slate-200 rounded-md"
                                type="text"
                                placeholder="Type your message..."
                                spellCheck="true"
                                lang="en"
                                value={newMessage.text}
                                onChange={handleOnChange}
                                onKeyDown={handleKeyPressed}
                            />
                            <button type='submit' className='flex items-center text-gray-800 hover:text-gray-900 text-2xl px-3'>
                                <IonIcon icon={send} />
                            </button>
                        </form>
                    </div>
                ) :
                (
                    <p>Loading ...</p>
                )}
        </>
    );
}

export default ChatBox;
