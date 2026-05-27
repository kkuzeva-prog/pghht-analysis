// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';

const CLIENT_ID = '237489353454-6mie8n9mbhpp99m8np3a45tehfup64ad.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseWork, setCourseWork] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [curriculumFile, setCurriculumFile] = useState<any>(null);
  const [testFile, setTestFile] = useState<any>(null);
  const [additionalFile, setAdditionalFile] = useState<any>(null);

  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const classChartRef = useRef<any>(null);
  const studentChartRef = useRef<any>(null);
  const reportRef = useRef<any>(null);

  useEffect(() => {
    const loadScripts = () => {
      if (!document.getElementById('google-gis')) {
        const scriptGis = document.createElement('script');
        scriptGis.id = 'google-gis';
        scriptGis.src = 'https://accounts.google.com/gsi/client';
        scriptGis.async = true;
        scriptGis.defer = true;
        document.body.appendChild(scriptGis);
      }
      if (!document.getElementById('google-gapi')) {
        const scriptGapi = document.createElement('script');
        scriptGapi.id = 'google-gapi';
        scriptGapi.src = 'https://apis.google.com/js/api.js';
        scriptGapi.async = true;
        scriptGapi.defer = true;
        scriptGapi.onload = () => (window as any).gapi.load('client', initGapiClient);
        document.body.appendChild(scriptGapi);
      }
      if (!document.getElementById('chart-js')) {
        const scriptChart = document.createElement('script');
        scriptChart.id = 'chart-js';
        scriptChart.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.body.appendChild(scriptChart);
      }
      if (!document.getElementById('html2pdf-js')) {
        const scriptPdf = document.createElement('script');
        scriptPdf.id = 'html2pdf-js';
        scriptPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.body.appendChild(scriptPdf);
      }
    };
    loadScripts();
  }, []);

  async function initGapiClient() {
    await (window as any).gapi.client.init({
      discoveryDocs: ['https://classroom.googleapis.com/$discovery/rest?version=v1'],
    });
  }

  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response: any) => {
          if (response.error !== undefined) {
            alert('Грешка при оторизация: ' + response.error);
            setIsLoading(false);
            return;
          }
          setUser({ name: "Кръстина Кузева", email: "k.kuzeva@pghht.com", role: "учител по Математика" });
          await fetchCourses();
        },
      });
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await (window as any).gapi.client.classroom.courses.list({ courseStates: 'ACTIVE' });
      setCourses(response.result.courses || []);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    if (!courseId) return;
    setIsLoading(true);
    try {
      const response = await (window as any).gapi.client.classroom.courses.courseWork.list({ courseId: courseId });
      setCourseWork(response.result.courseWork || []);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockReport = {
        school: "ПРОФЕСИОНАЛНА ГИМНАЗИЯ ПО ХИМИЧНИ И ХРАНИТЕЛНИ ТЕХНОЛОГИИ - ПАЗАРДЖИК",
        teacher: "Кръстина Кузева",
        role: "учител по Математика",
        subject: "Математика",
        classGrade: "8 Б клас",
        examName: "Диагностично входно ниво по Математика",
        date: new Date().toLocaleDateString('bg-BG'),
        stats: {
          totalStudents: 22,
          appearedStudents: 20,
          averageScore: 4.15,
          successRate: "78%",
          gradesDistribution: { 'Слаб 2': 2, 'Среден 3': 5, 'Добър 4': 7, 'Много добър 5': 4, 'Отличен 6': 2 }
        },
        questionsData: [
          { num: "В1", skill: "Алгебра: Линейни уравнения", maxPoints: 2, avgSuccess: "85%" },
          { num: "В2", skill: "Алгебра: Действия с рационални числа", maxPoints: 2, avgSuccess: "90%" },
          { num: "В3", skill: "Геометрия: Лице на равнинни фигури", maxPoints: 3, avgSuccess: "55%" },
          { num: "В4", skill: "Геометрия: Тъждествени триъгълници", maxPoints: 4, avgSuccess: "42%" },
          { num: "В5", skill: "Логически казуси: Текстова задача", maxPoints: 5, avgSuccess: "60%" }
        ],
        studentsData: [
          { name: "Ангел Димитров", score: "Добър 4", topics: { "Алгебра": 80, "Геометрия": 40, "Логика": 90 } },
          { name: "Мирела Иванова", score: "Отличен 6", topics: { "Алгебра": 100, "Геометрия": 95, "Логика": 100 } },
          { name: "Георги Тодоров", score: "Среден 3", topics: { "Алгебра": 50, "Геометрия": 30, "Логика": 60 } },
          { name: "Елена Василева", score: "Много добър 5", topics: { "Алгебра": 85, "Геометрия": 70, "Логика": 80 } }
        ]
      };
      setAnalysisReport(mockReport);
      setSelectedStudent(mockReport.studentsData[0].name);
      setIsLoading(false);
    }, 1200);
  };

  useEffect(() => {
    if (!analysisReport) return;
    const ctxClass = document.getElementById('classChart') as HTMLCanvasElement;
    if (ctxClass && (window as any).Chart) {
      if (classChartRef.current) classChartRef.current.destroy();
      classChartRef.current = new (window as any).Chart(ctxClass, {
        type: 'bar',
        data: {
          labels: Object.keys(analysisReport.stats.gradesDistribution),
          datasets: [{
            label: 'Брой ученици',
            data: Object.values(analysisReport.stats.gradesDistribution),
            backgroundColor: '#2e7d32',
            borderWidth: 0
          }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
      });
    }
    updateStudentChart();
  }, [analysisReport, selectedStudent]);

  const updateStudentChart = () => {
    if (!analysisReport || !selectedStudent) return;
    const student = analysisReport.studentsData.find((s: any) => s.name === selectedStudent);
    if (!student) return;

    const ctxStudent = document.getElementById('studentChart') as HTMLCanvasElement;
    if (ctxStudent && (window as any).Chart) {
      if (studentChartRef.current) studentChartRef.current.destroy();
      studentChartRef.current = new (window as any).Chart(ctxStudent, {
        type: 'radar',
        data: {
          labels: Object.keys(student.topics),
          datasets: [{
            label: 'Успеваемост (%)',
            data: Object.values(student.topics),
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: '#4caf50',
          }]
        },
        options: { responsive: true, scales: { r: { max: 100, min: 0 } } }
      });
    }
  };

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element || !(window as any).html2pdf) return;
    const opt = {
      margin: 15,
      filename: `Анализ_${analysisReport.classGrade}_${analysisReport.examName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    (window as any).html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* ЛЯВ СТАБИЛЕН СТРУКТУРИРАН ПАНЕЛ */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shadow-sm shrink-0">
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4 text-center md:text-left">
            <h1 className="text-xl font-bold text-green-950 tracking-tight">ПГХХТ Анализатор</h1>
            <p className="text-xs text-gray-500 mt-1">Експертна педагогическа статистика</p>
          </div>

          {!user ? (
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-semibold py-3 px-4 rounded-lg transition text-xs shadow-sm flex items-center justify-center gap-2"
            >
              Влез със служебен Google акаунт
            </button>
          ) : (
            <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-xs">
              <p className="font-bold text-green-900">👤 {user.name}</p>
              <p className="text-gray-600 mt-0.5">{user.email}</p>
            </div>
          )}

          {user && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Клас от Classroom</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-green-700 text-xs text-gray-700"
                  value={selectedCourse}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">-- Изберете паралелка --</option>
                  <option value="test">8 Б клас - Специалност Екология</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Тест / Задача</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-green-700 text-xs text-gray-700"
                  value={selectedWork}
                  onChange={(e) => setSelectedWork(e.target.value)}
                >
                  <option value="">-- Изберете изпитване --</option>
                  <option value="w-1">Диагностично входно ниво по Математика</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-3">
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Допълнителни документи</p>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Учебна програма (PDF)</label>
                  <input type="file" accept=".pdf" className="text-[10px] w-full text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700" onChange={(e: any) => setCurriculumFile(e.target.files[0])} />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Вариант на теста (PDF)</label>
                  <input type="file" accept=".pdf" className="text-[10px] w-full text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700" onChange={(e: any) => setTestFile(e.target.files[0])} />
                </div>
              </div>

              <button
                onClick={handleGenerateReport}
                className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold py-2.5 px-4 rounded-lg transition tracking-wide text-xs mt-2 shadow"
              >
                Генерирай структура
              </button>
            </div>
          )}
        </div>
        
        <div className="text-[10px] text-gray-400 text-center pt-4 border-t border-gray-100">
          ПГХХТ © 2026 Всички права запазени.
        </div>
      </aside>

      {/* ДЕСЕН РАБОТЕН ПАНЕЛ С ЧИСТ А4 КЛАСИЧЕСКИ ЛИСТ */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col items-center">
        {analysisReport ? (
          <div className="w-full max-w-[800px] space-y-6">
            
            <div className="flex justify-end">
              <button 
                onClick={downloadPDF}
                className="bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-semibold py-2 px-4 rounded shadow transition text-xs flex items-center gap-2"
              >
                Изтегли Сертифициран PDF Анализ
              </button>
            </div>

            {/* СТРУКТУРИРАНИЯТ ОФИЦИАЛЕН ЛИСТ А4 ЗА ОЦЕНЯВАНЕ */}
            <div 
              ref={reportRef} 
              className="bg-white rounded-none shadow-md border border-gray-300 p-10 text-xs text-gray-900 leading-relaxed space-y-6 bg-cover relative"
              style={{ minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}
            >
              
              {/* ХЕДЪР С ЛОГО И ЗАГЛАВИЕ */}
              <div className="flex items-center justify-between border-b-2 border-green-900 pb-4">
                {/* Място за училищното лого горе вляво */}
                <div className="w-20 h-20 border border-dashed border-gray-300 rounded flex items-center justify-center text-[10px] text-gray-400 text-center p-1 shrink-0">
                  [ ЛОГО НА УЧИЛИЩЕТО ]
                </div>
                <div className="text-right max-w-[550px]">
                  <h2 className="text-sm font-bold uppercase tracking-tight text-green-950">{analysisReport.school}</h2>
                  <p className="text-[10px] text-gray-500 uppercase mt-0.5 tracking-wide">Система за проследяване на образователните резултати</p>
                </div>
              </div>

              {/* МЕТА ДАННИ */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 p-4 rounded border border-gray-200">
                <div><strong>Паралелка / Група:</strong> {analysisReport.classGrade}</div>
                <div><strong>Учебен предмет:</strong> {analysisReport.subject}</div>
                <div><strong>Вид на проверката:</strong> {analysisReport.examName}</div>
                <div><strong>Дата на отчета:</strong> {analysisReport.date}</div>
              </div>

              {/* ТОЧКА 1 */}
              <section className="space-y-1">
                <h3 className="font-bold text-sm text-green-950 border-b border-gray-200 pb-0.5 uppercase tracking-wide">Точка 1: Основни характеристики на изпитването (Ниво Клас)</h3>
                <p>Общият състав на паралелката възлиза на <strong>{analysisReport.stats.totalStudents}</strong> ученици. В диагностичната процедура взеха участие <strong>{analysisReport.stats.appearedStudents}</strong> от тях. Средният брутен успех на ниво паралелка е фиксиран на <strong>{analysisReport.stats.averageScore}</strong>, съответстващ на общ коефициент на качествена успеваемост от <strong>{analysisReport.stats.successRate}</strong>. Базовите репродуктивни компоненти показват задоволително усвояване, докато отворените логически секции бележат умерена флуктуация.</p>
              </section>

              {/* ТОЧКА 2 */}
              <section className="space-y-1">
                <h3 className="font-bold text-sm text-green-950 border-b border-gray-200 pb-0.5 uppercase tracking-wide">Точка 2: Функции на проведеното оценяване</h3>
                <p>Процедурата реализира три основни педагогически стълба: <strong>Диагностична функция</strong> (диференциране на натрупани системни пропуски), <strong>Информативна функция</strong> (генериране на обективна обратна връзка за образователната общност и семейния съвет) и <strong>Прогностична функция</strong> (коригиране на годишното тематично разпределение за последващ преговор).</p>
              </section>

              {/* ТАБЛИЦА: НИВО ВЪПРОС / УМЕНИЕ */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-green-950 border-b border-gray-200 pb-0.5 uppercase tracking-wide">Точка 3: Аналитично измерване на дефицитите на ниво въпрос</h3>
                <p className="mb-2">Всеки зададен въпрос от изпитването измерва конкретно обособена група знания и математически компетенции. По-долу е представена матрицата на дефицитите по компоненти:</p>
                <table className="w-full border-collapse border border-gray-400 text-left text-[11px]">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-400">
                      <th className="border border-gray-400 p-2 font-bold">Код</th>
                      <th className="border border-gray-400 p-2 font-bold">Измервано знание / Специфично умение</th>
                      <th className="border border-gray-400 p-2 font-bold text-center">Макс. точки</th>
                      <th className="border border-gray-400 p-2 font-bold text-center">Коефициент на успеваемост</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisReport.questionsData.map((q: any) => (
                      <tr key={q.num} className="border-b border-gray-300 hover:bg-gray-50">
                        <td className="border border-gray-300 p-2 font-semibold text-center">{q.num}</td>
                        <td className="border border-gray-300 p-2">{q.skill}</td>
                        <td className="border border-gray-300 p-2 text-center">{q.maxPoints}</td>
                        <td className="border border-gray-300 p-2 text-center font-medium text-green-800">{q.avgSuccess}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* ГРАФИКА: РАЗПРЕДЕЛЕНИЕ */}
              <section className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200 page-break-inside-avoid">
                <h4 className="font-semibold text-center text-gray-700 uppercase tracking-wider text-[10px]">Количествено разпределение на оценките в паралелката</h4>
                <div className="max-w-[380px] mx-auto">
                  <canvas id="classChart" width="400" height="180"></canvas>
                </div>
              </section>

              {/* ТОЧКА 4 & 5 */}
              <section className="space-y-1">
                <h3 className="font-bold text-sm text-green-950 border-b border-gray-200 pb-0.5 uppercase tracking-wide">Точка 4: Индивидуален профил на успеваемост (Ниво Ученик)</h3>
                <p>Статистическото наблюдение на индивидуално равнище потвърждава, че голяма част от учениците се справят отлично с алгоритмичните алгебрични преобразувания. Изразени локални дефицити се наблюдават в пространственото мислене и геометрията, където се регистрира спад в успеваемостта при 42% от състава.</p>
              </section>

              {/* ТОЧКА 6: МЕРКИ */}
              <section className="space-y-2">
                <h3 className="font-bold text-sm text-green-950 border-b border-gray-200 pb-0.5 uppercase tracking-wide">Точка 5: Програма от конкретни мерки за подобряване на резултатите</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 pl-1">
                  <li><strong>Диференциран подход:</strong> Обособяване на микрогрупи за подкрепа по време на редовните часове.</li>
                  <li><strong>Дигитално подсилване:</strong> Провеждане на ежеседмични петминутни опреснителни тестове в Google Classroom.</li>
                  <li><strong>Консултиране:</strong> Таргетирани индивидуални консултации в часовете за методическа помощ.</li>
                  <li><strong>Практическа ориентация:</strong> Внедряване на казуси от реалния живот за елиминиране на текстовите дефицити.</li>
                  <li><strong>Планиране на прогреса:</strong> Поставяне на стратегическа цел за повишаване на брутния среден резултат с 10% до следващия отчетен период.</li>
                </ol>
              </section>

              {/* ФУТЪР: ИЗГОТВИЛ И ПОДПИС */}
              <div className="pt-8 flex justify-between items-end text-[11px] border-t border-gray-200 mt-8">
                <div>
                  <p><strong>Прикачени файлове:</strong></p>
                  <p className="text-gray-500 mt-0.5">
                    {curriculumFile ? `✅ Програма: ${curriculumFile.name}` : '❌ Липсва учебна програма'} <br />
                    {testFile ? `✅ Тест: ${testFile.name}` : '❌ Липсва вариант на изпитването'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Изготвил: _______________________</p>
                  <p className="text-gray-600 mt-1">/ {analysisReport.teacher}, {analysisReport.role} /</p>
                  <p className="text-green-950 text-[10px] uppercase tracking-wider font-bold mt-0.5">ПГХХТ Пазарджик</p>
                </div>
              </div>

            </div>

            {/* ИНДИВИДУАЛНА ДИАГНОСТИКА (ВЪН ОД ДОКУМЕНТА ЗА ПЕЧАТ) */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-none">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-3 gap-2">
                <h3 className="font-bold text-sm text-[#1b5e20]">📊 Интерактивен индивидуален радар за дефицити</h3>
                <select
                  className="border border-gray-300 rounded p-1.5 bg-gray-50 text-xs font-semibold"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {analysisReport.studentsData.map((s: any) => <option key={s.name} value={s.name}>{s.name} ({s.score})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-4">
                <div className="max-w-[240px] mx-auto w-full">
                  <canvas id="studentChart"></canvas>
                </div>
                <div className="text-xs bg-gray-50 p-4 border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-700">Педагогическо предписание:</h5>
                  <p>Въз основа на индивидуалната паяжинообразна диаграма за ученик <strong>{selectedStudent}</strong> се препоръчва спешно пренасочване към допълнителни практически модули в секция "Геометрия", с оглед преодоляване на установените локални дефицити преди следващия етап на проверка.</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-12 text-center max-w-lg mt-12 shadow-sm">
            <span className="text-4xl block mb-3">🍏</span>
            <h3 className="text-base font-bold text-gray-700 mb-1">Официална система за анализи - ПГХХТ</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Моля, изберете съответната паралелка и изпитване от левия панел за управление и натиснете бутона, за да заредите чистата експертна структура.</p>
          </div>
        )}
      </main>

    </div>
  );
}
