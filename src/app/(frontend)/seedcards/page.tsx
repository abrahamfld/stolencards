'use client'
import config from '@payload-config';
import { getPayload } from 'payload';
import { useState } from 'react';

export default function SeedPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleSeed = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const cards = JSON.parse(jsonInput);

    const res = await fetch('/my-route/seedcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cards),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Unknown error');
    }

    setResults(data.results);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Seed Credit Cards</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="json-input" style={{ display: 'block', marginBottom: '8px' }}>
          Paste your credit cards JSON array:
        </label>
        <textarea
          id="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          style={{
            width: '100%',
            height: '200px',
            fontFamily: 'monospace',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          placeholder={`[
  {
    "type": "VISA",
    "number": "4111111111111111",
    "expiry": "12/25",
    "cvv": 123,
    "balance": 1000,
    "price": 9.99,
    "country": "USA",
    "ownerName": "John Doe"
  },
  // ... more cards
]`}
        />
      </div>

      <button
        onClick={handleSeed}
        disabled={isLoading || !jsonInput.trim()}
        style={{
          padding: '10px 20px',
          background: isLoading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Seeding...' : 'Seed Cards'}
      </button>

      {error && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          background: '#ffebee',
          borderLeft: '4px solid #f44336',
          color: '#d32f2f'
        }}>
          <h3>Error</h3>
          <pre>{error}</pre>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Results</h2>
          <div style={{ 
            marginTop: '10px',
            display: 'grid',
            gap: '10px'
          }}>
            {results.map((result, index) => (
              <div 
                key={index}
                style={{
                  padding: '15px',
                  background: result.success ? '#e8f5e9' : '#ffebee',
                  borderLeft: `4px solid ${result.success ? '#4caf50' : '#f44336'}`,
                  borderRadius: '4px'
                }}
              >
                {result.success ? (
                  <>
                    <h3>✅ Card created successfully</h3>
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </>
                ) : (
                  <>
                    <h3>❌ Failed to create card</h3>
                    <p>Error: {result.error}</p>
                    <pre>{JSON.stringify(result.card, null, 2)}</pre>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}