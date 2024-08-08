import React from "react";
import { NavLink, useLocation } from 'react-router-dom';

const Conversation = (user) => {
    const location = useLocation();
    let currentUserName = location.pathname.split("/")[1];

    return (
        <li key={user._id} className="">
            <NavLink to={`/${user?.username}`}>
                <div className={`p-2 cursor-pointer duration-500 hover:bg-gray-700 ${currentUserName === user.username && "bg-gray-900"}`}>
                    <div className="flex items-center gap-3 w-full">
                        <div className="relative ">
                            <div className="w-12 h-12">
                                <img
                                    src={user?.profileImage}
                                    alt={user?.username}
                                    className="w-full h-full rounded-full"
                                />
                            </div>
                            {user?.online && (
                                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                            )}
                        </div>
                        <div className="text-left w-full">
                            <div className="text-sm md:text-[16px] font-normal whitespace-nowrap">{user?.fullName}</div>
                            <p className="text-xs text-ellipsis line-clamp-1">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </NavLink>
        </li>
    )
};

export default Conversation;