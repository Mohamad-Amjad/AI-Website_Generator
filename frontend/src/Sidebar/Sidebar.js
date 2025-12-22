import React, { useEffect, useState } from "react";
import sendIcon from "../assets/send.png";
import "./Sidebar.css";

const Sidebar = ({ msg = "", onCodeGenerated, prompt }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(msg);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt) setInput(prompt);
  }, [prompt]);

  function isCodeRequest(text) {
    const keywords = [
      "generate",
      "create",
      "build",
      "make",
      "design",
      "html",
      "css",
      "js",
      "dashboard",
      "landing",
      "faq",
      "form",
      "page",
    ];
    return keywords.some((word) => text.toLowerCase().includes(word));
  }

  let userInput = input;

  if (isCodeRequest(input)) {
      userInput = `${input}
  Generate a complete HTML Tailwind CSS layout using Flowbite UI.
  Only return <body> HTML. No explanations.`;
    
  }

  function extractHTML(text) {
    const match = text.match(/```html([\s\S]*?)```/i);
    return match ? match[1].trim() : text.trim();
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!process.env.REACT_APP_OPENROUTER_API_KEY) {
      alert("Missing OpenRouter API key!");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const response1 = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b:free",
            messages: [{ role: "user", content: userInput }],
            reasoning: { enabled: true },
          }),
        }
      );

      const result1 = await response1.json();
      const assistantMessage = result1?.choices[0].message;

      const response2 = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b:free",
            messages: [
              { role: "user", content: userInput },
              {
                role: "assistant",
                content: assistantMessage.content,
                reasoning_details: assistantMessage.reasoning_details,
              },
              { role: "user", content: "Are you sure? Think carefully." },
            ],
          }),
        }
      );

      const result2 = await response2.json();
      const aiText =
        result2?.choices?.[0]?.message?.content || "No response received.";

      const htmlCode = extractHTML(aiText);

      if (htmlCode.startsWith("<")) {
        onCodeGenerated?.(htmlCode);
        try {
          fetch(process.env.REACT_APP_API_URL+"prompts",{
            method:'POST',
            headers:{
              "Content-Type": "application/json"
            },
            body:JSON.stringify({
              role:"user",
              inputPrompt:input
            })
          }).then(res=>res.json()).then((res)=>console.log("input saved successfully"))  
        } catch (error) {
          console.error("input Saved failed")
        }

        //response
        try {
          fetch(process.env.REACT_APP_API_URL+"response",{
            method:'POST',
            headers:{
              "Content-Type": "application/json"
            },
            body:JSON.stringify({
              role:"assistant",
              AiResponse:htmlCode
            })
          }).then(res=>res.json()).then((res)=>console.log("response saved successfully"))  
        } catch (error) {
          console.error("response Saved failed")
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Created successfully 👍" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: htmlCode },
        ]);
      }
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="sidebar">
      <div className="reply-msg">
        {messages.map((m, i) => (
          <p key={i} className={m.role}>
            {m.content}
          </p>
        ))}
        {loading && <p className="loading">Thinking...</p>}
      </div>

      <div className="message-box">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={handleKeyPress}
        />
        <img
          src={sendIcon}
          alt="Send"
          className="send-btn"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default Sidebar;
