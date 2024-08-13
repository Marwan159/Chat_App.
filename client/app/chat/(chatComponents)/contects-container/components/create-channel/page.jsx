import React from "react";
import { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
// import Lottie from "react-lottie";
import { animationDefaultOption, getColor } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL,
  GET_ALL_CONTACTS_FOR_CHANNEL,
} from "@/utils/constenst";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import MultipleSelector from "@/components/ui/multipleselect";

const Create_Channel = () => {
  const { setSelectedChatData, setSelectedChatType, addChannel, channels } =
    useAppStore();
  const [openDailog, setOpenDialog] = useState(false);
  const [newChannelModal, setNewChannelModal] = useState([]);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState();

  useEffect(() => {
    const getAllcontact = async () => {
      const contacts = await apiClient.get(GET_ALL_CONTACTS_FOR_CHANNEL);
      setAllContacts(contacts.data.AllContacts);
    };
    getAllcontact();
  }, []);

  const createChannel = async () => {
    console.log(
      "Selected Users: ",
      selectedContacts,
      "Channel name: ",
      channelName
    );
    const response = await apiClient.post(CREATE_CHANNEL, {
      channelName,
      selectedContacts,
    });
    addChannel(response.data.channel);
  };

  return (
    <div className="text-white ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 font-light text-start hover:text-neutral-100 text-opacity-90 transition-all duration-300 cursor-pointer"
              onClick={() => setOpenDialog(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b25] text-white mb-2 p-3 border-none">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-[#181920] text-white  border-none h-[400px]  w-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please full up the details for new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <input
              type="text"
              className="border-none bg-[#2c2e3b] p-3 px-6 w-full  outline-none focus:rounded-lg"
              placeholder="Channel name"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div className="">
            <MultipleSelector
              className="rounded-lg border-none  bg-[#2c2e3b] py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Content"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-xl text-slate-600 h-full bg-white leading-10">
                  No Results.
                </p>
              }
            />
          </div>
          <div className="">
            <button
              onClick={createChannel}
              className="w-full h-14 text-xl rounded-lg bg-purple-600 hover:bg-purple-900 transition-all duration-300"
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Create_Channel;
