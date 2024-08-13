"use client";
import { useAppStore } from "@/store";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import Contects_Container from "./(chatComponents)/contects-container/page";
import Chat_Container from "./(chatComponents)/chat-container/page";
import Empty_chat_Container from "./(chatComponents)/empty-chat-container/page";

const Chats = () => {
  const { userInfo, selectedChatData } = useAppStore();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please setup your profile first.");
      redirect("/profile");
    }
  }, [userInfo]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden ">
      <Contects_Container />
      {selectedChatData ? <Chat_Container /> : <Empty_chat_Container />}
    </div>
  );
};

export default Chats;
