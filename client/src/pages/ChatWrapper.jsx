import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/TokenContext";
import svg from "../assets/loading.svg";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";

const ChatWrapper = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  const verify = async () => {
    if (!token) {
      setVerified(false);
      navigate("/");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/auth/verify", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        setVerified(false);
        navigate("/");
      } else {
        setVerified(true);
      }
    } catch (e) {
      console.log("some error occured: ", e.message);
    }
  };

  useEffect(() => {
    verify();
  }, [token, verified]);

  if (verified) {
    return <Chat />;
  } else {
    return (
      <img
        className="h-32 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
        src={svg}
        alt="loading..."
      />
    );
  }
};

export default ChatWrapper;
