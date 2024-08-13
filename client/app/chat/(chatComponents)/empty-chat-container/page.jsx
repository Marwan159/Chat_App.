import React from "react";
// import Lottie from "react-lottie";/
import { animationDefaultOption } from "@/lib/utils";
const Empty_chat_Container = () => {
  return (
    <div className="flex-1  md:bg-[#1b1c25] md:flex flex-col items-center justify-center hidden duration-1000 transition-all">
      {/* <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOption}
      /> */}
      <div className="flex flex-col justify-center items-center gap-5 text-opacity-80 text-white mt-10 text-3xl transition-all duration-300 lg:text-4xl">
        <h3 className="poppins-medium">
          Hi<span className="text-purple-500">! </span>
          Welcome to <span className="text-purple-500">Syncronus </span>
          Chat App<span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default Empty_chat_Container;
