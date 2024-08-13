import { apiClient } from "@/lib/api-client";
import { useSocket } from "@/src/context/socketContext";
import { useAppStore } from "@/store";
import { UPLOAD_FILE } from "@/utils/constenst";
import EmojiPicker from "emoji-picker-react";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const Message_Bar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const fileRef = useRef();
  const socket = useSocket();
  const { userInfo, selectedChatData, selectedChatType } = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  useEffect(() => {
    const hundleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", hundleClickOutside);
    return () => {
      document.removeEventListener("mousedown", hundleClickOutside);
    };
  }, [emojiRef]);
  const hundleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const hundleSendMessage = async () => {
    // console.log(userInfo);
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        recipient: selectedChatData._id,
        content: message,
        sender: userInfo.id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        content: message,
        sender: userInfo.id,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };
  const hundelAttachmentClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const hundelSendFile = async (e) => {
    try {
      if (e.target.files) {
        const file = e.target.files[0];
        if (file) {
          const formdata = new FormData();
          formdata.append("file", file);
          console.log({ file });

          const response = await apiClient.post(UPLOAD_FILE, formdata, {
            withCredentials: true,
          });
          console.log(response.data, "test send file");

          if (response) {
            if (selectedChatType === "contact") {
              socket.emit("sendMessage", {
                recipient: selectedChatData._id,
                content: undefined,
                sender: userInfo.id,
                messageType: "file",
                fileUrl: response.data.filePath,
              });
            } else if (selectedChatType === "channel") {
              socket.emit("send-channel-message", {
                channelId: selectedChatData._id,
                content: undefined,
                sender: userInfo.id,
                messageType: "file",
                fileUrl: response.data.filePath,
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="h-[10vh] flex items-center justify-center gap-6 px-8 mb-6 bg-[#1c1d25]">
      <div className="flex-1 flex items-center gap-5 pr-5 rounded-md bg-[#2a2b33]">
        <input
          type="text"
          className="flex-1 bg-transparent p-5 focus:outline-none focus:border-none"
          placeholder="Write message.."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={hundelAttachmentClick}
          className="text-neutral-500 focus:text-white focus:border-none focus:outline-none transition-all duration-300"
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          id="file"
          className="hidden"
          ref={fileRef}
          onChange={hundelSendFile}
        />
        <div className="realtive">
          <button
            className="text-neutral-500 focus:text-white focus:border-none focus:outline-none transition-all duration-300 "
            onClick={() => {
              setEmojiPickerOpen(true);
            }}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-20 right-0 " ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              onEmojiClick={hundleAddEmoji}
              open={emojiPickerOpen}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <div
        onClick={hundleSendMessage}
        className="cursor-pointer bg-[#8417ff] rounded-md flex items-center justify-center p-6 focus:outline-none focus:border-none focus:bg-[#741bda] focus:text-white hover:bg-[#741bda] transition-all duration-300"
      >
        <IoSend className="text-2xl" />
      </div>
    </div>
  );
};

export default Message_Bar;
