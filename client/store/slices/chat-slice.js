import { userInfo } from "os";

export const createSliceChat = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessage: [],
  directMessagesContacts: [],
  isDownloading: false,
  fileDownloadProgress: 0,
  channels: [],
  setChannels: (channels) => set({ channels }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileDownloadingProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatMessage: (selectedChatMessage) => set({ selectedChatMessage }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessage: [],
    }),
  addMessage: (message) => {
    const selectedChatMessage = get().selectedChatMessage;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessage: [
        ...selectedChatMessage,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },
  addContactsInDmContacts: (message) => {
    const userId = get().userInfo.id;
    const formId =
      message.sender._id === userId
        ? message.recipient._id
        : message.sender._id;
    const formData =
      message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMessagesContacts;
    const data = dmContacts.find((contact) => contact._id === formId);
    const index = dmContacts.findIndex((contact) => contact._id === formId);
    if (index !== -1 && index !== undefined) {
      dmContacts.splice(index, -1);
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(formData);
    }
    set({ directMessagesContacts: dmContacts });
  },
});
