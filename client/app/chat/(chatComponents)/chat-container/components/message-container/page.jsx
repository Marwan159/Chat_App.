import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_ALL_CONTACTS_FOR_DM,
  GET_ALL_MESSAGES,
  GET_CHANNEL_MESSAGES,
  GET_USERDATA_ROUTE,
  HOST,
} from "@/utils/constenst";
import moment from "moment";
import Image from "next/image";
import React from "react";
import { useRef, useEffect } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import axios from "axios";
import { useState } from "react";
import { IoClipboardSharp, IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const Message_Container = () => {
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState(null);
  const scrollRef = useRef();
  const {
    userInfo,
    selectedChatMessage,
    selectedChatData,
    setSelectedChatMessage,
    selectedChatType,
    setFileDownloadingProgress,
    setIsDownloading,
    isDownloading,
    fileDownloadProgress,
  } = useAppStore();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const data = await apiClient.post(
          GET_ALL_MESSAGES,
          {
            id: selectedChatData._id,
          },
          {
            withCredentials: true,
          }
        );
        if (data.data.messages) {
          // console.log(data, "4444");
          setSelectedChatMessage([]);
          setSelectedChatMessage(data.data.messages);
        }
      } catch (err) {
        console.log(err.message, "fontend");
      }
    };
    const getChannelMessage = async () => {
      try {
        const data = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,

          {
            withCredentials: true,
          }
        );
        if (data.data.messages) {
          // console.log(data, "4444");
          setSelectedChatMessage([]);
          setSelectedChatMessage(data.data.messages);
        }
      } catch (err) {
        console.log(err.message, "fontend");
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessage();
      }
    }
  }, [
    selectedChatData,
    selectedChatType,
    setSelectedChatMessage,
    selectedChatMessage,
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage]);

  const checkImage = (filepath) => {
    const imageRgx =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRgx.test(filepath);
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div className="" key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-3">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };
  const hundelDownloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadingProgress(0);
    const Url = `${HOST}/${url}`;
    console.log(Url);
    const fileName = Url.split("/").pop();
    const response = await apiClient(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (ProgressEvent) => {
        const { loaded, total } = ProgressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadingProgress(percentCompleted);
      },
    });
    console.log(response);
    const data = new Blob([response.data]);
    console.log(data);
    const urlBlob = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
  };

  const renderChannelMessage = (message) => {
    return (
      <div
        className={`${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div className="">
            <div
              className={`${
                message.sender._id === userInfo.id
                  ? "bg-[#8417ff]/5 text-[#8417ff]/90  border-[#8417ff]"
                  : "bg-[#212b33] text-white/90 border-[1px] border-[#ffffff]/20"
              }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            >
              {message.content}
            </div>
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#212b33] text-white/90 border-[#ffffff]/20"
            }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setImage(message);
                  setShowImage(true);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  width={250}
                  height={250}
                  alt="image"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl p-2 bg-black/20 text-white">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    hundelDownloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 md:h-8 md:w-8 rounded-full overflow-hidden">
              {userInfo.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="avatar "
                  className="object-cover rounded-full h-full w-full bg-black "
                />
              )}{" "}
              <AvatarFallback
                className={`h-8 w-8 md:h-8 md:w-8  uppercase text-xl  flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}
            `}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-white/60">
              {message.sender.firstName} {message.sender.lastName}
            </div>
            <div className="text-sm text-white/60">
              {" "}
              {moment(message.sender.timestamp).format("LT")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-white/60">
            {" "}
            {moment(message.sender.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  const renderDMMessage = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#212b33] text-white/90 border-[#ffffff]/20"
          }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#212b33] text-white/90 border-[#ffffff]/20"
          }border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setImage(message);
                setShowImage(true);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                width={250}
                height={250}
                alt="image"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl p-2 bg-black/20 text-white">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  hundelDownloadFile(message.fileUrl);
                }}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-sm text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto  scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {isDownloading && (
        <div className="fixed z-[1000] h-[100vh] w-[100vw] top-0 left-0 flex flex-col items-center justify-center gap-10 backdrop-blur-lg">
          <h1 className="text-5xl animate-pulse">Downloading..</h1>
          {fileDownloadProgress} %
        </div>
      )}
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div
          className="fixed z-[10] h-[100vh] w-[100vw] top-0 left-0 flex flex-col items-center justify-center gap-10 backdrop-blur-lg"
          onClick={() => {
            setImage(null);
            setShowImage(false);
          }}
        >
          <div className="">
            <img
              src={`${HOST}/${image.fileUrl}`}
              className="h-[80vh]  w-full mt-10 bg-cover"
              alt="image"
            />
          </div>
          <div className="flex gap-5 items-center justify-center fixed top-0 mt-5">
            {" "}
            <span
              className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                hundelDownloadFile(image.fileUrl);
              }}
            >
              <IoMdArrowRoundDown />
            </span>
            <span
              className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImage(null);
              }}
            >
              <IoCloseSharp />
            </span>
          </div>
        </div>
      )}
      {/* {showImage && (
        <div className=" fixed z-[100] h-[100vh]  top-0  flex flex-col items-center justify-center gap-15 backdrop-blur-lg"></div>
      )} */}
    </div>
  );
};

export default Message_Container;
