'use client';

import { useState } from 'react';

export default function Page() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!sheetUrl) return alert('Моля, поставете линк!');
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.message);
      } else {
        setResult('Грешка: ' + data.error);
      }
    } catch (err) {
      setResult('Възникна техническа грешка.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1>ПГХТ Анализ — Система за отчети</h1>
      <p>Въведете линк към Google Sheet с оценките:</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="https://docs.google.com/spreadsheets/d/..."
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
        />
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Свързване...' : 'Генерирай анализ'}
        </button>
      </div>

      {result && (
        <div style={{ padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px', marginBottom: '20px', color: '#004a99' }}>
          <strong>Резултат:</strong> {result}
        </div>
      )}

      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3>Важно преди старт:</h3>
        <p>Уверете се, че сте споделили таблицата с: <br/>
        <code style={{backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px'}}>pghht-bot@the-tendril-493605-h1.iam.gserviceaccount.com</code></p>
      </div>
    </main>
  );
}
