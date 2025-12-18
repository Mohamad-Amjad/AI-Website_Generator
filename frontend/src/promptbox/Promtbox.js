import React, { useState } from "react";
import "./Promtbox.css";
import prompts from "../assets/prompts.json";
import {  useNavigate } from "react-router-dom";
import  {useUser} from '@clerk/clerk-react';

const Promtbox = () => {
  const {isSignedIn}=useUser();
  const [description, setDescription] = useState("");
  const navigate=useNavigate();

  const checkSignedIn=()=>{
    if(!isSignedIn)
    alert("Please sign up or login");
    else
      navigate("/workspace",{state:{msg:description}});
      
  }
  return (
    <div className="promtBox">
      <div className="inputBox">
        <textarea
          placeholder="Describe your web page"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="generate-btn">
        <button disabled={description.trim() === ""} onClick={checkSignedIn}>
          Generate
          </button>
      </div>
      <div className="prompt-ideas">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => setDescription(prompt.description)}
          >
            {prompt.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Promtbox;
