import { useAppStore } from "@/store";
import { ContactIcon } from "lucide-react";
import { useAmp } from "next/amp";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { GET_ALL_MESSAGES, HOST } from "@/utils/constenst";
import { getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

const Contact_list = ({ contacts, isChannel }) => {
  const {
    setSelectedChatData,
    setSelectedChatMessage,
    selectedChatType,
    setSelectedChatType,
    selectedChatData,
  } = useAppStore();
  const handelClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatMessage([]);
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      console.log("done ");
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => {
            handelClick(contact);
          }}
        >
          <div className="flex items-center justify-start gap-5 text-neutral-300">
            {" "}
            {!isChannel && (
              <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="avatar "
                    className="object-cover rounded-full h-full w-full bg-black "
                  />
                ) : (
                  <div
                    className={`h-10 w-10 md:h-12 md:w-12 uppercase text-3xl  flex items-center justify-center rounded-full ${getColor(
                      contact.color
                    )}
                `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center bg-[#ffffff22]">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {contact.firstName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contact_list;
