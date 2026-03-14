import { useState } from "react";
import "./index.css";

function App() {

  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState("");

  const API_URL = "https://solution-k-backend.onrender.com";

  const handleProcess = async () => {

    if (!inputText.trim()) return;

    setIsProcessing(true);

    try {

      const response = await fetch(`${API_URL}/study`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          syllabus: inputText
        })
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      setResult(data.result);

    } catch (err) {

      console.error(err);
      alert("Error connecting to backend AI");

    }

    setIsProcessing(false);

  };

  return (

    <div className="app">

      <header className="header">
        <h1>Solution K</h1>
        <p>Your Multi-Format AI Study Assistant</p>
      </header>

      <div className="glass-card">

        <h2>Load Syllabus</h2>

        <textarea
          placeholder="Paste module content or topics here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={handleProcess}
          disabled={isProcessing}
        >
          {isProcessing ? "Analyzing..." : "Generate Multi-Format Guides"}
        </button>

      </div>

      {result && (

        <div className="result-card">

          <h3>AI Study Guide</h3>

          <p>{result}</p>

        </div>

      )}

    </div>

  );

}

export default App;