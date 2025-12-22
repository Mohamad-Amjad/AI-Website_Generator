import React, { useEffect, useRef, useState } from "react";
import "./Playground.css";

const Playground = ({ htmlCode, promptClick = () => {} }) => {
  const [prompt, setPrompt] = useState([]); // always an array
  const [showPrompt, setShowPrompt] = useState(false); // toggle search history
  const iframeRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}workspace`)
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) setPrompt(res);
        else if (Array.isArray(res.prompts)) setPrompt(res.prompts);
        else setPrompt([]);
        
      })
      .catch((err) => {
        console.error("Error fetching prompts:", err);
        setPrompt([]);
      });
  }, [],[prompt]);

  const generatedCode = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
    </head>
    <body class="bg-gray-50">
      ${htmlCode}
    </body>
    </html>
  `;

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-design.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteHistory =async(id) => {
    const ok = window.confirm("Do you want to delete this data?");
    if(ok)
    {
      try {
        const response=await fetch(process.env.REACT_APP_API_URL+"workspace/"+id,
          {
            method:"DELETE"
          }
        );
        if(response.ok)
        {
          setPrompt((prevPrompt)=>prevPrompt.filter((p)=>p._id!==id));
          console.log("Deleted successfully");
        }
        else
        {
          console.log("deleted failed");
        }
      } catch (error) {
        console.log("deletion error : "+error);
      }
    }
    else
    {
      console.log("Deletion cancelled");
    }
  };
  useEffect(() => {
    if (iframeRef.current && htmlCode) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(generatedCode);
      doc.close();
    }
  }, [htmlCode]);

  return (
    <div className="playground">
      <button
        className="download history"
        onClick={() => setShowPrompt(!showPrompt)}
      >
        {showPrompt ? "Hide Search History" : "Show Search History"}
      </button>

      {showPrompt && (
        <div className="prompt-container">
          {prompt.length > 0 ? (
            prompt.map((p) => (
              <p
                key={p._id}
                className="placeholder-text"
                onClick={() => promptClick(p.inputPrompt)}
              >
                {p.inputPrompt}{" "}
                <span className="delete" onClick={(e)=>{e.stopPropagation();deleteHistory(p._id)}}>
                  x
                </span>
              </p>
            ))
          ) : (
            <>
            <br/>
            <p>No history found</p>
            </>
          )}
        </div>
      )}

      {htmlCode && (
        <>
          <button className="download" onClick={handleDownload}>
            Download Code
          </button>
          <iframe ref={iframeRef} title="preview" className="preview-frame" />
        </>
      )}

      {!htmlCode && !showPrompt && <div>Generated code appears here</div>}
    </div>
  );
};

export default Playground;
