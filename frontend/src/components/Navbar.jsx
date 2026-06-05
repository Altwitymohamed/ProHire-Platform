import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, LogOut, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('المستخدم');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // التحقق المباشر من وجود التوكن لتأكيد تسجيل الدخول
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.name) setUserName(parsed.name);
        } catch (e) {
          setUserName('لوحتي');
        }
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
    setIsOpen(false);
  };

  // دالة ذكية مرنة لتوجيه المستخدم للوحته بناء على الفرع المخزن
  const getDashboardPath = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'admin') return '/admin-pro-panel';
        if (parsed.role === 'employer') return '/employer-dashboard';
      } catch(e) {}
    }
    return '/seeker-dashboard'; // التوجيه الافتراضي الآمن
  };

  useEffect(() => {
    const styleId = 'navbar-responsive-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .menu-toggle-btn { display: block !important; }
          .mobile-menu-box { display: ${isOpen ? 'flex' : 'none'} !important; }
        }
        @media (min-width: 769px) {
          .desktop-menu { display: flex !important; }
          .menu-toggle-btn { display: none !important; }
          .mobile-menu-box { display: none !important; }
        }
      `;
      document.head.appendChild(styleElement);
    } else {
      document.getElementById(styleId).innerHTML = `
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .menu-toggle-btn { display: block !important; }
          .mobile-menu-box { display: ${isOpen ? 'flex' : 'none'} !important; }
        }
        @media (min-width: 769px) {
          .desktop-menu { display: flex !important; }
          .menu-toggle-btn { display: none !important; }
          .mobile-menu-box { display: none !important; }
        }
      `;
    }
  }, [isOpen]);

  const styles = {
    nav: { backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '15px 25px', position: 'sticky', top: 0, zIndex: 1000, fontFamily: "'Segoe UI', sans-serif" },
    container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' },
    logo: { fontSize: '22px', fontWeight: 'bold', color: '#0F172A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' },
    menuBtn: { display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#0F172A' },
    navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
    link: (active) => ({ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: active ? '#22D3EE' : '#475569', fontWeight: active ? 'bold' : '500', fontSize: '15px', transition: 'all 0.3s' }),
    logoutBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#EF4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
    mobileMenu: { display: isOpen ? 'flex' : 'none', flexDirection: 'column', width: '100%', gap: '15px', padding: '15px 0 5px 0', borderTop: '1px solid #F1F5F9', marginTop: '10px' }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/home" style={styles.logo}>💼 ProHire <span style={{fontSize:'12px', color:'#22D3EE', backgroundColor:'#E0F2FE', padding:'2px 8px', borderRadius:'12px'}}>Platform</span></Link>
        
        <button className="menu-toggle-btn" style={styles.menuBtn} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* 💻 هيدر الكمبيوتر واللابتوب الفخم */}
        <div className="desktop-menu" style={styles.navLinks}>
          <Link to="/home" style={styles.link(location.pathname === '/home')}><Home size={18} /> الرئيسية</Link>
          {isLoggedIn && (
            <>
              <Link to={getDashboardPath()} style={styles.link(location.pathname.includes('dashboard') || location.pathname.includes('panel'))}><LayoutDashboard size={18} /> لوحة التحكم</Link>
              <span style={{ fontSize: '14px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={16} /> {userName}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={18} /> خروج</button>
            </>
          )}
        </div>
      </div>

      {/* 📱 هيدر الهاتف الذكي المتجاوب المطور (يفتح بالضغط) */}
      <div className="mobile-menu-box" style={styles.mobileMenu}>
        <Link to="/home" onClick={() => setIsOpen(false)} style={styles.link(location.pathname === '/home')}><Home size={18} /> الرئيسية</Link>
        {isLoggedIn && (
          <>
            <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} style={styles.link(location.pathname.includes('dashboard') || location.pathname.includes('panel'))}><LayoutDashboard size={18} /> لوحة التحكم</Link>
            <div style={{ padding: '5px 0', fontSize: '14px', color: '#64748B', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={16} /> {userName}</div>
            <button onClick={handleLogout} style={{...styles.logoutBtn, padding: '5px 0', justifyContent: 'flex-start'}}><LogOut size={18} /> تسجيل الخروج</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
