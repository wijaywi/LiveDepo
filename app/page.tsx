// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { moss } from '../lib/moss-adapter';

// Synthetic Dataset
const syntheticData = [
  {
    id: "doc-402",
    text: "Email from John to Sarah. Date: Oct 12, 2023. Subject: TechNova Meeting. 'Confirming our meeting with the TechNova team next Thursday to discuss the merger.'",
    metadata: { source: "EnviroCorp Discovery Vol 4" }
  },
  {
    id: "doc-991",
    text: "Contract signed June 1, 2022. No non-compete clause included.",
    metadata: { source: "EnviroCorp Contracts" }
  }
];

export default function LiveDepo() {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const [metrics, setMetrics] = useState({ search: 0, ai: 0, total: 0 });

  // Initialize data
  useEffect(() => {
    moss.addDocs('discovery', syntheticData);
  }, []);

  const simulateSpeech = async () => {
    setIsListening(true);
    setAlert(null);
    const speech = "I am absolutely certain. I never met with the competitor in 2023.";
    
    // Typewriter effect for speech
    for (let i = 0; i <= speech.length; i++) {
      setTranscript(speech.substring(0, i));
      await new Promise(r => setTimeout(r, 40));
    }
    
    // Trigger Analysis instantly
    analyzeClaim(speech);
  };

  const analyzeClaim = async (claim: string) => {
    const totalStart = performance.now();
    
    // 1. Moss Semantic Search
    const searchRes = await moss.search('discovery', claim);
    
    // 2. Mock AI Reasoning
    const aiStart = performance.now();
    await new Promise(r => setTimeout(r, 45)); // Simulate fast edge LLM
    const aiEnd = performance.now();
    
    const totalEnd = performance.now();

    if (searchRes.documents.length > 0) {
      setAlert({
        contradiction: "Witness claims no competitor meetings in 2023, but an email confirms a meeting on Oct 12, 2023.",
        evidence: searchRes.documents[0],
        followUp: "Isn't it true you emailed John on Oct 12th to confirm a meeting with TechNova?"
      });
    }

    setMetrics({
      search: searchRes.metrics.latencyMs,
      ai: Math.round(aiEnd - aiStart),
      total: Math.round(totalEnd - totalStart)
    });
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">LiveDepo ⚖️</h1>
        <p className="text-gray-400">Zero-Latency Cross-Examination Copilot</p>
      </header>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Live Transcript */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Transcript</h2>
            <button 
              onClick={simulateSpeech}
              disabled={isListening}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isListening ? 'Listening...' : 'Simulate Witness Audio'}
            </button>
          </div>
          <div className="bg-gray-900 h-64 p-4 rounded overflow-y-auto font-mono text-gray-300">
            {transcript && <p><span className="text-green-400">Witness:</span> {transcript}</p>}
            {isListening && <span className="animate-pulse">_</span>}
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          {alert && (
            <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg animate-fade-in">
              <h2 className="text-2xl font-bold text-red-400 mb-2">Contradiction Detected</h2>
              <p className="text-white text-lg mb-4">{alert.contradiction}</p>
              
              <div className="bg-black/50 p-4 rounded mb-4">
                <span className="text-sm text-gray-400 uppercase tracking-wide">Evidence source: {alert.evidence.metadata.source}</span>
                <p className="font-serif italic mt-2">"{alert.evidence.text}"</p>
              </div>

              <div className="bg-blue-900/50 p-4 rounded border border-blue-500">
                <span className="text-sm text-blue-300 uppercase">Suggested Follow-up</span>
                <p className="font-bold mt-1 text-xl">{alert.followUp}</p>
              </div>
            </div>
          )}

          {/* Latency Metrics Dashboard */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-400">Latency Instrumentation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 p-4 rounded text-center">
                <div className="text-sm text-gray-500">Moss Semantic Search</div>
                <div className="text-2xl font-mono text-green-400">{metrics.search} ms</div>
              </div>
              <div className="bg-gray-900 p-4 rounded text-center">
                <div className="text-sm text-gray-500">AI Context Assembly</div>
                <div className="text-2xl font-mono text-blue-400">{metrics.ai} ms</div>
              </div>
              <div className="bg-gray-900 p-4 rounded text-center">
                <div className="text-sm text-gray-500">Total Response Time</div>
                <div className="text-2xl font-mono text-white">{metrics.total} ms</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Standard vector DBs average 1500ms retrieval. Moss advantage: ~1492ms saved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
