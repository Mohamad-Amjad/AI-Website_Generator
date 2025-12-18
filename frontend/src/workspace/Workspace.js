import React, { useState } from "react";
import "./Workspace.css";
import Sidebar from "../Sidebar/Sidebar.js";
import Playground from "../Playground/Playground.js";
import { useLocation } from "react-router-dom";

const Workspace = () => {
  const location = useLocation();
  const msg = location.state?.msg || "";

  const [generatedHTML, setGeneratedHTML] = useState("");
  const [promptMessage,setPromptMessage]=useState(msg);

  return (
    <div className="workspace">
      <Sidebar msg={msg} onCodeGenerated={setGeneratedHTML} prompt={promptMessage}/>
      <Playground htmlCode={generatedHTML} promptClick={setPromptMessage}/>
    </div>
  );
};

export default Workspace;
