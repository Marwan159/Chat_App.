import React from "react";
import Chat_Header from "./components/chat-header/page";
import Message_Bar from "./components/massage-bar/page";
import Message_Container from "./components/message-container/page";

const Chat_Container = () => {
  return (
    <div className="fixed h-[100vh] w-[100vw] bg-[#1c1d25] top-0 flex flex-col md:static md:flex-1">
      <Chat_Header />
      <Message_Container />
      <Message_Bar />
    </div>
  );
};

export default Chat_Container;
