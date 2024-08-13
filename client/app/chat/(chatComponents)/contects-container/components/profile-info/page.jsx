import { useAppStore } from "@/store";
import React from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { FiEdit2 } from "react-icons/fi";
import { HOST, LOGGOUT_ROUTE } from "@/utils/constenst";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { redirect, useRouter } from "next/navigation";
import { IoLogOut, IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { getColor } from "@/lib/utils";

const Profile_Info = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const router = useRouter();
  const loggout = async () => {
    const data = await apiClient.post(LOGGOUT_ROUTE);
    if (data.status === 200) {
      setUserInfo(null);
      router.push("/");
      toast.success("Done Loggout successfully.");
    }
  };
  return (
    <div className="absolute bottom-0 w-full bg-[#2a2b33] h-16 flex items-center justify-between px-10">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 md:h-12 md:w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="avatar "
                className="object-cover rounded-full h-full w-full bg-black "
              />
            ) : (
              <div
                className={`h-12 w-12 md:h-12 md:w-12 uppercase text-3xl  flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}
            `}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-white text-base">
          {userInfo.firstName} {userInfo.lastName}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl font-medium"
                onClick={() => router.push("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white border-none">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl font-medium"
                onClick={loggout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white border-none">
              Logg out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Profile_Info;
