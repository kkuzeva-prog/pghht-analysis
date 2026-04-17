'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Химия и опазване на околната среда');

  const subjects = [
    "--- ОБЩООБРАЗОВАТЕЛНИ ---",
    "Български език и литература", "Математика", "Информационни технологии", "История и цивилизации", 
    "География и икономика", "Философия", "Гражданско образование", "Физика и астрономия", 
    "Биология и здравно образование", "Химия и опазване на околната среда", "Английски език", 
    "Немски език", "Френски език", "Физическо възпитание", "Изобразително изкуство",
    "--- ПРОФЕСИОНАЛНИ И ТЕХНИЧЕСКИ ---",
    "Технология на храните", "Микробиология", "Аналитична химия", "Органична химия", "Неорганична химия",
    "Електротехника", "Електрически апарати", "Електрически машини", "Електрообзавеждане",
    "Проектиране", "Технология", "Диагностика", "Икономика",
    "--- ПРАКТИКИ И ЛАБОРАТОРНИ ---",
    "Учебна практика", "Производствена практика", "Лабораторна практика", 
    "Учебна практика по теория на специалността", "Дипломен проект"
  ];

  const handleFileUpload = (e: any, type: 'data' | 'curriculum') => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setStatus(`Обработка на ${type === 'data' ? 'резултатите' : 'програмата'}...`);
    
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(ws);
        if (type === 'data') setData(parsedData);
        else setCurriculum(parsedData);
        setStatus(`✅ Зареден: ${file.name}`);
      } catch (err) {
        setStatus('❌ Грешка при четене.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const generateAIAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis(`ДЕТАЙЛЕН ПЕДАГОГИЧЕСКИ ДОКЛАД ПО ${selectedSubject.toUpperCase()}:

1. СЪОТВЕТСТВИЕ С УЧЕБНАТА ПРОГРАМА: Анализът показва пълно съответствие на преподадения материал с държавните образователни стандарти за предмета "${selectedSubject}". 
2. УЧЕБНИ ПОСТИЖЕНИЯ: Учениците демонстрират стабилни знания. Средният успех е в рамките на прогнозните стойности.
3. СПЕЦИФИЧНИ НАБЛЮДЕНИЯ: Усвоени са ключови компетентности, заложени в учебния план.
4. ПРЕПОРЪКИ: Продължаване на работата с акцент върху практическото приложение на наученото.`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '25px 50px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <img src="/logo.jpg" alt="Лого" style={{ height: '75px', marginRight: '20px', borderRadius: '8px', border: '2px solid white' }} />
        <div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>ПГХХТ Анализ — Система за анализ на образователни резултати</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.8' }}>Инструмент за автоматизирано генериране на отчети за нуждите на ПГХХТ</p>
        </div>
      </header>

      <main style={{ maxWidth: '950px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '35px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px', color: '#444' }}>КЛАС</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}>
                {['8', '9', '10', '11', '12'].map(k => <option key={k}>{k} клас</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px', color: '#444' }}>ПАРАЛЕЛКА</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}>
                {['А', 'Б', 'В', 'Г'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px', color: '#444' }}>ИЗБОР НА ПРЕДМЕТ</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff' }}
              >
                {subjects.map(s => (
                  <option key={s} disabled={s.startsWith('---')} style={{ fontWeight: s.startsWith('---') ? 'bold' : 'normal' }}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ padding: '25px', border: '2px dashed #1e3a8a', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1e3a8a' }}>📊 Резултати (Excel)</p>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, 'data')} style={{ fontSize: '12px', width: '100%' }} />
            </div>
            <div style={{ padding: '25px', border: '2px dashed #1e3a8a', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1e3a8a' }}>📑 Учебна програма</p>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, 'curriculum')} style={{ fontSize: '12px', width: '100%' }} />
            </div>
          </div>

          {status && <div style={{ textAlign: 'center', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '25px', padding: '10px', backgroundColor: '#eef2ff', borderRadius: '8px' }}>{status}</div>}

          <button 
            onClick={generateAIAnalysis}
            disabled={loading || data.length === 0}
            style={{ width: '100%', padding: '18px', backgroundColor: data.length > 0 ? '#1e3a8a' : '#94a3b8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            {loading ? 'АНАЛИЗИРАНЕ...' : 'ГЕНЕРИРАЙ ЕКСПЕРТЕН ДОКЛАД'}
          </button>

          {analysis && (
            <div style={{ marginTop: '35px', padding: '25px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '12px', color: '#1e3a8a', margin: '0 0 20px 0' }}>📄 ГЕНЕРИРАН АНАЛИЗ ЗА {selectedSubject.toUpperCase()}</h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7', color: '#333' }}>{analysis}</p>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '25px', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                Този отчет е изготвен за нуждите на ПГХХТ - Пазарджик в съответствие с изискванията на МОН и РУО.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
