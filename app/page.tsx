'use client';

import { useState } from 'react';

export default function Page() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    // Тук по-късно ще свържем логиката за анализ
    alert('Системата се свързва с Google Sheets...');
    setLoading(false);
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1>ПГХТ Анализ — Система за отчети</h1>
      <p>Въведете линк към Google Sheet с оценките на учениците:</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="https://docs.google.com/spreadsheets/d/..."
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Анализиране...' : 'Генерирай анализ'}
        </button>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Инструкции за учители:</h3>
        <ol>
          <li>Отворете вашата таблица в Google Sheets.</li>
          <li>Натиснете бутона <strong>Share</strong>.</li>
          <li>Добавете имейла: <code style={{backgroundColor: '#eee', padding: '2px 5px'}}>pghht-bot@the-tendril-493605-h1.iam.gserviceaccount.com</code> като <strong>Viewer</strong>.</li>
          <li>Копирайте линка на таблицата и го поставете тук.</li>
        </ol>
      </div>
    </main>
  );
}
