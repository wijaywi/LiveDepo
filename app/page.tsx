'use client';
import { useState, useEffect, useRef } from 'react';
import { moss } from '../lib/moss-adapter';

// Expanded Synthetic Dataset for diverse queries
const syntheticData = [
  {
    id: "doc-402",
    text: "Email from John to Sarah. Date: Oct 12, 2023. Subject: TechNova Meeting. 'Confirming our meeting with the TechNova team next Thursday to discuss the merger.'",
    metadata: { source: "EnviroCorp Discovery Vol 4" }
  },
  {
    id: "doc-991",
    text: "Contract signed June 1, 2022. No non-compete clause included in the final draft.",
    metadata: { source: "EnviroCorp Contracts" }
  },
  {
    id: "doc-112",
    text: "Financial ledger Q3. Transferred $50,000 to offshore account ending in 8832.",
    metadata: { source: "Financial Records 2023" }
  },
  {
    id: "doc-445",
    text: "Safety inspection report. March 15. The main valve showed significant wear and tear, recommendation to replace immediately. Signed off by Chief Engineer Smith.",
    metadata: { source: "Site Maintenance Logs" }
  },
  {
    id: "doc-702",
    text: "Text message from CEO to VP: 'Destroy the Q1 emissions report before the auditors arrive.'",
    metadata: { source: "Subpoenaed Mobile Devices" }
  }
];

// Simple LLM logic to determine contradiction vs corroboration
function analyzeMatch(query: string, evidenceText: string) {
  // A real app would use Vercel AI SDK and an LLM prompt here.
  // We mock a fast heuristic based on keywords to keep the demo fully local.
  const qLower = query.toLowerCase();
  
  if (qLower.includes("never") || qLower.includes("didn't") || qLower.includes("did not") || qLower.includes("no")) {
    return {
      type: "Contradiction Detected",
      style: "bg-red-900/50 border-red-500 text-red-400",
      description: "Witness testimony contradicts the retrieved evidence.",
      followUp: `Isn't it true that the evidence says: "${evidenceText.substring(0, 50)}..."?`
    };
  }
  
  return {
    type: "Context Retrieved",
    style: "bg-yellow-900/50 border-yellow-500 text-yellow-400",
    description: "Related evidence found for current topic.",
    followUp: "Ask the witness to elaborate on this specific document."
  };
}

export default function LiveDepo() {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const [metrics, setMetrics] = useState({ search: 0, ai: 0, total: 0 });
  const [customInput, setCustomInput] = useState('');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Load documents into Moss mock
    moss.addDocs('discovery', syntheticData);

    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const finalTranscript = event.results[0][0].transcript;
          setTranscript(finalTranscript);
          analyzeClaim(finalTranscript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setAlert(null);
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setAlert(null);
    setTranscript(customInput);
    analyzeClaim(customInput);
    setCustomInput('');
  };

  const analyzeClaim = async (claim: string) => {
    const totalStart = performance.now();
    
    // 1. Moss Semantic Search
    const searchRes = await moss.search('discovery', claim);
    
    // 2. Mock AI Reasoning (Vercel AI SDK wrapper simulation)
    const aiStart = performance.now();
    await new Promise(r => setTimeout(r, 45)); // Simulate fast edge LLM
    const aiEnd = performance.now();
    
    const totalEnd = performance.now();

    if (searchRes.documents.length > 0) {
      const topDoc = searchRes.documents[0];
      const analysis = analyzeMatch(claim, topDoc.text);
      
      setAlert({
        ...analysis,
        evidence: topDoc,
      });
    } else {
      setAlert({
        type: "No Match",
        style: "bg-gray-800 border-gray-600 text-gray-400",
        description: "No contradicting or highly relevant documents found in the discovery corpus.",
        evidence: null,
        followUp: null
      });
    }

    setMetrics({
      search: searchRes.metrics.latencyMs,
      ai: Math.round(aiEnd - aiStart),
      total: Math.round(totalEnd - totalStart)
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <header className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-blue-400 tracking-tight">LiveDepo ⚖️</h1>
        <p className="text-gray-400">Zero-Latency Cross-Examination Copilot</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Live Transcript */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Live Transcript</h2>
            
            {recognitionRef.current ? (
              <button 
                onClick={toggleListening}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  isListening ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isListening ? 'Stop Listening' : '🎤 Start Live Mic'}
              </button>
            ) : (
              <span className="text-sm text-yellow-500">Mic not supported in this browser</span>
            )}
          </div>

          <div className="bg-black/50 h-48 p-4 rounded-lg overflow-y-auto font-mono text-gray-300 border border-gray-800 mb-4 shadow-inner">
            {transcript ? (
              <p><span className="text-green-400 font-bold">Witness:</span> {transcript}</p>
            ) : (
              <p className="text-gray-600 italic">Waiting for testimony...</p>
            )}
            {isListening && <span className="animate-pulse text-blue-400">_</span>}
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or type a simulated witness statement..."
              className="flex-1 bg-gray-950 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white font-medium border border-gray-700">
              Submit
            </button>
          </form>
          
          <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
            <p className="mb-1 font-semibold">Try saying/typing things like:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"I never met with the competitor in 2023."</li>
              <li>"The safety valve was in perfect condition."</li>
              <li>"I did not order the emissions report destroyed."</li>
              <li>"I don't know anything about an offshore account."</li>
            </ul>
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          {alert ? (
            <div className={`p-6 rounded-xl border animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-xl ${alert.style}`}>
              <h2 className="text-2xl font-bold mb-2">{alert.type}</h2>
              <p className="text-lg mb-4 opacity-90">{alert.description}</p>
              
              {alert.evidence && (
                <div className="bg-black/40 p-4 rounded-lg mb-4 shadow-inner">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold opacity-75">Source:</span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{alert.evidence.metadata.source}</span>
                  </div>
                  <p className="font-serif italic text-gray-100">"{alert.evidence.text}"</p>
                </div>
              )}

              {alert.followUp && (
                <div className="bg-black/20 p-4 rounded-lg border border-current/20">
                  <span className="text-sm uppercase font-bold opacity-75">Suggested Follow-up</span>
                  <p className="font-medium mt-1 text-lg">{alert.followUp}</p>
                </div>
              )}
            </div>
          ) : (
             <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-xl p-8 flex items-center justify-center h-full text-gray-600 text-center">
               Waiting for testimony to analyze...
             </div>
          )}

          {/* Latency Metrics Dashboard */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-500">Performance Instrumentation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-950 p-4 rounded-lg text-center border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Moss Retrieval</div>
                <div className="text-2xl font-mono text-green-400">{metrics.search} <span className="text-sm">ms</span></div>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg text-center border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Context Assembly</div>
                <div className="text-2xl font-mono text-blue-400">{metrics.ai} <span className="text-sm">ms</span></div>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg text-center border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Total TTFB</div>
                <div className="text-2xl font-mono text-white">{metrics.total} <span className="text-sm">ms</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
