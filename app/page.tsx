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
        date: "27.05.2026 г.",
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
    }, 1000);
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
            backgroundColor: '#1b5e20',
            borderWidth: 0
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: true,
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } 
        }
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
            backgroundColor: 'rgba(27, 94, 32, 0.15)',
            borderColor: '#1b5e20',
            borderWidth: 2
          }]
        },
        options: { 
          responsive: true,
          maintainAspectRatio: true,
          scales: { r: { max: 100, min: 0 } } 
        }
      });
    }
  };

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element || !(window as any).html2pdf) return;
    const opt = {
      margin: 12,
      filename: `Анализ_${analysisReport.classGrade}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    (window as any).html2pdf().from(element).set(opt).save();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif', color: '#1f2937', margin: 0 }}>
      
      {/* СТАБИЛЕН СТРУКТУРИРАН ЛЯВ ПАНЕЛ */}
      <aside style={{ width: '300px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'between', flexShrink: 0 }}>
        <div>
          <div style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '16px', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#052e16', margin: 0 }}>ПГХХТ Анализатор</h1>
            <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', margin: 0 }}>Експертна педагогическа статистика</p>
          </div>

          {!user ? (
            <button 
              onClick={handleGoogleLogin}
              style={{ width: '100%', backgroundColor: '#1b5e20', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              Влез със служебен Google акаунт
            </button>
          ) : (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '6px', padding: '12px', fontSize: '12px', marginBottom: '20px' }}>
              <p style={{ fontWeight: 'bold', color: '#166534', margin: 0 }}>👤 {user.name}</p>
              <p style={{ color: '#4b5563', margin: '2px 0 0 0', fontSize: '11px' }}>{user.email}</p>
            </div>
          )}

          {user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', uppercase: 'true', color: '#9ca3af', marginBottom: '4px' }}>КЛАС ОТ CLASSROOM</label>
                <select 
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px', backgroundColor: '#f9fafb', fontSize: '12px' }}
                  value={selectedCourse}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">-- Изберете паралелка --</option>
                  <option value="test">8 Б клас</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', uppercase: 'true', color: '#9ca3af', marginBottom: '4px' }}>ТЕСТ / ЗАДАЧА</label>
                <select 
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px', backgroundColor: '#f9fafb', fontSize: '12px' }}
                  value={selectedWork}
                  onChange={(e) => setSelectedWork(e.target.value)}
                >
                  <option value="">-- Изберете изпитване --</option>
                  <option value="w-1">Диагностично входно ниво по Математика</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 8px 0' }}>ДОПЪЛНИТЕЛНИ ДОКУМЕНТИ</p>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Учебна програма (PDF)</label>
                  <input type="file" accept=".pdf" style={{ fontSize: '10px', width: '100%' }} onChange={(e: any) => setCurriculumFile(e.target.files[0])} />
                </div>
              </div>

              <button
                onClick={handleGenerateReport}
                style={{ width: '100%', backgroundColor: '#2e7d32', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              >
                Генерирай структура
              </button>
            </div>
          )}
        </div>
        
        <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
          ПГХХТ © 2026 Всички права запазени.
        </div>
      </aside>

      {/* ДЕСЕН РАБОТЕН ПАНЕЛ С КЛАСИЧЕСКИ ЛИСТ А4 */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {analysisReport ? (
          <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={downloadPDF}
                style={{ backgroundColor: '#1b5e20', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '10px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🖨️ Изтегли Официален PDF Анализ
              </button>
            </div>

            {/* ИСТИНСКИ БЯЛ ЛИСТ А4 С ФИКСИРАНИ ОФИС ГРАНИЦИ */}
            <div 
              ref={reportRef} 
              style={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db', padding: '50px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '12px', color: '#000000', lineHeight: '1.5', position: 'relative', minHeight: '297mm' }}
            >
              
              {/* ХЕДЪР: ЛОГО + ЗАГЛАВИЕ */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #1b5e20', paddingBottom: '12px' }}>
                <div style={{ width: '80px', height: '80px', border: '1px dashed #cccccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '9px', color: '#9ca3af', textAlign: 'center', padding: '4px', boxSizing: 'border-box' }}>
                  [ МЯСТО ЗА ЛОГО ]
                </div>
                <div style={{ textAlign: 'right', maxWidth: '550px' }}>
                  <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#052e16', uppercase: 'true', margin: 0 }}>{analysisReport.school}</h2>
                  <p style={{ fontSize: '10px', color: '#6b7280', uppercase: 'true', margin: '4px 0 0 0', trackingWide: '1px' }}>Система за проследяване на образователните резултати</p>
                </div>
              </div>

              {/* МЕТА КАРТА С ДАННИ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                <div><strong>Паралелка / Група:</strong> {analysisReport.classGrade}</div>
                <div><strong>Учебен предмет:</strong> {analysisReport.subject}</div>
                <div><strong>Вид на проверката:</strong> {analysisReport.examName}</div>
                <div><strong>Дата на отчета:</strong> {analysisReport.date}</div>
              </div>

              {/* ТОЧКА 1 */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#052e16', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '6px', uppercase: 'true' }}>Точка 1: Основни характеристики на изпитването (Ниво Клас)</h3>
                <p style={{ margin: 0, textAlign: 'justify' }}>Общият състав на паралелката възлиза на <strong>{analysisReport.stats.totalStudents}</strong> ученици. В диагностичната процедура взеха участие <strong>{analysisReport.stats.appearedStudents}</strong> от тях. Средният брутен успех на ниво паралелка е фиксиран на <strong>{analysisReport.stats.averageScore}</strong>, съответстващ на общ коефициент на качествена успеваемост от <strong>{analysisReport.stats.successRate}</strong>. Базовите репродуктивни компоненти показват задоволително усвояване, докато отворените логически секции бележат умерена флуктуация.</p>
              </section>

              {/* ТОЧКА 2 */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#052e16', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '6px', uppercase: 'true' }}>Точка 2: Функции на проведеното оценяване</h3>
                <p style={{ margin: 0, textAlign: 'justify' }}>Процедурата реализира три основни педагогически стълба: <strong>Диагностична функция</strong> (диференциране на натрупани системни пропуски), <strong>Информативна функция</strong> (генериране на обективна обратна връзка за образователната общност и семейния съвет) и <strong>Прогностична функция</strong> (коригиране на годишното тематично разпределение за последващ преговор).</p>
              </section>

              {/* ТОЧКА 3: ТАБЛИЦА С ВЪПРОСИ (УМЕНИЯ) */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#052e16', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '6px', uppercase: 'true' }}>Точка 3: Аналитично измерване на дефицитите на ниво въпрос</h3>
                <p style={{ margin: '0 0 10px 0' }}>Всеки зададен въпрос от изпитването мери конкретна група знания, умения или установени системни пропуски:</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ border: '1px solid #9ca3af', padding: '6px', fontWeight: 'bold', textAlign: 'center', width: '50px' }}>Код</th>
                      <th style={{ border: '1px solid #9ca3af', padding: '6px', fontWeight: 'bold', textAlign: 'left' }}>Измервано знание / Специфично умение</th>
                      <th style={{ border: '1px solid #9ca3af', padding: '6px', fontWeight: 'bold', textAlign: 'center', width: '80px' }}>Макс. точки</th>
                      <th style={{ border: '1px solid #9ca3af', padding: '6px', fontWeight: 'bold', textAlign: 'center', width: '120px' }}>Успеваемост (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisReport.questionsData.map((q: any) => (
                      <tr key={q.num}>
                        <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>{q.num}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '6px' }}>{q.skill}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center' }}>{q.maxPoints}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>{q.avgSuccess}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* МАЛКА СМАЛЕНА ГРАФИКА РАЗПРЕДЕЛЕНИЕ */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid #e5e7eb', maxWidth: '320px', margin: '0 auto' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Разпределение на оценките</span>
                <div style={{ width: '280px', height: '130px' }}>
                  <canvas id="classChart"></canvas>
                </div>
              </div>

              {/* ТОЧКА 4 */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#052e16', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '6px', uppercase: 'true' }}>Точка 4: Индивидуален профил на успеваемост (Ниво Ученик)</h3>
                <p style={{ margin: 0, textAlign: 'justify' }}>Наблюдението на индивидуално равнище потвърждава балансирано усвояване на системните алгебрични преобразувания. Специфични дефицити и пропуски се регистрират в пространственото мислене и геометрията при част от състава на класа.</p>
              </section>

              {/* ТОЧКА 5: МЕРКИ */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#052e16', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '6px', uppercase: 'true' }}>Точка 5: Програма от мерки за подобряване на резултатите</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Диференциран подход:</strong> Обособяване на микрогрупи за подкрепа по време на редовните часове.</li>
                  <li><strong>Дигитално подсилване:</strong> Ежеседмични кратки тестове в Google Classroom за затвърждаване.</li>
                  <li><strong>Методическа помощ:</strong> Таргетирани индивидуални консултации в часовете за подкрепа.</li>
                </ul>
              </section>

              {/* ФУТЪР: ИЗГОТВИЛ ИЗЦЕЛО ДОЛУ ВДЯСНО */}
              <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                  {curriculumFile && <span>📎 Прикачена програма: {curriculumFile.name}</span>}
                </div>
                <div style={{ textAlign: 'right', minWidth: '220px' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>Изготвил: _______________________</p>
                  <p style={{ margin: '4px 0 0 0', color: '#4b5563', fontSize: '11px' }}>/ {analysisReport.teacher}, {analysisReport.role} /</p>
                  <p style={{ margin: '2px 0 0 0', color: '#052e16', fontSize: '10px', fontWeight: 'bold', uppercase: 'true' }}>ПГХХТ Пазарджик</p>
                </div>
              </div>

            </div>

            {/* ИНДИВИДУАЛЕН КЛАСЕН ИНСТРУМЕНТ (ВЪН ОТ ПЕЧАТНИЯ ЛИСТ) */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>📊 Интерактивен индивидуален радар за дефицити</h3>
                <select
                  style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px', fontSize: '11px' }}
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {analysisReport.studentsData.map((s: any) => <option key={s.name} value={s.name}>{s.name} ({s.score})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                <div style={{ maxWidth: '200px', margin: '0 auto' }}>
                  <canvas id="studentChart"></canvas>
                </div>
                <div style={{ fontSize: '11px', backgroundColor: '#f9fafb', padding: '12px', border: '1px solid #e5e7eb' }}>
                  <h5 style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Педагогическо предписание:</h5>
                  <p style={{ margin: 0 }}>Въз основа на паяжинообразната диаграма за <strong>{selectedStudent}</strong> се препоръчва насочване към практически казуси за преодоляване на локалните дефицити.</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', padding: '48px', textAlign: 'center', maxWidth: '500px', marginTop: '40px', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>🍏</span>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>Официална система за анализи - ПГХХТ</h3>
            <p style={{ color: '#9ca3af', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>Моля, изберете паралелка и изпитване от левия контролен панел и натиснете бутона, за да заредите чистата експертна структура.</p>
          </div>
        )}
      </main>

    </div>
  );
}
