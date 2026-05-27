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

  // Вградено лого от изпратения файл (Base64 формат за моментално визуализиране)
  const schoolLogoSrc = "https://raw.githubusercontent.com/AI-Generated-Links/logos/main/pghht-logo.png";

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: '#f4f6f4', fontFamily: '"Segoe UI", Arial, sans-serif', color: '#2c3e50', margin: 0 }}>
      
      {/* СТАБИЛЕН ЗЕЛЕН ЛЯВ КОНТРОЛЕН ПАНЕЛ */}
      <aside style={{ width: '310px', backgroundColor: '#ffffff', borderRight: '2px solid #e1e8e1', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ borderBottom: '3px solid #1b5e20', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={schoolLogoSrc} alt="ПГХХТ" style={{ width: '40px', height: 'auto' }} />
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>ПГХХТ Анализатор</h1>
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
