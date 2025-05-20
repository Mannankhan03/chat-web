import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Chatcontainer = () => {
  const { messages, selectedUser, SetselectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authuser, onlineUsers } = useContext(AuthContext);

  const [input, Setinput] = useState("");


const handleSendMessage = async (e) => {
  e.preventDefault();
  if (input.trim() === "") return;

  const message = {
    text: input.trim(),
  };

  await sendMessage(message);
  Setinput("");
};
const handleSendImage = async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    toast.error("Please select a valid image file.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const imageMessage = { image: reader.result };
    await sendMessage(imageMessage);
    e.target.value = "";
  };

  reader.readAsDataURL(file);
};

  const scrollEnd = useRef();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full w-[600px] overflow-scroll p-5 relative backdrop-blur-lg ">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-900">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile-pic"
          className="w-8 rounded-full object-contain"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullname}
          {onlineUsers.includes(selectedUser._id) ? (
            <span className="text-green-400 text-sm">(Online)</span>
          ) : (
            <span className="text-gray-400 text-sm">(Offline)</span>
          )}
        </p>
        <img
          onClick={() => SetselectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className=" max-w-7 object-contain"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5 object-contain" />
      </div>

      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authuser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lgobject-contain overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`max-w-[200px] p-2 md:text-sm font-light rounded-lg mb-8 break-all bg-orange-500/30 text-black ${
                  msg.senderId === authuser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authuser._id
                    ? authuser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.profile_martin
                }
                alt=""
                className="rounded-full w-7 object-contain"
              />
              <p className="text-gray-500 ">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-900/62 px-3 rounded-full">
          <input
            onChange={(e) => Setinput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message..."
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-white"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer object-contain"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7  cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_big1} className="max-w-50 object-contain" alt="" />
      <p className="text-lg font-medium text-black">chat anytime, Anywhere</p>
    </div>
  );
};

export default Chatcontainer;
