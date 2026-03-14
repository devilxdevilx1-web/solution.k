import { useState } from "react";
import "./index.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modules, setModules] = useState([]);
  const [viewMode, setViewMode] = useState("summary");

  const API_URL = "https://solution-k-backend.onrender.com";

  const handleProcess = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`${API_URL}/study`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          syllabus: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      const processedModules = [
        {
          id: 0,
          name: "AI Generated Study Guide",
          overview: data.result,
          keyConcepts: ["See generated summary above"],
          importantFunctions: [],
          exampleCode: "",
          commonMistakes: [],
          quickTakeaway: "Follow the AI generated explanation.",
          revisionPoints: [],
          definitions: [],
          practiceQuestions: [],
          examSet: {
            theory: [],
            coding: [],
            debugging: [],
            concept: [],
          },
        },
      ];

      setModules(processedModules);
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Error connecting to AI backend.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = (mod) => {
    switch (viewMode) {
      case "pdf":
        return (
          <div>
            <h4>Overview</h4>
            <p>{mod.overview}</p>
          </div>
        );

      case "revision":
        return (
          <div>
            <h4>Quick Revision</h4>
            <p>{mod.overview}</p>
          </div>
        );

      case "exam":
        return (
          <div>
            <h4>Exam Preparation</h4>
            <p>{mod.overview}</p>
          </div>
        );

      default:
        return (
          <div>
            <p>{mod.overview}</p>
          </div>
        );
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Solution K</h1>
        <p>Your AI Study Assistant</p>
      </header>

      <main>
        <div className="uploader">
          <h2>Load Syllabus</h2>

          <textarea
            placeholder="Paste syllabus or topics..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button onClick={handleProcess} disabled={isProcessing}>
            {isProcessing ? "Analyzing..." : "Generate Study Guide"}
          </button>
        </div>

        {modules.length > 0 && (
          <div className="results">
            <div className="view-controls">
              <button onClick={() => setViewMode("summary")}>Summary</button>
              <button onClick={() => setViewMode("pdf")}>PDF</button>
              <button onClick={() => setViewMode("revision")}>Revision</button>
              <button onClick={() => setViewMode("exam")}>Exam Prep</button>
            </div>

            {modules.map((mod) => (
              <div key={mod.id} className="card">
                <h3>{mod.name}</h3>
                {renderContent(mod)}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;