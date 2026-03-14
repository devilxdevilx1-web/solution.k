import { useState } from "react";
import "./index.css";

function App() {

  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modules, setModules] = useState([]);
  const [viewMode, setViewMode] = useState("summary");

  // YOUR BACKEND
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
        throw new Error("Backend failed");
      }

      const data = await response.json();

      const processedModules = [
        {
          id: 1,
          name: "AI Generated Guide",
          overview: data.result,
          keyConcepts: ["AI generated summary"],
          importantFunctions: [],
          exampleCode: "",
          commonMistakes: [],
          quickTakeaway: "Review the explanation above.",
          revisionPoints: [],
          definitions: [],
          practiceQuestions: [],
          examSet: {
            theory: [],
            coding: [],
            debugging: [],
            concept: []
          }
        }
      ];

      setModules(processedModules);

    } catch (err) {

      console.error(err);
      alert("❌ Cannot reach backend. Make sure Render backend is running.");

    } finally {

      setIsProcessing(false);

    }

  };

  const renderContent = (mod) => {

    switch (viewMode) {

      case "pdf":

        return (
          <div>
            <h3>Overview</h3>
            <p>{mod.overview}</p>
          </div>
        );

      case "revision":

        return (
          <div>
            <h3>Revision Notes</h3>
            <p>{mod.overview}</p>
          </div>
        );

      case "exam":

        return (
          <div>
            <h3>Exam Preparation</h3>
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
        <h1 className="gradient-text">Solution K</h1>
        <p>Your Multi-Format AI Study Assistant</p>
      </header>

      <main>

        <div className="glass uploader">

          <h2>Load Syllabus</h2>

          <textarea
            placeholder="Paste syllabus or topics..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            onClick={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? "Analyzing..." : "Generate Study Guide"}
          </button>

        </div>

        {modules.length > 0 && (

          <div className="results">

            <div className="view-controls">

              <button
                className={viewMode === "summary" ? "active" : ""}
                onClick={() => setViewMode("summary")}
              >
                Standard Guide
              </button>

              <button
                className={viewMode === "pdf" ? "active" : ""}
                onClick={() => setViewMode("pdf")}
              >
                PDF Summary
              </button>

              <button
                className={viewMode === "revision" ? "active" : ""}
                onClick={() => setViewMode("revision")}
              >
                Revision Notes
              </button>

              <button
                className={viewMode === "exam" ? "active" : ""}
                onClick={() => setViewMode("exam")}
              >
                Exam Prep
              </button>

            </div>

            {modules.map((mod) => (
              <div key={mod.id} className="card">
                <h2>{mod.name}</h2>
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