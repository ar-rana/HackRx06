import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Intro from "../components/Intro.jsx";
import MessageComponent from "../components/MessageComponent.jsx";
import Profile from "../components/Profile.jsx";
import { useAuthContext } from "../hooks/TokenContext.jsx";
import { useNavigate } from "react-router-dom";

function Chat() {
  const { token } = useAuthContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [document, setDocument] = useState(null);
  const displayRef = useRef(null);

  const askChatbot = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { user: true, text: input }]);

    const formData = new FormData();
    formData.append("query", input);
    if (document) {
      formData.append("document", document);
    }
    try {
      const res = await fetch(`http://localhost:8080/chat/conversation`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      // const resBody = res.body.getReader();
      // const decoder = new TextDecoder();
      // let resp = "";
      // while (true) {
      //   const { value, done } = await resBody.read();
      //   if (done) break;
      //   resp += decoder.decode(value, {stream : true});
      //   setMessages((prev) => {
      //     const lastMsg = prev[prev.length - 1];
      //     if (lastMsg && !lastMsg.user) {
      //       [...prev.splice(0, -1), {user: false, text: resp}]
      //     } else {
      //       [...prev, {user: false, text: resp}]
      //     }
      //   })
      // }

      if (res.ok) {
        const response = await res.text();
        setMessages((prev) => [...prev, { user: false, text: response }]);
        setInput("");
        setDocument(null);
      } else if (res.status === 403) {
        navigate("/", { state: { msg: "session timed out" } });
      } else {
        console.log(res);
        setMessages((prev) => [
          ...prev,
          { user: false, text: "Some error occured." },
        ]);
      }
    } catch (e) {
      console.log(e);
      setMessages((prev) => [
        ...prev,
        {
          user: false,
          text: "Some error occured, sorry for the inconvinience.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fileHandler = (e) => {
    e.preventDefault();
    console.log("reached file upload");
    const file = e.target.files[0];
    if (!file) return;

    setDocument(file);
    alert("file added");
  };

  useEffect(() => {
    displayRef.current.scrollIntoView();
  }, [messages]);

  return (
    <div className="relative h-screen flex bg-slate-800 justify-center">
      <div className="w-full bg-slate-700 m-8 rounded-2xl p-10 overflow-x-auto flex flex-col scrollbar-hide">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <MessageComponent key={i} text={msg.text} user={msg.user} />
          ))
        ) : (
          <Intro />
        )}
        <br ref={displayRef} />
      </div>
      <div className="absolute w-[85%] bg-gray-500 h-12 rounded-3xl bottom-12 flex p-2 gap-2 items-center">
        <input
          type="text"
          placeholder="Ask me about anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-[100%] border-2 border-gray-700 rounded-3xl outline-none pl-4 h-full"
        />
        <input
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={fileHandler}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          title="Upload file"
          className={`h-full rounded-full px-4 hover:bg-gray-300 cursor-pointer flex items-center ${document == null ? 'bg-white': 'bg-slate-300'}`}
        >
          <i className="fa fa-file"></i>
        </label>
        {loading ? (
          <button
            type="button"
            className="h-full bg-gray-400 flex rounded-3xl px-6 font-bold focus:outline-2 items-center gap-2"
          >
            <svg
              className="bg-white rounded-bl-2xl rounded-tr-2xl size-5 animate-spin"
              viewBox="0 0 20 20"
            ></svg>
            Loading....
          </button>
        ) : (
          <button
            className="h-full bg-white rounded-3xl px-8 font-bold hover:bg-gray-300"
            onClick={askChatbot}
          >
            Send
          </button>
        )}
      </div>
      <Profile />
    </div>
  );
}

export default Chat;
