'use client';

import { useState } from 'react';

export default function TestLogging() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApiCall = async () => {
    setLoading(true);
    addLog('Making API call to /api/test');
    
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      addLog(`API call successful: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`API call failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testErrorApiCall = async () => {
    setLoading(true);
    addLog('Making API call with error to /api/test');
    
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shouldError: true }),
      });
      const data = await response.json();
      addLog(`API call response: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`API call failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSuccessfulPost = async () => {
    setLoading(true);
    addLog('Making successful POST to /api/test');
    
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'Hello from client', 
          userId: '12345',
          shouldError: false 
        }),
      });
      const data = await response.json();
      addLog(`POST successful: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`POST failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ 
      margin: '20px 0',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>New Relic Logging Test</h2>
      <p>Click the buttons below to test logging to New Relic:</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testApiCall}
          disabled={loading}
          style={{
            padding: '10px 15px',
            margin: '5px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Test GET API Call'}
        </button>
        
        <button 
          onClick={testSuccessfulPost}
          disabled={loading}
          style={{
            padding: '10px 15px',
            margin: '5px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Test Successful POST'}
        </button>
        
        <button 
          onClick={testErrorApiCall}
          disabled={loading}
          style={{
            padding: '10px 15px',
            margin: '5px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Test Error API Call'}
        </button>
        
        <button 
          onClick={clearLogs}
          style={{
            padding: '10px 15px',
            margin: '5px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Logs
        </button>
      </div>

      <div style={{ 
        maxHeight: '300px', 
        overflowY: 'auto',
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        <h3>Client-side Logs:</h3>
        {logs.length === 0 ? (
          <p style={{ color: '#666' }}>No logs yet. Click a button above to start testing.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {logs.map((log, index) => (
              <li key={index} style={{ 
                marginBottom: '5px',
                padding: '5px',
                backgroundColor: '#f8f9fa',
                borderRadius: '3px',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}>
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p><strong>What's being logged to New Relic:</strong></p>
        <ul style={{ fontSize: '12px' }}>
          <li>Custom events for each API call</li>
          <li>Error tracking and error details</li>
          <li>Custom metrics (API response times, call counts)</li>
          <li>Custom attributes (user agent, request IDs, etc.)</li>
          <li>Performance timing data</li>
        </ul>
      </div>
    </div>
  );
}
