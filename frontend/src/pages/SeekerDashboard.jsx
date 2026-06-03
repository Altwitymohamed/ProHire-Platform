import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Search, MapPin, DollarSign, CheckCircle, Clock, Upload, FileText, Briefcase, ChevronDown, ChevronUp, Mail, Info, Star, ShieldCheck, Zap, UserCheck } from 'lucide-react';

export default function SeekerDashboard() {
  const [activeTab, setActiveTab] = useState('browse');
  const [jobs, setJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [hasUploadedCV, setHasUploadedCV] = useState(false);
  const [search, setSearch] = useState('');
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState('');
  const [expandedJob, setExpandedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const userName = localStorage.getItem('userName');

  // جلب البيانات مع التأكد من استمرارية الحالة عند التحديث
  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes, userRes] = await Promise.all([
        API.get('/jobs'),
        API.get('/applications/my-status'),
        API.get('/auth/me')
      ]);
      setJobs(jobsRes.data);
      setMyApps(appsRes.data);
      // فحص وجود بيانات سابقة في قاعدة البيانات لضمان ثباتها
      if (userRes.data?.seekerDetails?.cvPath) {
        setHasUploadedCV(true);
        setSkills(userRes.data.seekerDetails.skills || '');
      }
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleApply = async (jobId) => {
    if (!hasUploadedCV) return alert('⚠️ يرجى إكمال ملفك المهني ورفع الـ CV أولاً من تبويب (ملفي المهني)');
    try {
      await API.post('/applications/apply', { jobId });
      alert('✅ تم إرسال طلبك بنجاح!');
      fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'لقد تقدمت مسبقاً لهذه الوظيفة'); }
  };

  const handleUploadCV = async (e) => {
    e.preventDefault();
    if (!skills.trim()) return alert('⚠️ يرجى كتابة مهاراتك أولاً');

    const formData = new FormData();
    if (file) formData.append('cv', file[0]);
    formData.append('skills', skills);

    try {
      await API.post('/auth/update-profile', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      // رسالة ذكية: رفع أول مرة أو تحديث
      const successMsg = hasUploadedCV ? '✅ تم تحديث بياناتك بنجاح' : '✅ تم رفع بياناتك ونشر ملفك المهني بنجاح';
      alert(successMsg);
      setHasUploadedCV(true);
      fetchData();
      setActiveTab('browse');
    } catch (err) { alert('خطأ في الرفع'); }
  };

  const styles = {
    container: { backgroundColor: '#F1F5F9', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif", paddingBottom: '50px' },
    header: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '60px 20px 100px', textAlign: 'right', color: 'white', borderRadius: '0 0 60px 60px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    tabContainer: { display: 'flex', gap: '12px', padding: '8px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '-40px auto 40px' },
    tabBtn: (active) => ({ flex: 1, padding: '16px 20px', border: 'none', borderRadius: '18px', cursor: 'pointer', fontWeight: '800', transition: 'all 0.3s ease', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: active ? '#2563eb' : 'transparent', color: active ? 'white' : '#64748b' }),
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', marginBottom: '20px', position: 'relative' },
    input: { width: '100%', padding: '18px 25px', borderRadius: '18px', border: '2px solid #E2E8F0', outline: 'none', textAlign: 'right', fontSize: '16px', backgroundColor: 'white', fontWeight: '500', boxSizing: 'border-box' },
    btnPrimary: { padding: '18px 30px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
    tag: { padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }
  };

  return (
    <div style={styles.container} dir="rtl">
      <div style={styles.header}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>أهلاً، {userName} 👋</h1>
                <p style={{ fontSize: '16px', opacity: 0.8, marginTop: '8px' }}>نحن هنا لمساعدتك في إيجاد وظيفة أحلامك</p>
             </div>
             {hasUploadedCV ? 
               <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', padding: '10px 20px', borderRadius: '20px', border: '1px solid #22c55e', color: '#4ade80', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20}/> ملفك موثق</div> :
               <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '20px', border: '1px solid #ef4444', color: '#f87171', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={20}/> استكمل ملفك</div>
             }
          </div>
        </div>
      </div>

      <div style={styles.tabContainer}>
        <button style={styles.tabBtn(activeTab === 'browse')} onClick={() => setActiveTab('browse')}><Search size={20}/> تصفح</button>
        <button style={styles.tabBtn(activeTab === 'profile')} onClick={() => setActiveTab('profile')}><FileText size={20}/> ملفي</button>
        <button style={styles.tabBtn(activeTab === 'my_apps')} onClick={() => setActiveTab('my_apps')}><Star size={20}/> طلباتي</button>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 20px' }}>
        
        {activeTab === 'browse' && (
          <div>
            <input style={{ ...styles.input, border: '2px solid #2563eb', marginBottom: '30px' }} placeholder="🔍 ابحث عن وظيفة..." onChange={(e)=>setSearch(e.target.value)} />
            {jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase())).map(job => {
              const applied = myApps.find(a => a.jobId?._id === job._id);
              const isExpanded = expandedJob === job._id;
              return (
                <div key={job._id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: '900', fontSize: '22px', color: '#0f172a', margin: 0 }}>{job.title}</h3>
                      <p style={{ color: '#2563eb', fontWeight: '800', margin: '5px 0 15px' }}>{job.company}</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={styles.tag}><MapPin size={14}/> {job.location}</div>
                        <div style={styles.tag}><DollarSign size={14}/> {job.salary}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => handleApply(job._id)} disabled={!!applied || !hasUploadedCV} style={{ padding: '14px 25px', backgroundColor: applied ? '#22c55e' : '#0f172a', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', opacity: (!hasUploadedCV && !applied) ? 0.5 : 1 }}>
                        {applied ? 'تم التقديم' : 'تقديم سريع'}
                      </button>
                      <button onClick={() => setExpandedJob(isExpanded ? null : job._id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '700', fontSize: '13px', textDecoration: 'underline' }}>{isExpanded ? 'إخفاء' : 'التفاصيل'}</button>
                    </div>
                  </div>
                  {isExpanded && <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '15px', border: '1px dashed #cbd5e1' }}>{job.description}</div>}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={styles.card}>
            <h2 style={{ fontWeight: '900', fontSize: '24px', textAlign: 'center', marginBottom: '30px' }}>تحديث هويتك المهنية</h2>
            <form onSubmit={handleUploadCV} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <label style={{ fontWeight: '800', display: 'block', marginBottom: '10px', color: '#334155' }}>مهاراتك (مطلوب) <span style={{color:'#ef4444'}}>*</span></label>
                <input style={styles.input} value={skills} onChange={(e)=>setSkills(e.target.value)} placeholder="مثال: مبرمج ريأكت، مصمم UI/UX، خبير مبيعات" required />
              </div>
              <div>
                <label style={{ fontWeight: '800', display: 'block', marginBottom: '10px', color: '#334155' }}>ملف السيرة الذاتية (PDF)</label>
                <div style={{ border: '2px dashed #cbd5e1', padding: '30px', borderRadius: '20px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <input type="file" accept=".pdf" style={{ display: 'block', margin: '0 auto 10px' }} onChange={(e)=>setFile(e.target.files)} />
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>{file ? `تم اختيار: ${file[0].name}` : (hasUploadedCV ? 'لديك ملف محفوظ مسبقاً' : 'الحد الأقصى 5MB')}</p>
                </div>
              </div>
              <button type="submit" style={styles.btnPrimary}><CheckCircle size={20}/> {hasUploadedCV ? 'حفظ التحديثات' : 'حفظ ونشر ملفي المهني'}</button>
            </form>
          </div>
        )}

        {activeTab === 'my_apps' && (
          <div>
            {myApps.length === 0 ? <p style={{textAlign:'center', padding:'50px', color:'#64748b'}}>لم تتقدم على أي وظيفة بعد</p> : 
              myApps.map(app => (
              <div key={app._id} style={{ ...styles.card, borderRight: `8px solid ${app.status === 'accepted' ? '#22c55e' : '#f59e0b'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><h3 style={{ fontWeight: '900', fontSize: '18px', margin: 0 }}>{app.jobId?.title}</h3><p style={{ color: '#64748b', fontWeight: '700', margin: '5px 0 0' }}>{app.jobId?.company}</p></div>
                  <span style={{ backgroundColor: app.status === 'accepted' ? '#dcfce7' : '#fef3c7', color: app.status === 'accepted' ? '#166534' : '#92400e', padding: '8px 16px', borderRadius: '12px', fontWeight: '900', fontSize: '13px' }}>{app.status === 'accepted' ? 'تم قبولك ✅' : 'قيد المراجعة 🕒'}</span>
                </div>
                {app.status === 'accepted' && (
                  <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <p style={{ margin: 0, fontWeight: '800', color: '#166534', fontSize: '14px' }}>تواصل مع الشركة: <b>{app.jobId?.employerEmail}</b></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
