import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Bell, LogOut, Home, LayoutDashboard, Info } from 'lucide-react';
import API from '../api/axios';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [hasNotification, setHasNotification] = useState(false);

  // وظيفة فحص التنبيهات الذكية بناءً على الشروط الجديدة
  const checkAlerts = async () => {
    if (!token) return;
    try {
      if (role === 'seeker') {
        const res = await API.get('/jobs');
        const totalJobsInDB = res.data.length;

        // جلب آخر عدد وظائف تم الاطلاع عليها من الذاكرة المحلية
        const lastViewedJobsCount = parseInt(localStorage.getItem('lastViewedJobsCount') || '0');

        // إذا كان المتقدم داخل لوحة التحكم (صفحة التصفح)، نقوم بتحديث الذاكرة فوراً وإطفاء الجرس
        if (location.pathname === '/seeker-dashboard') {
          localStorage.setItem('lastViewedJobsCount', totalJobsInDB.toString());
          setHasNotification(false);
        } else {
          // يضيء الجرس فقط إذا كان عدد الوظائف في قاعدة البيانات أكبر من التي اطلع عليها مسبقاً
          setHasNotification(totalJobsInDB > lastViewedJobsCount);
        }
      } else if (role === 'employer') {
        const res = await API.get('/applications/employer-data');
        // حساب إجمالي المتقدمين لجميع وظائف هذه الشركة حالياً
        const totalApplicantsInDB = res.data.reduce((acc, curr) => acc + curr.applicants.length, 0);

        // جلب آخر عدد متقدمين تم الاطلاع عليهم من الذاكرة المحلية
        const lastViewedApplicantsCount = parseInt(localStorage.getItem('lastViewedApplicantsCount') || '0');

        // إذا كان صاحب العمل داخل لوحة التحكم الخاصة به، نحدث الذاكرة فوراً ونطفئ الجرس
        if (location.pathname === '/employer-dashboard') {
          localStorage.setItem('lastViewedApplicantsCount', totalApplicantsInDB.toString());
          setHasNotification(false);
        } else {
          // يضيء الجرس فقط إذا زاد عدد المتقدمين عن آخر مرة شاهد فيها اللوحة
          setHasNotification(totalApplicantsInDB > lastViewedApplicantsCount);
        }
      }
    } catch (err) { 
      console.log("Header Alert Sync Error"); 
    }
  };

  useEffect(() => {
    checkAlerts();
    const interval = setInterval(checkAlerts, 10000); // فحص صامت وتحديث ذكي كل 10 ثوانٍ
    return () => clearInterval(interval);
  }, [token, location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  const styles = {
    nav: { 
      background: 'rgba(15, 23, 42, 0.85)', 
      backdropFilter: 'blur(16px)', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
      padding: '15px 50px', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
    },
    rightSection: { display: 'flex', alignItems: 'center', gap: '20px' },
    menu: { display: 'flex', gap: '20px', alignItems: 'center' },
    navLink: (active) => ({ 
      color: active ? '#3b82f6' : '#94a3b8', 
      fontWeight: '700', 
      textDecoration: 'none', 
      fontSize: '15px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      transition: 'all 0.3s ease',
      padding: '8px 16px',
      borderRadius: '12px',
      backgroundColor: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
    }),
    leftLogo: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white', transition: '0.3s' },
    logoText: { fontWeight: '900', fontSize: '24px', letterSpacing: '0.5px', margin: 0, background: 'linear-gradient(to left, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    bellBtn: { background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: hasNotification ? '#ef4444' : '#94a3b8', transition: '0.3s', display: 'flex' },
    logoutBtn: { padding: '10px 20px', backgroundColor: 'transparent', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', transition: 'all 0.3s ease' }
  };

  return (
    <nav style={styles.nav} dir="rtl">
      {/* 1. أقصى اليمين: التنبيهات والخروج بتصميم متناسق وفخم */}
      <div style={styles.rightSection}>
        <button onClick={handleLogout} style={styles.logoutBtn} 
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }} 
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#f87171'; }}
          title="تسجيل الخروج"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

        <button style={styles.bellBtn} title="التنبيهات">
          <Bell size={22} fill={hasNotification ? "#ef4444" : "none"} style={{ filter: hasNotification ? 'drop-shadow(0 0 8px #ef4444)' : 'none' }} />
          {hasNotification && (
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }}></span>
          )}
        </button>
      </div>

      {/* 2. المنتصف: أزرار التنقل */}
      <div style={styles.menu}>
        <Link to="/" style={styles.navLink(location.pathname === '/')}>
          <Home size={18}/> الرئيسية
        </Link>
        <Link to={role === 'employer' ? '/employer-dashboard' : '/seeker-dashboard'} 
              style={styles.navLink(location.pathname.includes('dashboard'))}>
          <LayoutDashboard size={18}/> لوحة التحكم
        </Link>
        <Link to="/about" style={styles.navLink(location.pathname === '/about')}>
          <Info size={18}/> عن المنصة
        </Link>
      </div>

      {/* 3. أقصى الشمال (اليسار): الشعار والأيقونة المضيئة */}
      <Link to={role === 'employer' ? '/employer-dashboard' : '/seeker-dashboard'} style={styles.leftLogo} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
        <span style={styles.logoText}>ProHire</span>
        <Briefcase size={26} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} />
      </Link>
    </nav>
  );
}
