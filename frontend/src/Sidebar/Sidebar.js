import React, { useEffect, useState } from "react";
import sendIcon from "../assets/send.png";
import "./Sidebar.css";

const Sidebar = ({ msg = "", onCodeGenerated, prompt }) => {
  const [messages, setMessages] = useState([]); // store all messages (user + AI)
  const [input, setInput] = useState(msg);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt) {
      setInput(prompt);
    }
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
    userInput = `${input} : 1. Generating HTML/CSS Code
  
  If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:
  
      Generate a complete HTML Tailwind CSS code using Flowbite UI components.
  
      Use a modern design with blue as the primary color theme.
  
      Only include the <body> content (do not add <head> or <title>).
  
      Make it fully responsive for all screen sizes.
  
      All primary components must match the blue theme color.
  
      Add proper padding and margin for each element.
  
      Components should be independent; do not connect them.
  
      Use placeholders for all images:
  
          Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
  
          Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
  
      Add an alt tag describing the image prompt.
  
      Use the following libraries/components where appropriate:
  
          FontAwesome icons (fa fa-)
  
          Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.
  
          Chart.js for charts & graphs
  
          Swiper.js for sliders/carousels
  
          Tippy.js for tooltips & popovers
  
      Include interactive components like modals, dropdowns, and accordions.
  
      Ensure proper spacing, alignment, hierarchy, and theme consistency.
  
      Ensure charts are visually appealing and match the theme color.
  
      Header menu options should be spread out and not connected.
  
      Do not include broken links.
  
      Do not add any extra text before or after the HTML code.
  
  2. General Text or Greetings
  
  If the user input is general text or greetings (e.g., "Hi", "Hello", "How are you?") or does not explicitly ask to generate code, then:
  
      Respond with a simple, friendly text message instead of generating any code.
  
  Examples:
  
      User: "Hi" → Response: "Hello! How can I help you today?"
  
      User: "Build a responsive landing page with Tailwind CSS" → Response: [Generate full HTML code as per instructions above]
    3. if user asks about FAQ section 
  Generate a complete HTML Tailwind CSS FAQ section.
  Each question should be collapsible using Flowbite accordion component.
  Only provide the HTML code. Do not include any explanation or extra text.
      `;
  }

  function extractHTML(responseText) {
    const match = responseText.match(/```html([\s\S]*?)```/i);
    return match ? match[1].trim() : responseText.trim();
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setInput("");
    }
  }
  const sendMessage = async () => {
    if (!input.trim()) return; // ignore empty messages
    if (!process.env.REACT_APP_OPENROUTER_API_KEY) {
      alert("Missing API key!");
      return;
    }
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin, // safer value
            "X-Title": "AI Website Generator",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemma-3-4b-it:free",
            messages: [{ role: "user", content: userInput }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage =
        data?.choices?.[0]?.message?.content || "No response received.";
      const htmlCode = extractHTML(aiMessage);

      if (htmlCode.startsWith("<")) {
        if (onCodeGenerated) {
          onCodeGenerated(htmlCode);
          fetch(process.env.REACT_APP_API_URL + "prompts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "user",
              inputPrompt: input,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.success) console.log("saved succesfully", res);
            })
            .catch((err) => console.error("error saving input ", err));
        //response sending to server

        fetch(process.env.REACT_APP_API_URL + "response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "assistant",
              AiResponse: htmlCode,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.success) console.log("response saved succesfully", res);
            })
            .catch((err) => console.error("response error saving input ", err));
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Created successfully 👍" },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: htmlCode },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
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
    <>
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
    </>
  );
};

export default Sidebar;
