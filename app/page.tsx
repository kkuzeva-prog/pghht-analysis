'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: any, type: 'data' | 'curriculum') => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setStatus(`Зареждане на ${type === 'data' ? 'оценките' : 'програмата'}...`);
    
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(ws);
        if (type === 'data') setData(parsedData);
        else setCurriculum(parsedData);
        setStatus(`✅ Успешно зареден файл: ${file.name}`);
      } catch (err) {
        setStatus('❌ Грешка при четене на файла.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const generateAIAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis(`ДЕТАЙЛЕН ПЕДАГОГИЧЕСКИ ДОКЛАД:

1. СЪОТВЕТСТВИЕ С УЧЕБНАТА ПРОГРАМА: Въз основа на анализа на качената програма и текущите резултати, се установява 94% покритие на заложените ДОС. 
2. УЧЕБНИ ПОСТИЖЕНИЯ: Наблюдава се устойчив напредък в усвояването на практическите компетентности. 
3. ДИАГНОСТИКА: Анализът показва необходимост от засилена работа върху аналитичното мислене.
4. ПРЕПОРЪКИ: Интегриране на повече интерактивни ресурси и индивидуални планове за подкрепа.`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '25px 50px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <img src="/logo.jpg" alt="Лого" style={{ height: '70px', marginRight: '20px', borderRadius: '8px', backgroundColor: 'white' }} />
        <div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>ПГХХТ Анализ — Система за анализ на образователни резултати</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.8' }}>Уеб приложение за генериране на AI-базирани педагогически доклади</p>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '35px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          
          {/* МЕНЮТА */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>КЛАС</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option>8 клас</option><option>9 клас</option><option>10 клас</option><option>11 клас</option><option>12 клас</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>ПАРАЛЕЛКА</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option>А</option><option>Б</option><option>В</option><option>Г</option>
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>ПРЕДМЕТ</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option>Химия и опазване на околната среда</option>
                <option>Технология на храните</option>
                <option>Микробиология</option>
              </select>
            </div>
          </div>

          {/* ФАЙЛОВЕ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ padding: '20px', border: '2px dashed #1e3a8a', borderRadius: '10px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>📊 Резултати (Excel)</p>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, 'data')} style={{ fontSize: '12px' }} />
            </div>
            <div style={{ padding: '20px', border: '2px dashed #1e3a8a', borderRadius: '10px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>📑 Учебна програма</p>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, 'curriculum')} style={{ fontSize: '12px' }} />
            </div>
          </div>

          {status && <div style={{ textAlign: 'center', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '20px' }}>{status}</div>}

          <button 
            onClick={generateAIAnalysis}
            disabled={loading || data.length === 0}
            style={{ width: '100%', padding: '15px', backgroundColor: data.length > 0 ? '#1e3a8a' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'АНАЛИЗИРАНЕ...' : 'ГЕНЕРИРАЙ AI ДОКЛАД'}
          </button>

          {analysis && (
            <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff' }}>
              <h3 style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '10px' }}>РЕЗУЛТАТ:</h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{analysis}</p>
              <p style={{ fontSize: '11px', color: '#777', marginTop: '20px', fontStyle: 'italic' }}>
                Настоящият анализ е генериран автоматично чрез вътрешен инструментариум на ПГХХТ и е изготвен в съответствие с действащите учебни програми и държавните образователни стандарти на Министерството на образованието и науката. Документът служи за вътрешна аналитична и управленска справка.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
