import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Phone, Cpu, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const token = localStorage.getItem('token');

  if (!token || window.location.pathname === '/login' || window.location.pathname === '/register') return null;

  const styles = {
    footer: {
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '50px 6% 30px',
      color: '#94a3b8',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      boxShadow: '0 -15px 35px rgba(0, 0, 0, 0.2)',
      
      // ✨ اللمسة الهندسية المطلوبة: تدوير الحواف العلوية فقط لجعل الزوايا منحنية وفخمة
      borderTopLeftRadius: '40px',
      borderTopRightRadius: '40px',
      
      boxSizing: 'border-box'
    },
    topGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      paddingBottom: '40px'
    },
    brandColumn: { display: 'flex', flexDirection: 'column', gap: '15px' },
    linkColumn: { display: 'flex', flexDirection: 'column', gap: '12px' },
    columnTitle: { color: '#ffffff', fontSize: '16px', fontWeight: '800', margin: '0 0 10px 0', position: 'relative', paddingRight: '12px', borderRight: '3px solid #3b82f6' },
    footerLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '5px' },
    techBadge: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(59, 130, 246, 0.06)', padding: '12px 28px', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#ffffff', fontWeight: '800', fontSize: '14px', boxShadow: '0 0 20px rgba(37, 99, 235, 0.1)', width: 'fit-content' },
    engineerName: { background: 'linear-gradient(to left, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 15px rgba(59, 130, 246, 0.3)' },
    bottomBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '13px' },
    contactWidget: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '10px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#ffffff', textDecoration: 'none', fontWeight: '700', transition: 'all 0.3s ease' }
  };

  return (
    <footer style={styles.footer} dir="rtl">
      <div style={styles.topGrid}>
        <div style={styles.brandColumn}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontWeight: '900', fontSize: '22px' }}>
            <Briefcase size={24} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} />
            <span>ProHire</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: '5px 0 0', opacity: 0.7 }}>
            المنصة الذكية الرائدة لربط الكفاءات المهنية بأصحاب الأعمال عبر بيئة توظيف آمنة وموثقة بالكامل.
          </p>
        </div>

        <div style={styles.linkColumn}>
          <h4 style={styles.columnTitle}>للباحثين عن عمل</h4>
          <Link to="/seeker-dashboard" style={styles.footerLink} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><ArrowUpRight size={14}/> تصفح الفرص المتاحة</Link>
          <Link to="/seeker-dashboard" style={styles.footerLink} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><ArrowUpRight size={14}/> تحديث الملف المهني والـ CV</Link>
        </div>

        <div style={{...styles.linkColumn, paddingLeft: '20px'}}>
          <h4 style={styles.columnTitle}>لأصحاب الأعمال</h4>
          <Link to="/employer-dashboard" style={styles.footerLink} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><ArrowUpRight size={14}/> نشر فرصة عمل جديدة</Link>
          <Link to="/employer-dashboard" style={styles.footerLink} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}><ArrowUpRight size={14}/> إدارة المتقدمين والتوثيق</Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={styles.techBadge}>
          <Cpu size={18} color="#3b82f6" />
          <span>تطوير وإشراف الهندسة التقنية الفاخرة | <span style={styles.engineerName}>المهندس محمد التويتي</span></span>
          <ShieldCheck size={18} color="#10b981" />
        </div>
      </div>

      <div style={styles.bottomBar}>
        <div style={{ opacity: 0.5, fontWeight: '500' }}>حقوق الطبع والنشر © {new Date().getFullYear()} ProHire. جميع الحقوق محفوظة.</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="tel:+967772852542" style={styles.contactWidget} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'; e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}><Phone size={14} color="#3b82f6" /> <span>اتصال مباشر: 772852542</span></a>
        </div>
      </div>
    </footer>
  );
}
