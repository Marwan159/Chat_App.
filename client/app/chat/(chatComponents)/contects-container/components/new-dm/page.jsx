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
  API_ROUTES_AUTH,
  HOST,
  SEARCH_CONTACTS_ROUTES,
} from "@/utils/constenst";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const New_Dm = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const { setSelectedChatData, setSelectedChatType, setSelectedChatMessage } =
    useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const data = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          {
            searchTerm,
          },
          {
            withCredentials: true,
          }
        );
        // console.log(data.data.contacts);
        if (data.status === 201 && data.data.contacts) {
          setSearchedContacts(data.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something wrong with search");
    }
  };

  const selectNewContact = async (contact) => {
    setOpenDialog(false);
    setSearchedContacts([]);
    setSelectedChatMessage([]);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    console.log("Done close dailog.");
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
            Select new contacts
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-[#181920] text-white  border-none h-[400px]  w-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select content</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <input
              type="text"
              className="border-none bg-[#2c2e3b] p-3 px-6 w-full  outline-none focus:rounded-lg"
              placeholder="Search contacts"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  className="flex gap-3 items-center cursor-pointer"
                  key={contact._id}
                  onClick={() => {
                    selectNewContact(contact);
                  }}
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 md:h-12 md:w-12 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="avatar "
                          className="object-cover rounded-full h-full w-full bg-black "
                        />
                      ) : (
                        <div
                          className={`h-12 w-12 md:h-12 md:w-12 uppercase text-3xl  flex items-center justify-center rounded-full ${getColor(
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
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span>{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className="flex-1 mb-10 md:bg-[#181920] md:flex flex-col items-center justify-center hidden duration-1000 transition-all">
              {/* <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOption}
              /> */}
              <div className="flex flex-col justify-center items-center gap-5 text-opacity-80 text-white mt-10 text-lg transition-all duration-300 lg:text-2xl">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">! </span>
                  Search New <span className="text-purple-500">Contacts. </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default New_Dm;
