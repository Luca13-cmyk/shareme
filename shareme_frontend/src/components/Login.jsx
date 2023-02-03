import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { getGoogleUser } from "../utils";

import { client } from "../client";
import useAuthStore from "../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { addUser } = useAuthStore();

  const responseGoogle = (response) => {
    const { name, picture, sub } = getGoogleUser(response);

    const user = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };

    addUser(user);

    client.createIfNotExists(user).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center inset-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="Logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
