import { IonIcon } from "@ionic/react";
import moment from "moment";
import React from "react";
import { checkmarkDoneOutline } from 'ionicons/icons';

const ChatMessage = ({message, currentChat, isSelected, onDeleteMessage, onEditMessage }) => {
    // console.log("chatmesssage", message);

    const handleDelete = () => {
        if (message?.msgByUserId !== currentChat.currentUserID) {
            onDeleteMessage(message._id);
        }
    };

    const handleEditMessage = () => {
        if (message?.msgByUserId !== currentChat.currentUserID) {
            onEditMessage(message._id, message?.text)
        }
    }


    return (
        <div className={`rounded duration-500 ${message.msgByUserId === currentChat?.currentUserID ? 'flex justify-start' : "flex justify-end"} ${isSelected ? "bg-sky-100 p-[2px]" : ""}`}
            onClick={handleDelete}
        >
            <span className={`flex flex-col rounded-md px-2 py-1 my-0 ${message.msgByUserId === currentChat?.currentUserID ? "bg-slate-200" : "bg-sky-200"}`} >
                <div className="flex justify-between gap-2">
                    <p className="text-left text-sm md:text-[16px] font-serif" onClick={handleEditMessage}>{message?.text}</p>
                    <div className="text-[10px] text-slate-500 front-sans font-semibold flex flex-row items-end ">
                        {/* <p className="whitespace-nowrap" title={`${ (message.msgByUserId === currentChat?.currentUserID) ? "" : Delivered: ${moment(message.createdAt).format('DD-MM-YYYY, hh:mm A')} \nSeen: ${ message.updatedAt !== message.createdAt ? moment(message.updatedAt).format('DD-MM-YYYY, hh:mm A') : "Not seen"} } `}>{moment(message.createdAt).format('hh:mm A')}</p> */}
                        <p
                            className="whitespace-nowrap"
                            title={`${message.msgByUserId === currentChat?.currentUserID
                                ? ""
                                : `Delivered: ${moment(message.createdAt).format('DD-MM-YYYY, hh:mm A')} \nSeen: ${message.updatedAt !== message.createdAt
                                    ? moment(message.updatedAt).format('DD-MM-YYYY, hh:mm A')
                                    : "Not seen"}`
                                }`}
                        >
                            {moment(message.createdAt).format('hh:mm A')}
                        </p>
                        {message?.msgByUserId !== currentChat?.currentUserID &&
                            <div className={`text-[16px] flex flex-end ${message?.seen ? "text-blue-700" : ""}`}>
                                <IonIcon icon={checkmarkDoneOutline} />
                            </div>}
                    </div>
                </div>
            </span>
        </div>
    );
};

export default ChatMessage;
