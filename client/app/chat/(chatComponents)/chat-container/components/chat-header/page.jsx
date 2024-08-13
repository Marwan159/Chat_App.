import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constenst";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
const Chat_Header = () => {
  const { selectedChatData, closeChat, channels, selectedChatType } =
    useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b]  flex items-center w-full justify-between px-20">
      <div className="flex items-center  w-full justify-between gap-5">
        <div className="flex gap-3 items-center  justify-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 md:h-12 md:w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="avatar "
                    className="object-cover rounded-full h-full w-full bg-black "
                  />
                ) : (
                  <div
                    className={`h-12 w-12 md:h-12 md:w-12 uppercase text-3xl  flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}
                  `}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center bg-[#ffffff22]">
                #
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <span>
              {selectedChatType === "contact"
                ? selectedChatData.firstName && selectedChatData.lastName
                  ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                  : selectedChatData.email
                : selectedChatData.name}
            </span>
          </div>
        </div>
        <div
          onClick={closeChat}
          className="flex items-center justify-center  gap-5"
        >
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300">
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat_Header;
