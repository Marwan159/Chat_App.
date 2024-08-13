"use client";
import { useAppStore } from "@/store";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "./ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  UPDATE_USERDATE_ROUTE,
  UPDATE_IMAGEUSER_ROUTE,
  DELETE_IMAGEUSER_ROUTE,
  HOST,
} from "@/utils/constenst";
import { useEffect } from "react";
import { useRef } from "react";

const Profile = () => {
  const router = useRouter();
  const { userInfo, setUserName, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedcolor, setSelectedColor] = useState(0);
  const fileImageRef = useRef(null);
  const colors = [
    "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
    "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
    "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
    "bg-[#4cc9f02a] text-[#4ccdf0] border-[1px] border-[#4ccdf0bb]",
  ];

  useEffect(() => {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setSelectedColor(userInfo.color);
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validationProfile = () => {
    if (!firstName || !lastName) {
      return toast.error("First Name and Last Name is required..");
    }
  };

  const saveChange = async () => {
    validationProfile();
    try {
      const data = await apiClient.post(
        UPDATE_USERDATE_ROUTE,
        {
          firstName,
          lastName,
          color: selectedcolor,
        },
        {
          withCredentials: true,
        }
      );
      setUserInfo({ ...data.data });
      // console.log(data, userInfo, "user info..");
      toast.success("Done setup your profile successfully..");
      router.push("/chat");
    } catch (error) {
      console.log(error.message);
    }
  };

  const navigateHundler = () => {
    if (!userInfo.profileSetup) {
      toast.error("please setup your profile first..");
      return router.push("/profile");
    }
    router.push("/chat");
  };
  const fileImageRefClick = () => {
    fileImageRef.current.click();
  };
  const changeHundlerImage = async (e) => {
    const fileImage = e.target.files[0];
    if (fileImage) {
      const formData = new FormData();
      formData.append("profile-image", fileImage);
      console.log(formData.get("profile-image"));
      const data = await apiClient.post(UPDATE_IMAGEUSER_ROUTE, formData, {
        withCredentials: true,
      });
      console.log(data, "data come from update image api");

      if (data.data) {
        setUserInfo({ ...userInfo, image: data.data.image });
        toast.success("Done updata image profile successfully..");
      }
      // const reader = new FileReader();
      // console.log(reader, "reader from file reader in update image");

      // reader.onload = () => {
      //   setImage(reader.result);
      // };
    }
  };
  const removeHundlerImage = async (e) => {
    const data = await apiClient.delete(DELETE_IMAGEUSER_ROUTE, {
      withCredentials: true,
    });
    if (data) {
      toast.success("Image profile deleted successfully..");
      setImage(null);
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div className="" onClick={navigateHundler}>
          <IoArrowBack className=" text-4xl text-white/90 lg:text-6xl cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-32 w-32 relative md:w-84 md:h-84 flex items-center justify-center "
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
          >
            <Avatar className="h-32 w-32 md:h-32 md:w-32 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="avatar "
                  className="object-cover h-full w-full bg-black "
                />
              ) : (
                <div
                  className={`h-32 w-32 md:h-32 md:w-32 uppercase text-5xl  flex items-center justify-center rounded-full ${getColor(
                    selectedcolor
                  )}
                  `}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className=" absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50"
                onClick={image ? removeHundlerImage : fileImageRefClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
          </div>
          <input
            onChange={changeHundlerImage}
            ref={fileImageRef}
            type="file"
            name="profile-image"
            accept=".jpg, .png, .svg, .jpeg, .webp"
            className="border-none hidden rounded-lg bg-[#2c2e3b]"
          />
          <div className="flex flex-col gap-5 text-white min-w-32 md:min-w-64 items-center justify-center">
            <div className="w-full ">
              <Input
                value={userInfo.email}
                disabled
                placeholder="Email"
                type="email"
                className="border-none p-6  rounded-lg bg-[#2c2e3b]"
              />
            </div>

            <div className="w-full">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                type="text"
                className="border-none p-6 text-white focus:border-none rounded-lg bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <Input
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                placeholder="Last Name"
                type="text"
                className="border-none p-6 focus:border-none rounded-lg bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full flex items-center justify-center gap-6">
              {" "}
              {colors.map((color, index) => {
                return (
                  <div
                    className={`${color} h-8 w-8 rounded-full transition-all duration-300 cursor-pointer ${
                      index === selectedcolor
                        ? "outline-4 outline-white/50 outline"
                        : ""
                    } `}
                    key={index}
                    onClick={(e) => setSelectedColor(index)}
                  ></div>
                );
              })}
            </div>
            <div className="w-full">
              <Button
                className="w-full rounded-lg h-16 bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                onClick={saveChange}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
