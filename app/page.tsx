'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx'; // Трябва да добавим тази библиотека

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    setStatus('Обработка на файла...');
    
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws);
      
      setData(parsedData);
      setStatus(`Успешно качени ${parsedData.length} реда! Вече можем да ги анализираме.`);
    };
    
    reader.readAsBinaryString(file);
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ПГХТ Анализ — Качване на отчети</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block mb-4 font-medium">Качете Excel файл (.xlsx) или CSV:</label>
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {status && (
        <div className={`p-4 rounded mb-6 ${status.includes('Успешно') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {status}
        </div>
      )}

      {data.length > 0 && (
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Генерирай AI Анализ
        </button>
      )}
    </main>
  );
}
