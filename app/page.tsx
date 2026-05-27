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
        examName: "ДИАГНОСТИЧНО ВХОДНО НИВО ПО МАТЕМАТИКА",
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
    }, 800);
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
            borderColor: '#114214',
            borderWidth: 1
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
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
            pointBackgroundColor: '#1b5e20',
            borderWidth: 2
          }]
        },
        options: { 
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { max: 100, min: 0, ticks: { display: false } } } 
        }
      });
    }
  };

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element || !(window as any).html2pdf) return;
    const opt = {
      margin: 10,
      filename: `Анализ_ПГХХТ_${analysisReport.classGrade}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    (window as any).html2pdf().from(element).set(opt).save();
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: '#f4f6f4', fontFamily: '"Segoe UI", Arial, sans-serif', color: '#2c3e50', margin: 0 }}>
      
      {/* ЛЯВ КОНТРОЛЕН ПАНЕЛ */}
      <aside style={{ width: '310px', backgroundColor: '#ffffff', borderRight: '2px solid #e1e8e1', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ borderBottom: '3px solid #1b5e20', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/school-logo.png" alt="Официално Лого ПГХХТ" style={{ width: '45px', height: 'auto' }} />
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>ПГХХТ Анализатор</h1>
            <p style={{ fontSize: '11px', color: '#556b2f', marginTop: '2px', margin: 0 }}>Диагностични доклади</p>
          </div>
        </div>

        {!user ? (
          <button 
            onClick={handleGoogleLogin}
            style={{ width: '100%', backgroundColor: '#1b5e20', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            🔐 Вход с Google Classroom
          </button>
        ) : (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #c2e7c2', borderRadius: '6px', padding: '12px', fontSize: '12px', marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>👤 {user.name}</p>
            <p style={{ color: '#4b5563', margin: '2px 0 0 0', fontSize: '11px' }}>{user.email}</p>
          </div>
        )}

        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1b5e20', marginBottom: '6px' }}>ПАРАЛЕЛКА / КЛАС</label>
              <select 
                style={{ width: '100%', border: '1px solid #bdc8bd', borderRadius: '4px', padding: '10px', backgroundColor: '#fafafa', fontSize: '12px' }}
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">-- Изберете от списъка --</option>
                <option value="test-class">8 Б клас</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1b5e20', marginBottom: '6px' }}>ИЗПИТВАНЕ</label>
              <select 
                style={{ width: '100%', border: '1px solid #bdc8bd', borderRadius: '4px', padding: '10px', backgroundColor: '#fafafa', fontSize: '12px' }}
                value={selectedWork}
                onChange={(e) => setSelectedWork(e.target.value)}
              >
                <option value="">-- Изберете проверен тест --</option>
                <option value="w-1">Диагностично входно ниво по Математика</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid #e1e8e1', paddingTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#1b5e20', marginBottom: '6px' }}>ПРИКАЧИ УЧЕБНА ПРОГРАМА (PDF)</label>
              <input type="file" accept=".pdf" style={{ fontSize: '11px', width: '100%' }} onChange={(e: any) => setCurriculumFile(e.target.files[0])} />
            </div>

            <button
              onClick={handleGenerateReport}
              style={{ width: '100%', backgroundColor: '#2e7d32', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              🔄 Генерирай Зелен Анализ
            </button>
          </div>
        )}
        
        <div style={{ fontSize: '11px', color: '#8a9a8a', textAlign: 'center', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e1e8e1' }}>
          ПГХХТ Пазарджик © 2026
        </div>
      </aside>

      {/* ДЕСЕН ПАНЕЛ ЗА ОФИС ПРЕГЛЕД */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {analysisReport ? (
          <div style={{ width: '100%', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={downloadPDF}
                style={{ backgroundColor: '#1b5e20', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                🖨️ Изтегли Зелен PDF за Печат
              </button>
            </div>

            {/* БЯЛ ОФИЦИАЛЕН ЛИСТ А4 */}
            <div 
              ref={reportRef} 
              style={{ backgroundColor: '#ffffff', border: '1px solid #cfd7cf', padding: '45px 55px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '12px', color: '#111111', lineHeight: '1.6', position: 'relative', minHeight: '297mm' }}
            >
              
              {/* ГОРНА ОФИЦИАЛНА БЛАНКА С АВТЕНТИЧНОТО ОФИЦИАЛНО ЛОГО ОД КАРТИНКАТА */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #1b5e20', paddingBottom: '14px', marginBottom: '5px' }}>
                <img src="/school-logo.png" alt="Оригинално Лого ПГХХТ" style={{ width: '75px', height: 'auto', display: 'block' }} />
                <div style={{ textAlign: 'right', maxWidth: '580px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1b5e20', textTransform: 'uppercase', margin: 0, letterSpacing: '0.3px' }}>{analysisReport.school}</h2>
                  <p style={{ fontSize: '10px', color: '#556b2f', textTransform: 'uppercase', margin: '4px 0 0 0', fontWeight: '600' }}>Система за статистическо проследяване на резултатите</p>
                </div>
              </div>

              {/* МЕТА БЛАНКА */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', backgroundColor: '#f4f7f4', padding: '14px', borderRadius: '4px', border: '1px solid #e1e8e1', fontWeight: '500' }}>
                <div><span style={{ color: '#1b5e20' }}>Паралелка / Група:</span> {analysisReport.classGrade}</div>
                <div><span style={{ color: '#1b5e20' }}>Учебен предмет:</span> {analysisReport.subject}</div>
                <div style={{ gridColumn: '1 / span 2' }}><span style={{ color: '#1b5e20' }}>Вид на проверката:</span> {analysisReport.examName}</div>
                <div><span style={{ color: '#1b5e20' }}>Дата на отчета:</span> {analysisReport.date}</div>
                <div><span style={{ color: '#1b5e20' }}>Класен ръководител:</span> П. Стоянова</div>
              </div>

              {/* РАЗДЕЛ 1 */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1b5e20', borderBottom: '1px solid #d0ded0', paddingBottom: '3px', marginBottom: '8px' }}>1. Основни статистически данни за класа</h3>
                <p style={{ margin: 0, textAlign: 'justify' }}>Професионалната гимназия по данни на класа и нивото удостоверява, че общият състав на паралелката възлиза на <strong>{analysisReport.stats.totalStudents}</strong> ученици. В изпитната процедура реално се включиха <strong>{analysisReport.stats.appearedStudents}</strong> ученици. Изчисленият среден успех на ниво паралелка е фиксиран на <strong>{analysisReport.stats.averageScore}</strong>, което съответства на висок коефициент на качествена успеваемост от <strong>{analysisReport.stats.successRate}</strong>.</p>
              </section>

              {/* РАЗДЕЛ 2 */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1b5e20', borderBottom: '1px solid #d0ded0', paddingBottom: '3px', marginBottom: '8px' }}>2. Обща успеваемост и педагогически функции</h3>
                <p style={{ margin: 0, textAlign: 'justify' }}>Проведеното диагностично изпитване реализира три ключови стълба: <strong>Диагностична функция</strong> за откриване на пропуските, <strong>Информативна функция</strong> за обратна връзка към родителския съвет и <strong>Прогностична функция</strong> за преструктуриране на часовете за преговор.</p>
              </section>

              {/* РАЗДЕЛ 3: ТАБЛИЦА С ДЕФИЦИТИ */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1b5e20', borderBottom: '1px solid #d0ded0', paddingBottom: '3px', marginBottom: '8px' }}>3. Усвоени компетенции и идентифицирани дефицити</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginTop: '6px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1b5e20', color: '#ffffff' }}>
                      <th style={{ border: '1px solid #1b5e20', padding: '6px', fontWeight: 'bold', textAlign: 'center', width: '50px' }}>Код</th>
                      <th style={{ border: '1px solid #1b5e20', padding: '6px', fontWeight: 'bold', textAlign: 'left' }}>Измервано знание / Специфично умение</th>
                      <th style={{ border: '1px solid #1b5e20', padding: '6px', fontWeight: 'bold', textAlign: 'center', width: '80px' }}>Макс. т.</th>
                      <th style={{ border: '1px solid #1b5e20', padding: '6px', fontWeight: 'bold', textAlign: 'center', width: '120px' }}>Успеваемост (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisReport.questionsData.map((q: any) => (
                      <tr key={q.num} style={{ backgroundColor: '#ffffff' }}>
                        <td style={{ border: '1px solid #bdc8bd', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>{q.num}</td>
                        <td style={{ border: '1px solid #bdc8bd', padding: '6px' }}>{q.skill}</td>
                        <td style={{ border: '1px solid #bdc8bd', padding: '6px', textAlign: 'center' }}>{q.maxPoints}</td>
                        <td style={{ border: '1px solid #bdc8bd', padding: '6px', textAlign: 'center', color: '#1b5e20', fontWeight: 'bold' }}>{q.avgSuccess}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* КОМПАКТНА ДИАГРАМА ЗА КЛАСА */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fafafa', padding: '10px', borderRadius: '4px', border: '1px solid #e1e8e1', maxWidth: '340px', margin: '4px auto' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#1b5e20', marginBottom: '6px', textTransform: 'uppercase' }}>Количествено разпределение на оценките</span>
                <div style={{ width: '310px', height: '120px' }}>
                  <canvas id="classChart"></canvas>
                </div>
              </div>

              {/* РАЗДЕЛ 4 */}
              <section>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1b5e20', borderBottom: '1px solid #d0ded0', paddingBottom: '3px', marginBottom: '8px' }}>4. Конкретни мерки за подобряване на резултатите</h3>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <li><strong>Диференциран подход:</strong> Обособяване на микрогрупи в редовните часове за подкрепа.</li>
                  <li><strong>Дигитални тестове:</strong> Кратки опреснителни петминутни задачи в Google Classroom.</li>
                  <li><strong>Таргетирани консултации:</strong> Работа по геометрия и пространствено мислене.</li>
                </ul>
              </section>

              {/* ФУТЪР */}
              <div style={{ marginTop: 'auto', paddingTop: '30px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: '#7a8a7a' }}>
                  {curriculumFile && <span>📎 Приложена програма: {curriculumFile.name}</span>}
                </div>
                <div style={{ textAlign: 'right', minWidth: '240px' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#000000' }}>Изготвил: _______________________</p>
                  <p style={{ margin: '4px 0 0 0', color: '#4b5563', fontSize: '11px' }}>/ {analysisReport.teacher}, {analysisReport.role} /</p>
                  <p style={{ margin: '2px 0 0 0', color: '#1b5e20', fontSize: '10px', fontWeight: 'bold' }}>ПГХХТ Пазарджик</p>
                </div>
              </div>

            </div>

            {/* ИНДИВИДУАЛЕН СТУДЕНТСКИ ИНСТРУМЕНТ */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #bdc8bd', padding: '20px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1b5e20', paddingBottom: '10px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>📊 Индивидуален радар за дефицити</h3>
                <select
                  style={{ border: '1px solid #bdc8bd', borderRadius: '4px', padding: '6px 12px', fontSize: '11px' }}
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {analysisReport.studentsData.map((s: any) => <option key={s.name} value={s.name}>{s.name} ({s.score})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', alignItems: 'center' }}>
                <div style={{ height: '160px', position: 'relative' }}>
                  <canvas id="studentChart"></canvas>
                </div>
                <div style={{ fontSize: '11px', backgroundColor: '#f4f7f4', padding: '12px', border: '1px solid #e1e8e1', borderRadius: '4px' }}>
                  <h5 style={{ fontWeight: 'bold', margin: '0 0 4px 0', color: '#1b5e20' }}>Педагогическа препоръка за надграждане:</h5>
                  <p style={{ margin: 0 }}>Графиката показва индивидуалното развитие на <strong>{selectedStudent}</strong>. Желателно е да се наблегне върху практическите казуси за отстраняване на текущите дефицити.</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* НАЧАЛЕН ЕКРАН С ОРИГИНАЛНОТО ЛОГО НА УЧИЛИЩЕТО */
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e1e8e1', padding: '48px', textAlign: 'center', maxWidth: '520px', marginTop: '40px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img src="/school-logo.png" alt="Оригинално Лого ПГХХТ" style={{ width: '90px', height: 'auto', marginBottom: '10px' }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20', margin: '0 0 8px 0' }}>Официална система за анализи - ПГХХТ</h3>
              <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>Моля, изберете съответната паралелка и изпитване от левия контролен панел и натиснете бутона, за да заредите чистата експертна структура.</p>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
