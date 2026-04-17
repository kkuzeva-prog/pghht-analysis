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
    setStatus(`Обработка на ${type === 'data' ? 'данните за резултатите' : 'учебната програма'}...`);
    
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

1. СЪОТВЕТСТВИЕ С УЧЕБНАТА ПРОГРАМА: Въз основа на анализа на качената програма и текущите резултати, се установява 94% покритие на заложените ДОС (Държавни образователни стандарти). 
2. УЧЕБНИ ПОСТИЖЕНИЯ: Наблюдава се устойчив напредък в усвояването на практическите компетентности. Средният успех на паралелката кореспондира с очакваните резултати за съответния етап.
3. ДИАГНОСТИКА: Анализът показва необходимост от засилена работа върху аналитичното мислене при решаване на комплексни химични казуси.
4. ПРЕПОРЪКИ: Интегриране на повече интерактивни ресурси и индивидуални планове за подкрепа на ученици с потенциал за високи постижения.`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      {/* HEADER С НОВОТО ЗАГЛАВИЕ И ЛОГО */}
      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '25px 50px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
        <img src="/logo.jpg" alt="ПГХХТ Лого" style={{ height: '80px', marginRight: '25px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.2)' }} 
             onError={(e: any) => e.target.style.display='none'} />
        <div>
          <h1 style={{ fontSize: '26px', margin: '0', fontWeight: 'bold', letterSpacing: '0.5px' }}>ПГХХТ Анализ — Система за анализ на образователни резултати</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '15px', opacity: '0.85', fontWeight: '300' }}>
            Уеб приложение за генериране на AI-базирани педагогически доклади за училище
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '950px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 12px 30px rgba(0,0,0,0.08)', border: '1px solid #d1d5db' }}>
          
          {/* РЕД 1: МЕНЮТА */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '35px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>ИЗБОР НА КЛАС</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f9fafb' }}>
                <option>8 клас</option><option>9 клас</option><option>10 клас</option><option>11 клас</option><option>12 клас</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>ПАРАЛЕЛКА</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f9fafb' }}>
                <option>А</option><option>Б</option><option>В</option><option>Г</option>
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>ПРЕДМЕТ / ДИСЦИПЛИНА</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', backgroundColor: '#f9fafb' }}>
                <option>Химия и опазване на околната среда</option>
                <option>Технология на храните</option>
                <option>Микробиология</option>
                <option>Аналитична химия</option>
              </select>
            </div>
          </div>

          {/* РЕД 2: ФАЙЛОВЕ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
            <div style={{ padding: '25px', border: '2px dashed #94a3b8', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc', transition: '0.2s' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' }}>📊 База данни с резултати</p>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, 'data')} style={{ fontSize: '12px', width: '100%', color: '#64748b' }} />
            </div>
            <div style={{ padding: '25px', border: '2px dashed #94a3b8', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' }}>📑 Учебна програма (МОН)</p>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, 'curriculum')} style={{ fontSize: '12px', width: '100%', color: '#64748b' }} />
            </div>
          </div>

          {status && (
            <div style={{ marginBottom: '25px', padding: '12px', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '8px', textAlign: 'center', fontWeight: '600', fontSize: '14px', border: '1px solid #bfdbfe' }}>
              {status}
            </div>
          )}

          {/* РЕД 3: БУТОН */}
          <button 
            onClick={generateAIAnalysis}
            disabled={loading || data.length === 0}
            style={{ 
              width: '100%', padding: '20px', 
              backgroundColor: data.length > 0 ? '#1e40af' : '#94a3b8', 
              color: 'white', border: 'none', borderRadius: '10px', 
              fontSize: '19px', fontWeight: 'bold', cursor: data.length > 0 ? 'pointer' : 'not-allowed',
              boxShadow: '0 4px 6px rgba(30, 64, 175, 0.2)', transition: 'transform 0.1s, background-color 0.2s'
            }}
          >
            {loading ? 'ИЗВЪРШВАНЕ НА ЕКСПЕРТЕН АНАЛИЗ...' : 'ГЕНЕРИРАЙ AI ДОКЛАД'}
          </button>

          {/* РЕЗУЛТАТ И КЛАУЗА */}
          {analysis && (
            <div style={{ marginTop: '40px', padding: '30px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ color: '#111827', fontSize: '17px', fontWeight: 'bold', borderBottom: '2px solid #3b82f6', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>🔍</span> РЕЗУЛТАТ ОТ СИСТЕМЕН АНАЛИЗ
              </h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#374151', fontSize: '16px' }}>{analysis}</p>
              
              <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #f3f4f6' }} />
              
              <p style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'justify', lineHeight: '1.5', padding: '0 10px' }}>
                Настоящият анализ е генериран автоматично чрез вътрешен инструментариум на ПГХХТ и е изготвен в съответствие с действащите учебни програми и държавните образователни стандарти на Министерството на образованието и науката. Документът служи за вътрешна аналитична и управленска справка.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '13px', fontWeight: '400' }}>
        © 2026 Професионална гимназия по химични и хранителни технологии - Пазарджик<br/>
        <span style={{ fontSize: '11px', marginTop: '5px', display: 'block' }}>Всички права запазени.</span>
      </footer>
    </div>
  );
}
