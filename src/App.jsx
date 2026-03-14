import { useState } from 'react'
import './index.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [modules, setModules] = useState([])
  const [viewMode, setViewMode] = useState('summary') // modes: summary, revision, exam, pdf

  const handleProcess = async () => {
    if (!inputText.trim()) return
    setIsProcessing(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/study`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ syllabus: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from backend');
      }

      const data = await response.json();
      
      const processedModules = [{
        id: 0,
        name: "AI Generated Guide",
        overview: data.result,
        keyConcepts: ["See detailed overview"],
        importantFunctions: [],
        exampleCode: "",
        commonMistakes: [],
        quickTakeaway: "Follow the AI generated guidance above.",
        revisionPoints: [],
        definitions: [],
        practiceQuestions: [],
        examSet: {
          theory: [],
          coding: [],
          debugging: [],
          concept: []
        }
      }];

      setModules(processedModules)
    } catch (error) {
      console.error("Error processing syllabus:", error);
      alert("Error connecting to backend AI. Make sure it's running!");
    } finally {
      setIsProcessing(false)
    }
  }

  const renderContent = (mod) => {
    switch(viewMode) {
      case 'pdf':
        return (
          <div className="pdf-style">
            <div className="section">
              <h4>1. OVERVIEW</h4>
              <p>{mod.overview}</p>
            </div>
            <div className="section">
              <h4>2. KEY CONCEPTS</h4>
              <ul>{mod.keyConcepts.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
            <div className="section">
              <h4>3. IMPORTANT FUNCTIONS / SYNTAX</h4>
              <code>{mod.importantFunctions.join(', ')}</code>
            </div>
            <div className="section">
              <h4>4. EXAMPLE CODE</h4>
              <pre><code>{mod.exampleCode}</code></pre>
            </div>
            <div className="section">
              <h4>5. COMMON MISTAKES</h4>
              <ul>{mod.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
            <div className="section">
              <h4>6. QUICK TAKEAWAY</h4>
              <p><strong>{mod.quickTakeaway}</strong></p>
            </div>
          </div>
        )
      case 'revision':
        return (
          <div className="revision-style">
            <div className="section highlight">
              <h4>TOPIC SUMMARY</h4>
              <p>{mod.overview.substring(0, 100)}...</p>
            </div>
            <div className="section">
              <h4>KEY DEFINITIONS</h4>
              {mod.definitions.map((d, i) => <p key={i}><strong>{d.term}:</strong> {d.def}</p>)}
            </div>
            <div className="section">
              <h4>QUICK REVISION POINTS</h4>
              <ul>{mod.revisionPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="section">
              <h4>PRACTICE QUESTIONS</h4>
              <ol>{mod.practiceQuestions.map((q, i) => <li key={i}>{q}</li>)}</ol>
            </div>
          </div>
        )
      case 'exam':
        return (
          <div className="exam-style">
            <div className="section">
              <h4 className="gradient-text">SECTION 1 — THEORY QUESTIONS</h4>
              <ol>{mod.examSet.theory.map((q, i) => <li key={i}>{q}</li>)}</ol>
            </div>
             <div className="section">
              <h4 className="gradient-text">SECTION 2 — CODING QUESTIONS</h4>
              <ol>{mod.examSet.coding.map((q, i) => <li key={i}>{q}</li>)}</ol>
            </div>
             <div className="section">
              <h4 className="gradient-text">SECTION 3 — DEBUGGING QUESTIONS</h4>
              <ol>{mod.examSet.debugging.map((q, i) => <li key={i}>{q}</li>)}</ol>
            </div>
             <div className="section">
              <h4 className="gradient-text">SECTION 4 — CONCEPT QUESTIONS</h4>
              <ol>{mod.examSet.concept.map((q, i) => <li key={i}>{q}</li>)}</ol>
            </div>
          </div>
        )
      default:
        return (
          <div className="summary-style">
            <p>{mod.overview}</p>
            <div className="grid">
              <div>
                <h5>KEY CONCEPTS</h5>
                <ul>{mod.keyConcepts.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </div>
              <div>
                <h5>FUNCTIONS</h5>
                <code>{mod.importantFunctions.slice(0, 2).join(', ')}...</code>
              </div>
            </div>
            <pre className="code-block"><code>{mod.exampleCode}</code></pre>
          </div>
        )
    }
  }

  return (
    <div className="container animate-fade-in">
      <header>
        <h1 className="gradient-text">Solution K</h1>
        <p>Your Multi-Format AI Study Assistant</p>
      </header>

      <main>
        <div className="glass uploader">
          <h2>Load Syllabus</h2>
          <textarea
            placeholder="Paste module content or topics here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button onClick={handleProcess} disabled={isProcessing}>
            {isProcessing ? 'Analyzing...' : 'Generate Multi-Format Guides'}
          </button>
        </div>

        {modules.length > 0 && (
          <div className="results animate-fade-in">
            <div className="view-controls glass">
              <button 
                className={viewMode === 'summary' ? 'active' : ''} 
                onClick={() => setViewMode('summary')}
              >Standard Guide</button>
              <button 
                className={viewMode === 'pdf' ? 'active' : ''} 
                onClick={() => setViewMode('pdf')}
              >PDF Summary</button>
              <button 
                className={viewMode === 'revision' ? 'active' : ''} 
                onClick={() => setViewMode('revision')}
              >Revision Notes</button>
              <button 
                className={viewMode === 'exam' ? 'active' : ''} 
                onClick={() => setViewMode('exam')}
              >Exam Prep</button>
            </div>

            <div className="module-list">
              {modules.map(mod => (
                <div key={mod.id} className="glass card animate-fade-in">
                  <h3>{mod.name}</h3>
                  <div className="card-content">
                    {renderContent(mod)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        main { width: 100%; maxWidth: 900px; margin: 0 auto; }
        .uploader { padding: 40px; margin-bottom: 40px; }
        textarea { width: 100%; min-height: 150px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; color: white; margin-bottom: 20px; outline: none; }
        .uploader button { background: var(--accent-gradient); color: white; padding: 16px; width: 100%; font-size: 1.1rem; }
        
        .results { margin-top: 40px; }
        .view-controls { display: flex; gap: 10px; padding: 15px; margin-bottom: 30px; justify-content: space-around; }
        .view-controls button { background: transparent; color: var(--text-muted); border: 1px solid var(--border-glass); padding: 8px 15px; font-size: 0.9rem; }
        .view-controls button.active { background: var(--accent-gradient); color: white; border: none; }
        
        .card { padding: 30px; margin-bottom: 24px; text-align: left; }
        .card h3 { color: var(--accent-primary); margin-bottom: 20px; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px; }
        .section { margin-bottom: 20px; }
        .section h4 { font-size: 0.8rem; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 8px; }
        
        ul, ol { padding-left: 20px; color: var(--text-main); }
        li { margin-bottom: 5px; }
        
        pre { background: #000; padding: 15px; border-radius: 8px; border: 1px solid var(--border-glass); overflow-x: auto; color: #34d399; font-size: 0.9rem; }
        code { font-family: monospace; color: var(--accent-secondary); }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; margin-bottom: 15px; }
        .highlight { border-left: 3px solid var(--accent-secondary); padding-left: 15px; }
        
        .pdf-style { border: 1px dashed var(--border-glass); padding: 20px; background: rgba(255,255,255,0.02); }
      `}} />
    </div>
  )
}

export default App
