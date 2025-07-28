import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Intro from "../components/Intro.jsx";
import MessageComponent from "../components/MessageComponent.jsx";
import Profile from "../components/Profile.jsx";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const displayRef = useRef(null);

  useEffect(() => {
    displayRef.current.scrollIntoView();
  }, [messages])

  const askChatbot = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages(prev => [...prev, {user: true, text: input}]);
    try {
      const res = await fetch(`http://localhost:8000/query/answer?input=${input}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },  
        // body: JSON.stringify(input)
      })

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
        setMessages(prev => [...prev, {user: false, text: response}]);
      } else {
        console.log(res);
        setMessages(prev => [...prev, {user: false, text: "Some error occured."}]);
      }
    } catch (e) {
      console.log(e);
      setMessages(prev => [...prev, {user: false, text: "Some error occured, sorry for the inconvinience."}]);
    } finally {
      setLoading(false);
    }
  }

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
        <br ref={displayRef}/>
      </div>
      <div className="absolute w-[85%] bg-gray-500 h-12 rounded-3xl bottom-12 flex p-2 gap-2 items-center">
        <input
          type="text"
          placeholder="Ask me about anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-[100%] border-2 border-gray-700 rounded-3xl outline-none pl-4 h-full"
        />
        {loading ? (
          <button type="button" className="h-full bg-gray-400 flex rounded-3xl px-6 font-bold focus:outline-2 items-center gap-2">
            <svg class="bg-white rounded-bl-2xl rounded-tr-2xl size-5 animate-spin" viewBox="0 0 20 20"></svg>
            Loading....
          </button>
        ) : (
          <button className="h-full bg-white rounded-3xl px-8 font-bold hover:bg-gray-300" onClick={askChatbot}>
            Send
          </button>
        )}
      </div>
      <Profile />
    </div>
  );
}

export default Chat;
