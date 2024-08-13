import React from "react";
import Profile_Info from "./components/profile-info/page";
import New_Dm from "./components/new-dm/page";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_CONTACTS_FOR_DM, GET_USER_CHANNELS } from "@/utils/constenst";
import Contact_list from "@/components/contacts-list";
import { useAppStore } from "@/store";
import Create_Channel from "./components/create-channel/page";

const Contects_Container = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      const contacts = await apiClient(GET_ALL_CONTACTS_FOR_DM, {
        withCredentials: true,
      });
      if (contacts) {
        setDirectMessagesContacts(contacts.data.contacts);
      }
    };
    const getChannels = async () => {
      const channels = await apiClient(GET_USER_CHANNELS);
      if (channels) {
        setChannels(channels.data.channels);
      }
    };
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f403b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title title={"Direct Messages"} />
          <New_Dm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hide">
          <Contact_list contacts={directMessagesContacts} isChannel={false} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title title={"Channels"} />
          <Create_Channel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hide">
          <Contact_list contacts={channels} isChannel={true} />
        </div>
      </div>
      <Profile_Info />
    </div>
  );
};

export const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Syncronus</span>
    </div>
  );
};

export const Title = ({ title }) => {
  return (
    <h6 className="uppercase tracking-widest pl-10 text-neutral-400 text-sm text-opacity-90 font-light">
      {title}
    </h6>
  );
};

export default Contects_Container;
