import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { PlusCircle, Users, Download, ShieldCheck, Briefcase, Loader2, AlertCircle, Send, LayoutDashboard, FilePlus, CheckCircle2, Mail, ExternalLink, TrendingUp } from 'lucide-react';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('manage');
  const [employerData, setEmployerData] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', description: '', location: '', salary: '' });
  const userName = localStorage.getItem('userName');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [res, userRes] = await Promise.all([
        API.get('/applications/employer-data'),
        API.get('/auth/me')
      ]);
      setEmployerData(res.data);
      setIsVerified(userRes.data.companyDetails?.isVerified);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!isVerified) return alert('⚠️ الحساب غير موثق بعد');
    try {
      await API.post('/jobs', jobForm);
      alert('✅ تم نشر الوظيفة بنجاح!');
      setJobForm({ title: '', description: '', location: '', salary: '' });
      setActiveTab('manage');
    } catch (err) { alert('خطأ في النشر'); }
  };

  const handleStatus = async (appId, status) => {
    try {
      await API.put('/applications/update-status', { appId, status });
      alert('✅ تم قبول المتقدم وإرسال بريدك له');
      fetchData();
    } catch (err) { alert('خطأ'); }
  };

  const styles = {
    container: { backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    header: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '50px 20px 80px', color: 'white', borderRadius: '0 0 50px 50px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    statsContainer: { display: 'flex', gap: '20px', maxWidth: '1000px', margin: '-40px auto 40px', padding: '0 20px' },
    statCard: { flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '28px', boxShadow: '0 15px 25px -5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #E2E8F0' },
    tabContainer: { display: 'flex', gap: '10px', padding: '6px', backgroundColor: '#e2e8f0', borderRadius: '20px', maxWidth: '500px', margin: '0 auto 40px' },
    tabBtn: (active) => ({ flex: 1, padding: '12px 20px', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '800', transition: '0.3s', backgroundColor: active ? '#2563eb' : 'transparent', color: active ? 'white' : '#64748b' }),
    card: { backgroundColor: 'white', padding: '35px', borderRadius: '35px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '25px' },
    input: { width: '100%', padding: '16px 20px', borderRadius: '15px', border: '2px solid #E2E8F0', outline: 'none', transition: '0.3s', fontSize: '15px', fontWeight: '500', boxSizing: 'border-box', backgroundColor: '#F9FAFB' },
    btnPrimary: { width: '100%', padding: '16px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', transition: '0.3s', fontSize: '16px' }
  };

  return (
    <div style={styles.container} dir="rtl">
      {/* Header القسم العلوي */}
      <div style={styles.header}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'right' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: '900', margin: 0 }}>لوحة إدارة الشركات 🏢</h1>
              <p style={{ opacity: 0.8, marginTop: '8px' }}>مرحباً {userName}، لنوظف الأفضل للشركة</p>
            </div>
            {isVerified ? 
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', padding: '10px 20px', borderRadius: '20px', border: '1px solid #3b82f6', color: '#60a5fa', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22}/> حساب موثق
              </div> :
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', padding: '10px 20px', borderRadius: '20px', border: '1px solid #f59e0b', color: '#fbbf24', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={22}/> بانتظار التوثيق
              </div>
            }
          </div>
        </div>
      </div>

      {/* Stats Cards إحصائيات سريعة */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '15px', color: '#2563eb' }}><Briefcase size={28}/></div>
          <div><p style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', margin: 0 }}>الوظائف</p><h2 style={{ margin: 0, fontWeight: '900' }}>{employerData.length}</h2></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '15px', color: '#22c55e' }}><Users size={28}/></div>
          <div><p style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', margin: 0 }}>إجمالي المتقدمين</p><h2 style={{ margin: 0, fontWeight: '900' }}>{employerData.reduce((acc, curr) => acc + curr.applicants.length, 0)}</h2></div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Navigation التبديل */}
        <div style={styles.tabContainer}>
          <button style={styles.tabBtn(activeTab === 'manage')} onClick={() => setActiveTab('manage')}><LayoutDashboard size={18} style={{marginLeft:'8px'}}/> إدارة المتقدمين</button>
          <button style={styles.tabBtn(activeTab === 'post')} onClick={() => setActiveTab('post')}><FilePlus size={18} style={{marginLeft:'8px'}}/> نشر وظيفة</button>
        </div>

        {activeTab === 'post' ? (
          <div style={{ ...styles.card, animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontWeight: '900', marginBottom: '30px', fontSize: '24px', color: '#0f172a', borderRight: '5px solid #2563eb', paddingRight: '15px' }}>تفاصيل الوظيفة الجديدة</h2>
            <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div><label style={{fontWeight:'800', color:'#475569', display:'block', marginBottom:'8px'}}>مسمى الوظيفة</label><input style={styles.input} value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="مثال: مدير تسويق رقمي" required /></div>
              <div><label style={{fontWeight:'800', color:'#475569', display:'block', marginBottom:'8px'}}>الوصف والشروط</label><textarea style={{...styles.input, height:'120px', resize:'none'}} value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} placeholder="اكتب متطلبات الوظيفة هنا..." required /></div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{flex:1}}><label style={{fontWeight:'800', color:'#475569', display:'block', marginBottom:'8px'}}>الموقع</label><input style={styles.input} value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="المدينة" required /></div>
                <div style={{flex:1}}><label style={{fontWeight:'800', color:'#475569', display:'block', marginBottom:'8px'}}>الراتب</label><input style={styles.input} value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="500$ - 800$" required /></div>
              </div>
              {!isVerified && <div style={{ backgroundColor: '#fff7ed', padding: '15px', borderRadius: '15px', border: '1px solid #ffedd5', color: '#9a3412', fontSize: '13px', fontWeight: '700' }}><AlertCircle size={16} style={{verticalAlign:'middle', marginLeft:'8px'}}/> لا يمكنك النشر حتى يتم توثيق حسابك. تواصل معنا: 772852542</div>}
              <button type="submit" disabled={!isVerified} style={{ ...styles.btnPrimary, opacity: isVerified ? 1 : 0.4 }}>نشر الوظيفة الآن <Send size={18} style={{marginRight:'10px'}}/></button>
            </form>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {loading ? <div style={{textAlign:'center', padding:'50px'}}><Loader2 className='animate-spin' size={40} color='#2563eb'/></div> : 
              employerData.map(item => (
                <div key={item.job._id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #F1F5F9', paddingBottom: '20px', marginBottom: '25px' }}>
                    <div>
                      <h3 style={{ fontWeight: '900', fontSize: '20px', margin: 0, color: '#0f172a' }}>{item.job.title}</h3>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 12px', borderRadius: '10px' }}>{item.applicants.length} متقدم</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>تم النشر في: {new Date(item.job.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  </div>

                  {item.applicants.length === 0 ? <p style={{ textAlign: 'center', color: '#94A3B8', padding: '20px', fontWeight: '600' }}>لم يتقدم أحد لهذه الوظيفة بعد.</p> : 
                    item.applicants.map(app => (
                      <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '22px', marginBottom: '15px', border: '1px solid #E2E8F0', transition: '0.3s' }}>
                        <div style={{ textAlign: 'right' }}>
                          <h4 style={{ fontWeight: '900', margin: 0, fontSize: '17px' }}>{app.applicant.name}</h4>
                          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={14}/> {app.applicant.email}</p>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb', marginTop: '5px' }}>المهارات: {app.applicant.skills || 'غير محددة'}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <a href={`http://localhost:5000${app.applicant.cvPath}`} target='_blank' style={{ padding: '12px', backgroundColor: 'white', borderRadius: '14px', color: '#0f172a', border: '2px solid #E2E8F0', display: 'flex', alignItems: 'center' }} title='تحميل السيرة الذاتية'><Download size={20}/></a>
                          {app.status === 'pending' ? (
                            <button onClick={() => handleStatus(app._id, 'accepted')} style={{ padding: '10px 25px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }}>قبول المتقدم</button>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#166534', fontWeight: '900', backgroundColor: '#dcfce7', padding: '10px 20px', borderRadius: '14px' }}><CheckCircle2 size={18}/> مقبول</div>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        input:focus, textarea:focus { border-color: #2563eb !absolute; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
      `}</style>
    </div>
  );
}
