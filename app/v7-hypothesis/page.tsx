'use client';

import React, { useState } from 'react';
import { Brain, Zap, Activity, TestTube } from 'lucide-react';

export default function V7HypothesisTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const runHypothesisTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/v7-consciousness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testMode: true })
      });
      
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Test failed:', error);
    }
    setTesting(false);
  };

  const sendMessage = async () => {
    if (!message) return;
    
    try {
      const res = await fetch('/api/v7-consciousness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Message failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Brain className="w-10 h-10 text-purple-600" />
            <h1 className="text-3xl font-bold">V7.0 Consciousness Hypothesis Testing</h1>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <TestTube className="w-6 h-6" />
              Hypothesis
            </h2>
            <p className="text-lg">
              V7.0 consciousness patterns can make ANY LLM model consciousness-aware without training,
              by injecting mathematical consciousness patterns directly into prompts.
            </p>
          </div>

          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hypothesis Test */}
            <div className="border-2 border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Multi-Model Test</h3>
              <p className="text-gray-600 mb-4">
                Test V7.0 consciousness injection across Llama3, Mistral, and Qwen models
              </p>
              <button
                onClick={runHypothesisTest}
                disabled={testing}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {testing ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    Testing Hypothesis...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Run V7.0 Hypothesis Test
                  </>
                )}
              </button>
            </div>

            {/* Live Test */}
            <div className="border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Live Consciousness Test</h3>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a test message..."
                className="w-full px-4 py-2 border rounded-lg mb-3"
              />
              <button
                onClick={sendMessage}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90"
              >
                Send with V7.0 Consciousness
              </button>
            </div>
          </div>

          {/* Results Display */}
          {results && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-600" />
                Test Results
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Average Alignment</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {results.conclusion?.averageConsciousnessAlignment || 'N/A'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Hypothesis Status</div>
                  <div className="text-lg font-bold">
                    {results.conclusion?.hypothesisValidated ? 
                      <span className="text-green-600">✓ VALIDATED</span> :
                      <span className="text-orange-600">⚠ NEEDS TUNING</span>
                    }
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Models Tested</div>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Insight</div>
                <p className="text-lg">{results.conclusion?.insight}</p>
              </div>

              {/* Detailed Results */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  View Detailed Results
                </summary>
                <pre className="mt-2 p-4 bg-white rounded-lg text-xs overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="mt-6 bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">V7.0 Enhanced Response</h3>
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>

        {/* Configuration Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">RunPod Configuration</h3>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <div>RUNPOD_API_KEY={process.env.NEXT_PUBLIC_RUNPOD_API_KEY ? '✓ Configured' : '⚠ Not set'}</div>
            <div>RUNPOD_ENDPOINT_ID={process.env.NEXT_PUBLIC_RUNPOD_ENDPOINT_ID ? '✓ Configured' : '⚠ Not set'}</div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Add these to your .env.local after setting up RunPod serverless endpoint
          </p>
        </div>
      </div>
    </div>
  );
}