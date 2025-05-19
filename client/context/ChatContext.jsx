import { useContext, useEffect, createContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, SetMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, SetselectedUser] = useState(null);
  const [unseenmessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // function to get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenmessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to get messages for selected user — pass userId as param
const getMessages = async (userId) => {
  if (!userId) {
    toast.error("No user selected.");
    return;
  }

  try {
    const response = await axios.get(`/api/messages/${userId}`);  // userId is selectedUser._id
    const data = response.data;

    if (data.success) {
      SetMessages(data.messages);
    } else {
      toast.error(data.message || "Failed to fetch messages");
    }
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
};
  // function to send messages
  const sendMessage = async (messageData) => {
    try {
      if (!selectedUser || !selectedUser._id) {
        toast.error("No user selected.");
        return;
      }
      const response = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      const data = response.data;

      if (data.success) {
        SetMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Send Message Error:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };

  // subscribe to incoming messages via socket
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        SetMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // unsubscribe socket listeners
  const UnsubscribefromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => UnsubscribefromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    SetMessages,
    getMessages,
    SetselectedUser,
    unseenmessages,
    setUnseenMessages,
    getUsers,
    sendMessage,
    subscribeToMessages,
    UnsubscribefromMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
