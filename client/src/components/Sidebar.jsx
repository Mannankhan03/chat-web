import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/chatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    SetselectedUser,
    unseenmessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");

  const filteredUsers = searchInput.trim()
    ? users.filter((user) =>
        (user?.fullname || "").toLowerCase().includes(searchInput.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[#282142]/30 h-full max-h-screen overflow-y-auto p-5 rounded-r-xl text-white transition-all duration-300 ${
        selectedUser ? "w-[300px] max-md:hidden" : "w-[505px]"
      }`}
    >
      {/* Header with Logo and Menu */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo_big1} alt="logo-icon" className="max-w-10 mix-blend-normal mix-blend-multiply object-contain" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 object-contain cursor-pointer"
            />
            <div className="absolute top-[30px] right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray text-white hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4">
        <img src={assets.search_icon} alt="search-icon" className="w-3 object-contain"  />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          placeholder="Search User..."
        />
      </div>

      {/* User List */}
      <div className="flex flex-col ">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={index}
              onClick={() => {
                SetselectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className={`relative flex items-center gap-3 p-2 pl-4 rounded max-sm:text-sm cursor-pointer ${
                selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="user"
                className="rounded-full w-[35px] object-contain aspect-[1/1]"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullname}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
              {unseenmessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/100">
                  {unseenmessages[user._id]}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
