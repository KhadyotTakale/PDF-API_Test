import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url || !callbackUrl) {
      alert("Please enter both URL and Callback URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "WIMSUP-API-KEY": import.meta.env.VITE_API_KEY, 
          },
          body: JSON.stringify({
            url,
            callback_url: callbackUrl,
          }),
        }
      );

      if (!response.ok) {
        alert("Failed to generate PDF.");
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      link.click();
    } catch (error) {
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">PDF Generator</h1>

      <input
        type="text"
        placeholder="Enter URL to convert into PDF"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="input-box"
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Enter your Callback URL"
        value={callbackUrl}
        onChange={(e) => setCallbackUrl(e.target.value)}
        className="input-box"
        disabled={loading}
      />

      <button
        className="download-button"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
};

export default App;
