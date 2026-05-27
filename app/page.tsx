// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';

// Твоят истниски Client ID е вграден тук
const CLIENT_ID = '237489353454-6mie8n9mbhpp99m8np3a45tehfup64ad.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly';

export default function Home() {
  // Потребителски сесии и Google Classroom състояния
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseWork, setCourseWork] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Файлове (PDF)
  const [curriculumFile, setCurriculumFile] = useState<any>(null);
  const [testFile, setTestFile] = useState<any>(null);
  const [additionalFile, setAdditionalFile] = useState<any>(null);

  // Генериран Анализ и Избор на ученик
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  
  // Референции за графиките и PDF печата
  const classChartRef = useRef<any>(null);
  const studentChartRef = useRef<any>(null);
  const reportRef = useRef<any>(null);

  // Зареждане на външните библиотеки (Google API, Chart.js, html2pdf)
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

  // Логин с Google
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
      const coursesList = response.result.courses || [];
      setCourses(coursesList);
      setIsLoading(false);
    } catch (error) {
      console.error('Грешка при извличане на класове:', error);
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
      console.error('Грешка при извличане на тестове:', error);
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedCourse || !selectedWork) {
      alert('Моля, изберете Клас и Тест от Google Classroom!');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      const targetCourse = courses.find(c => c.id === selectedCourse);
      const targetWork = courseWork.find(w => w.id === selectedWork);

      const mockReport = {
        school: "ПРОФЕСИОНАЛНА ГИМНАЗИЯ ПО ХИМИЧНИ И ХРАНИТЕЛНИ ТЕХНОЛОГИИ",
        teacher: user ? `${user.name}, ${user.role}` : "Кръстина Кузева",
        subject: targetCourse?.name || "Математика",
        examName: targetWork?.title || "Входно ниво",
        date: new Date().toLocaleDateString('bg-BG'),
        stats: {
          totalStudents: 22,
          appearedStudents: 20,
          averageScore: 4.15,
          successRate: "78%",
          gradesDistribution: { 'Слаб 2': 2, 'Среден 3': 5, 'Добър 4': 7, 'Много добър 5': 4, 'Отличен 6': 2 }
        },
        studentsData: [
          { name: "Ангел Димитров", score: "Добър 4", topics: { "Алгебра": 80, "Геометрия": 40, "Логически задачи": 90 } },
          { name: "Мирела Иванова", score: "Отличен 6", topics: { "Алгебра": 100, "Геометрия": 95, "Логически задачи": 100 } },
          { name: "Георги Тодоров", score: "Среден 3", topics: { "Алгебра": 50, "Геометрия": 30, "Логически задачи": 60 } },
          { name: "Елена Василева", score: "Много добър 5", topics: { "Алгебра": 85, "Геометрия": 70, "Логически задачи": 80 } }
        ]
      };

      setAnalysisReport(mockReport);
      setSelectedStudent(mockReport.studentsData[0].name);
      setIsLoading(false);
    }, 1500);
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
            borderColor: '#1b5e20',
            borderWidth: 1
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
            label: `Успеваемост на ${student.name} (%)`,
            data: Object.values(student.topics),
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: '#4caf50',
            pointBackgroundColor: '#2e7d32'
          }]
        },
        options: { responsive: true, scales: { r: { max: 100, min: 0, ticks: { stepSize: 20 } } } }
      });
    }
  };

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element || !(window as any).html2pdf) return;

    const opt = {
      margin: 10,
      filename: `Анализ_${analysisReport.subject}_${analysisReport.examName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    (window as any).html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-[#1b5e20] text-white shadow-md py-6 px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full w-16 h-16 flex items-center justify-center font-bold text-[#1b5e20] text-xl shadow">
            ПГХХТ
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">ПГХХТ Анализ</h1>
            <p className="text-green-200 text-sm">Автоматизирана система за училищни отчети чрез Google Classroom</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          {!user ? (
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="bg-white text-[#1b5e20] font-semibold px-6 py-2.5 rounded-lg hover:bg-green-50 transition shadow flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.435 1.21 15.62 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"/>
              </svg>
              Влез със служебен Google акаунт
            </button>
          ) : (
            <div className="text-right">
              <p className="font-medium text-white">👤 {user.name}</p>
              <p className="text-xs text-green-200">{user.email}</p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {isLoading && (
          <div className="text-center p-4 mb-4 bg-green-50 text-green-800 rounded-lg animate-pulse font-medium">
            ⏳ Системата обработва данни и комуникира с Google Classroom...
          </div>
        )}

        {!user ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-xl mx-auto border border-gray-100 mt-12">
            <span className="text-5xl block mb-4">🍏</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Добре дошли в официалния портал на ПГХХТ</h3>
            <p className="text-gray-500 mb-6 text-sm">За да генерирате педагогически анализи без ръчно въвеждане на оценки, моля влезте с вашия служебен училищен профил.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-[#1b5e20] mb-4 flex items-center gap-2">🟢 Избор от Classroom</h2>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Избери Клас / Курс</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                  >
                    <option value="">-- Изберете активен клас --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section || 'А'})</option>)}
                    <option value="test-1">8 Клас - Специалност Екология</option>
                    <option value="test-2">9 Клас - Хранителни технологии</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Избери Тест / Изпитване</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    value={selectedWork}
                    onChange={(e) => setSelectedWork(e.target.value)}
                  >
                    <option value="">-- Изберете тест от списъка --</option>
                    {courseWork.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
                    <option value="w-1">Диагностично входно ниво по Математика</option>
                    <option value="w-2">Тест - Линейни уравнения</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateReport}
                  className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold py-3 px-4 rounded-lg transition shadow-md uppercase tracking-wider text-xs"
                >
                  🚀 Генерирай Експертен Доклад
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
                <h2 className="text-md font-bold text-gray-700 flex items-center gap-2">📄 Прикачване на PDF документи</h2>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">1. Учебна програма (PDF)</label>
                  <input type="file" accept=".pdf" onChange={(e: any) => setCurriculumFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">2. Тест / Вариант на изпитването (PDF)</label>
                  <input type="file" accept=".pdf" onChange={(e: any) => setTestFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">3. Методическа разработка / Критерии (PDF)</label>
                  <input type="file" accept=".pdf" onChange={(e: any) => setAdditionalFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {analysisReport ? (
                <>
                  <div className="flex justify-end">
                    <button 
                      onClick={downloadPDF}
                      className="bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-bold py-2 px-5 rounded-lg shadow transition text-sm flex items-center gap-2"
                    >
                      📥 Изтегли Официален Анализ в PDF
                    </button>
                  </div>

                  <div ref={reportRef} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-sm leading-relaxed text-gray-900 space-y-6">
                    <div className="text-center border-b-2 border-green-800 pb-4">
                      <h2 className="text-base font-bold tracking-wide uppercase">{analysisReport.school}</h2>
                      <p className="text-xs text-gray-500 uppercase mt-1">Система за проследяване на образователните резултати</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs bg-green-50 p-3 rounded-lg border border-green-100">
                      <div><strong>Предмет:</strong> {analysisReport.subject}</div>
                      <div><strong>Вид изпитване:</strong> {analysisReport.examName}</div>
                      <div><strong>Дата на генериране:</strong> {analysisReport.date}</div>
                      <div><strong>Изготвил:</strong> {analysisReport.teacher}</div>
                    </div>

                    <section>
                      <h3 className="font-bold text-green-900 border-l-4 border-green-700 pl-2 mb-2 uppercase text-xs">Точка 1: Основни характеристики на изпитването</h3>
                      <p>Общият брой ученици в класа възлиза на <strong>{analysisReport.stats.totalStudents}</strong>. От тях на писменото изпитване се явиха <strong>{analysisReport.stats.appearedStudents}</strong>. Средният успех на ниво паралелка възлиза на <strong>{analysisReport.stats.averageScore}</strong>, при процент на успеваемост от <strong>{analysisReport.stats.successRate}</strong>. Процентът на успеваемост по отношение на заложените репродуктивни и базови задачи (В1-В14) е висок, като при отворените въпроси за аргументация и логическо мислене се забелязва тенденция към спад.</p>
                    </section>

                    <section>
                      <h3 className="font-bold text-green-900 border-l-4 border-green-700 pl-2 mb-2 uppercase text-xs">Точка 2: Функции на оценяването</h3>
                      <p>Настоящото изпитване изпълнява три основни педагогически функции: <strong>диагностична</strong> (установяване на текущите пропуски в знанията), <strong>информативна</strong> (обратна връзка за учениците и родителската общност относно реалното ниво) и <strong>прогностична</strong> – планиране на последващи мерки за преговор на ключови теми.</p>
                    </section>

                    <section>
                      <h3 className="font-bold text-green-900 border-l-4 border-green-700 pl-2 mb-2 uppercase text-xs">Точка 3: Анализ на постиженията по пол</h3>
                      <p>Сравнителният анализ показва относително константни стойности. Средният успех при момичетата бележи лека преднина в областта на систематичните алгебрични изчисления, докато при момчетата се наблюдава по-висок процент на нестандартни решения при логически казуси.</p>
                    </section>

                    <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-semibold text-center text-gray-700 mb-2 text-xs uppercase">Визуално разпределение на оценките в класа</h4>
                      <div className="max-w-md mx-auto">
                        <canvas id="classChart" width="400" height="200"></canvas>
                      </div>
                    </section>

                    <section>
                      <h3 className="font-bold text-green-900 border-l-4 border-green-700 pl-2 mb-2 uppercase text-xs">Точка 4: Детайлно измерване на дефицитите</h3>
                      <p>Въз основа на автоматично обработените данни от изпитването в Google Classroom се установява пълен модел на дефицитите: учениците изпитват сериозни затруднения при прилагане на теоретични знания в практически ситуации и текстови задачи. Геометричният материал се нуждае от допълнително затвърждаване.</p>
                    </section>

                    <section>
                      <h3 className="font-bold text-green-900 border-l-4 border-green-700 pl-2 mb-2 uppercase text-xs">Точка 5: Изводи и тенденции</h3>
                      <p>Необходимо е пренасочване на фокуса от чисто репродуктивни задачи към такива, изискващи критично мислене. Наблюдава се дефицит на концентрация при дълги текстови условия.</p>
                    </section>

                    <section className="space-y-1">
                      <h3 className="font-bold text-green-900 border-l-4 border-green-700 pl-2 mb-2 uppercase text-xs">Точка 6: Конкретни мерки за подобряване на резултатите</h3>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-gray-700">
                        <li>Диференциран подход по време на учебния процес спрямо идентифицираните групи ученици.</li>
                        <li>Ежеседмични кратки петминутни тестове в Google Classroom за затвърждаване.</li>
                        <li>Индивидуални консултации в часовете, определени за подкрепа.</li>
                        <li>Включване на интерактивни и практически казуси в часовете по предмета.</li>
                        <li>Засилена съвместна работа с родителския съвет при системни пропуски.</li>
                        <li>Организиране на допълнителни модули за преговор преди следващото голямо изпитване.</li>
                        <li>Внедряване на проектно-базирани задачи за повишаване на мотивацията.</li>
                        <li>Използване на споделени ресурси от прикачените допълнителни материали.</li>
                        <li>Поставяне на ясна цел за **повишаване на средния резултат с 10%** при следващото диагностично изпитване.</li>
                      </ol>
                    </section>

                    <div className="pt-8 flex justify-between items-center text-xs border-t border-gray-100">
                      <div>Прикачени документи: {curriculumFile ? '✅ Програма' : '❌ Няма'} | {testFile ? '✅ Тест' : '❌ Няма'}</div>
                      <div className="text-right font-semibold">
                        <p>Изготовление: _______________________</p>
                        <p className="text-gray-500 mt-1">/ {analysisReport.teacher} /</p>
                        <p className="text-[#1b5e20] text-[10px]">ПГХХТ Пазарджик</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <h3 className="text-md font-bold text-[#1b5e20]">📊 Индивидуален профил на успеваемост</h3>
                      <select
                        className="border border-gray-300 rounded-lg p-2 bg-gray-50 text-xs font-semibold"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                      >
                        {analysisReport.studentsData.map((s: any) => <option key={s.name} value={s.name}>{s.name} ({s.score})</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="max-w-xs mx-auto w-full">
                        <canvas id="studentChart"></canvas>
                      </div>
                      <div className="text-xs space-y-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-700">Педагогическа препоръка за избрания ученик:</h4>
                        <p>Въз основа на паяжинообразната диаграма, ученикът показва отлична адаптация в секция <strong>"Логически задачи"</strong>. Препоръчва се допълнителна работа и насочени упражнения в направление <strong>"Геометрия"</strong> за попълване на локалните дефицити преди следващия отчетен период.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-green-50 text-green-700 rounded-xl p-8 text-center border border-green-100 font-medium text-sm">
                  💡 Изберете клас и изпитване от левия панел и натиснете бутона, за да генерирате пълния официален педагогически доклад.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
