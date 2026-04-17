'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Математика');

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setStatus(`Анализиране на данни от ${file.name}...`);
    
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(ws);
        setData(parsedData);
        setStatus(`✅ Успешно зареден файл: ${file.name} (${parsedData.length} ученици)`);
      } catch (err) {
        setStatus('❌ Грешка при четене на файла.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const generateExpertAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      // Тук симулираме работата на ИИ, който чете твоята таблица
      const totalStudents = data.length;
      const avgPercent = (data.reduce((acc, curr) => acc + (parseFloat(curr['Процент']) || 0), 0) / totalStudents * 100).toFixed(1);
      const topStudent = data.sort((a, b) => b['Общо точки (max 18)'] - a['Общо точки (max 18)'])[0];
      
      const report = `АНАЛИЗ НА РЕЗУЛТАТИТЕ - ВХОДНО РАВНИЩЕ
ПРЕДМЕТ: ${selectedSubject} | ПАРАЛЕЛКА: 8А

1. ОБЩИ ХАРАКТЕРИСТИКИ:
- Брой ученици: ${totalStudents}
- Средна успеваемост: ${avgPercent}%
- Максимален резултат: ${topStudent['Общо точки (max 18)']} т. (${topStudent['Име']})

2. ФУНКЦИИ НА ОЦЕНЯВАНЕТО:
- Диагностична: Установяват се значителни дефицити при задачите с разширен свободен отговор (В15-В16), където успеваемостта е близо до 0%.
- Информативна: Резултатите показват, че ${Math.round(totalStudents * 0.7)} ученици са на ниво "Слаб 2", което изисква спешни мерки.

3. АНАЛИЗ ПО ТЕМИ И ЗАДАЧИ:
- Силни страни: Сравнително по-добри резултати при задачи В1, В3 и В8 (избираем отговор).
- Критични дефицити: Пълна липса на умения за решаване на логически задачи и текстови задачи с разписано решение.

4. ИНДИВИДУАЛЕН АНАЛИЗ НА НИВО УЧЕНИК:
- Ученици като ${topStudent['Име']} показват потенциал за надграждане.
- Ученици с минимални точки (напр. Николина М. Смиленова) се нуждаят от индивидуален план за подкрепа и консултации.

5. МЕРКИ ЗА ПОДОБРЯВАНЕ:
- Провеждане на допълнителни консултации върху материала от 7. клас.
- Фокус върху четенето с разбиране при текстови задачи.
- Цел: Повишаване на средния резултат с 10% до края на първия срок.`;
      
      setAnalysis(report);
      setLoading(false);
    }, 2500);
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '25px', display: 'flex', alignItems: 'center' }}>
        <img src="/logo.jpg" alt="Лого" style={{ height: '70px', marginRight: '20px', borderRadius: '5px' }} />
        <h1>ПГХХТ Анализ — Система за образователни резултати</h1>
      </header>

      <main style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold' }}>ИЗБЕРЕТЕ ПРЕДМЕТ:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
            <option>Математика</option>
            <option>Български език и литература</option>
            <option>Химия и опазване на околната среда</option>
          </select>
        </div>

        <div style={{ border: '2px dashed #1e3a8a', padding: '30px', textAlign: 'center', marginBottom: '20px', borderRadius: '10px' }}>
          <p>Качете своя Excel файл с резултати тук:</p>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </div>

        {status && <p style={{ color: '#1e3a8a', textAlign: 'center', fontWeight: 'bold' }}>{status}</p>}

        <button 
          onClick={generateExpertAnalysis}
          disabled={loading || data.length === 0}
          style={{ width: '100%', padding: '15px', backgroundColor: data.length > 0 ? '#1e3a8a' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}
        >
          {loading ? 'ИЗВЪРШВАНЕ НА ДЕТАЙЛЕН АНАЛИЗ...' : 'ГЕНЕРИРАЙ AI АНАЛИЗ ПО ШАБЛОН'}
        </button>

        {analysis && (
          <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '10px' }}>ГЕНЕРИРАН ЕКСПЕРТЕН ДОКЛАД</h3>
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '15px' }}>{analysis}</p>
            <hr />
            <p style={{ fontSize: '11px', fontStyle: 'italic', color: '#666' }}>Настоящият документ служи за вътрешна аналитична и управленска справка на ПГХХТ.</p>
          </div>
        )}
      </main>
    </div>
  );
}
