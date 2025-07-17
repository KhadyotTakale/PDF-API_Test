import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      alert("Please enter the URL");
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
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        alert("Failed to generate PDF.");
        setLoading(false);
        return;
      }

      const idFromHeader = response.headers.get("X-INVOICE-ID");
      setInvoiceId(idFromHeader); // show on UI

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${idFromHeader || "invoice"}.pdf`;
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
        placeholder="Enter Invoice URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
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

      {invoiceId && (
        <div className="invoice-id-display">
          ✅ Extracted Invoice ID: <strong>{invoiceId}</strong>
        </div>
      )}
    </div>
  );
};

export default App;
