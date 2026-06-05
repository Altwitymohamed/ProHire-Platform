import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLiveStats } from '../services/apiService';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ jobs: 0, companies: 0, applicants: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user.role) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
    getLiveStats().then(data => {
      setStats({
        jobs: data.jobs || 0,
        companies: data.companies || 0,
        applicants: data.applicants || 0
      });
    });
  }, []);

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", position: 'relative', overflow: 'hidden' },
    heroSection: { maxWidth: '800px', textAlign: 'center', marginTop: '60px', zIndex: 2 },
    title: { fontSize: '2.8rem', fontWeight: '900', marginBottom: '20px', background: 'linear-gradient(to right, #22D3EE, #F43F5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    description: { fontSize: '1.1rem', color: '#94A3B8', lineHeight: '1.7', marginBottom: '35px' },
    btnContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px' },
    primaryBtn: { padding: '12px 30px', backgroundColor: '#22D3EE', color: '#0F172A', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 0 15px rgba(34,211,238,0.3)', transition: 'all 0.3s' },
    statsContainer: { width: '100%', maxWidth: '850px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', zIndex: 2, marginBottom: '50px' },
    statsCard: { backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '25px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' },
    statsNum: { fontSize: '2.2rem', fontWeight: '800', color: '#38BDF8', marginBottom: '5px' },
    statsLabel: { fontSize: '0.9rem', color: '#94A3B8', fontWeight: '500' },
    featuresContainer: { width: '100%', maxWidth: '850px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', zIndex: 2 },
    featureCard: { backgroundColor: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '16px' },
    featureTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '10px' },
    featureText: { fontSize: '0.85rem', color: '#64748B', lineHeight: '1.6' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.title}>منصتك الذكية للتوظيف الاحترافي</h1>
        <p style={styles.description}>بوابتك الرقمية الحديثة لربط الكفاءات الهندسية والمبدعين بأبرز الشركات العالمية. أعلن عن فرصتك أو انطلق في مسيرتك المهنية الآن بضغطة زر.</p>
        <div style={styles.btnContainer}>
          <button onClick={() => navigate(isLoggedIn ? (userRole === 'admin' ? '/admin-pro-panel' : userRole === 'employer' ? '/employer-dashboard' : '/seeker-dashboard') : '/login')} style={styles.primaryBtn}>
            {isLoggedIn ? '👑 الانتقال الفوري إلى لوحة تحكمك' : '🚀 ابدأ تصفح المنصة الآن'}
          </button>
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statsCard}>
          <div style={styles.statsNum}>+{stats.jobs}</div>
          <div style={styles.statsLabel}>فرصة وظيفة نشطة</div>
        </div>
        <div style={styles.statsCard}>
          <div style={{...styles.statsNum, color: '#F43F5E'}}>+{stats.companies}</div>
          <div style={styles.statsLabel}>شركة ومؤسسة موثقة</div>
        </div>
        <div style={styles.statsCard}>
          <div style={{...styles.statsNum, color: '#10B981'}}>+{stats.applicants}</div>
          <div style={styles.statsLabel}>طلب توظيف مكتمل</div>
        </div>
      </div>

      <div style={styles.featuresContainer}>
        <div style={styles.featureCard}>
          <div style={styles.featureTitle}>⚡ تقديم سريع بضغطة زر</div>
          <p style={styles.featureText}>ارفع ملفك المهني وقدم مباشرة للوظائف المتوافقة مع مهاراتك دون خطوات معقدة.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureTitle}>🛡️ شركات موثقة بالكامل</div>
          <p style={styles.featureText}>نظام فحص صارم لحسابات أصحاب العمل لضمان مصداقية الإعلانات وحماية المتقدمين.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureTitle}>📊 متابعة حية للطلبات</div>
          <p style={styles.featureText}>لوحة تحكم ذكية تعرض لك تحديثات حالة طلبك (قيد المراجعة، مقبول، مرفوض) أولاً بأول.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
