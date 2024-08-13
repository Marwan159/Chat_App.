import { useAppStore } from "@/store";
import { HOST } from "@/utils/constenst";
import { useEffect, useContext, createContext, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { userInfo, addContactsInDmContacts } = useAppStore();
  const socket = useRef();
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("connected with socket server");
      });
      const handleRecievedMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        }
        // addContactsInDmContacts(message);
      };

      const handelRecievedChannelMessage = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
        // addChannelInChannelList(message);
      };

      socket.current.on("recieveMessage", handleRecievedMessage);
      socket.current.on("recive-channel-message", handelRecievedChannelMessage);
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
