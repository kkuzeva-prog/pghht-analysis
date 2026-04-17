'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState('');

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setStatus('Обработка на файла...');
    
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(ws);
        setData(parsedData);
        setStatus(`✅ Успешно зареден отчет с ${parsedData.length} записа.`);
      } catch (err) {
        setStatus('❌ Грешка при четене на файла. Моля, използвайте Excel формат.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER / LOGO SECTION */}
      <header className="bg-blue-900 text-white p-6 shadow-lg text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Тук ще стои твоето лого */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 text-blue-900 font-bold text-2xl">
            ПГХТ
          </div>
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Система за интелигентен педагогически анализ
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-blue-600">
          <p className="text-gray-600 mb-6 text-center">
            Инструмент за автоматизирано генериране на отчети и анализи за нуждите на РУО.
          </p>

          {/* UPLOAD SECTION */}
          <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload}
              className="hidden" 
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <span className="text-blue-600 font-bold block text-lg mb-2">Изберете файл от компютъра</span>
              <span className="text-gray-400 text-sm italic">(Excel файлове .xlsx)</span>
            </label>
          </div>

          {status && (
            <div className={`mt-6 p-4 rounded-lg text-center font-medium ${status.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              {status}
            </div>
          )}

          {data.length > 0 && (
            <button 
              onClick={() => setAnalysis('Тук ще се появи AI анализа след секунди...')}
              className="w-full mt-8 bg-blue-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-blue-700 shadow-lg transform hover:-translate-y-1 transition"
            >
              ГЕНЕРИРАЙ АНАЛИЗ ЗА РУО
            </button>
          )}

          {/* ANALYSIS DISPLAY */}
          {analysis && (
            <div className="mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-inner">
              <h3 className="text-blue-900 font-bold mb-4 border-b border-yellow-200 pb-2">РЕЗУЛТАТ ОТ AI АНАЛИЗ:</h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{analysis}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-10 text-center text-gray-400 text-sm pb-10">
        © 2026 ПГХТ - Пазарджик. Разработено за целите на РУО.
      </footer>
    </div>
  );
}
