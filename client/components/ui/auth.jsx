"use client";
import React from "react";
import Background from "@/assest/login2.png";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "./input";
import { useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constenst";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
const Auth = () => {
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const validationSignup = () => {
    if (!email.length) {
      toast.error("Email is requird..");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Email is not valid..");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required..");
      return false;
    }
    if (!userName.length) {
      toast.error("User name is required..");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Possword Confirm must be same..");
      return false;
    }
    return true;
  };
  const validationLoggin = () => {
    if (!email.length) {
      return toast.error("Email is required..");
    }
    if (!password.length) {
      return toast.error("Password is required..");
    }
    return true;
  };
  const logginHundler = async () => {
    validationLoggin();
    const dataLoggin = { email, password };
    try {
      const data = await apiClient.post(LOGGIN_ROUTE, dataLoggin, {
        withCredentials: true,
      });
      setUserInfo(data.data.user);
      // console.log(data, "userInfo");
      if (data) {
        router.push("/profile");
      }
    } catch (err) {
      console.log(err.message, "test");
      router.push("/");
      toast.error("Something wrong with loggin");
    }
  };
  const signupHundler = async () => {
    if (validationSignup()) {
      const dataSignup = { email, userName, password, confirmPassword };
      try {
        const data = await apiClient.post(SIGNUP_ROUTE, dataSignup, {
          withCredentials: true,
        });
        if (data.status === 201) {
          setUserInfo(data.data.user);
          // console.log({ data });
          router.push("/profile");
          toast.success("Signup Success.");
        }
        // console.log("done create user.", data.status);
      } catch (error) {
        console.log(error.message, "test");
        toast.error("Something wrong in sign up");
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">
      <div className="h-[80vh] w-[80vw] gap-12 bg-white border-2 border-white rounded-3xl flex items-center justify-center gtid shadow-2xl text-4xl text-opacity-90">
        <div className="flex flex-col gap-5 items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center  justify-center">
              <h1 className="text-5xl font-bold mb-10 ">Welcome ✌️</h1>
            </div>
            <p className="font-medium text-lg text-center">
              Fill in the ditails to get started the best chat app!
            </p>
          </div>
          <div className=" flex  items-center justify-center w-full">
            <Tabs className="w-3/4">
              <TabsList className="bg-transparent w-full flex rounded-none ">
                <TabsTrigger
                  value="loggin"
                  className=" text-lg data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold p-3 data-[state=active]:border-b-purple-500 transition-all duration-300"
                >
                  Loggin
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-lg data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold p-3 data-[state=active]:border-b-purple-500 transition-all duration-300"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className=" flex flex-col gap-10 mt-10"
                value="loggin"
              >
                <Input
                  className="rounded-full outline-none p-6"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="rounded-full outline-none p-6"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={logginHundler}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  className="rounded-full p-6"
                  placeholder="User Name"
                  type="test"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  className="rounded-full p-6"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="rounded-full p-6"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  className="rounded-full p-6"
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={signupHundler}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden  xl:flex items-center justify-center">
          <Image src={Background} alt="background" className="h-[550px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
