import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { ShieldCheck, UserCheck, AlertCircle, Building2, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await API.get('/auth/pending-employers');
      setPending(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const handleVerify = async (id) => {
    try {
      await API.put(`/auth/verify-employer/${id}`);
      alert('تم توثيق الشركة بنجاح! يمكنهم الآن نشر الوظائف.');
      fetchPending();
    } catch (err) { alert('خطأ في عملية التوثيق'); }
  };

  const styles = {
    container: { padding: '40px 20px', backgroundColor: '#F8FAFC', minHeight: '100vh', textAlign: 'right', fontFamily: 'sans-serif' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0', marginBottom: '15px' },
    btn: { padding: '12px 25px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
  };

  return (
    <div style={styles.container} dir='rtl'>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '20px', marginBottom: '40px' }}>
          <h1 style={{ fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ShieldCheck size={35} color='#3B82F6'/> لوحة تحكم الإدارة
          </h1>
          <p style={{ color: '#64748B', marginTop: '10px' }}>مراجعة وتفعيل حسابات الشركات المسجلة حديثاً</p>
        </div>

        {loading ? <div style={{textAlign:'center'}}>جاري التحميل...</div> : 
          pending.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '30px', textAlign: 'center', color: '#94A3B8', border: '2px dashed #E2E8F0' }}>
              <Building2 size={50} style={{opacity:0.3, marginBottom:'15px'}} />
              <p style={{fontWeight:'bold'}}>لا توجد شركات تنتظر التوثيق حالياً</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {pending.map(company => (
                <div key={company._id} style={styles.card}>
                  <div>
                    <h3 style={{ fontWeight: '900', margin: 0, fontSize: '20px' }}>{company.name}</h3>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: '5px 0' }}>{company.email}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <span style={{ fontSize: '12px', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '8px' }}>العنوان: {company.companyDetails?.address || 'غير محدد'}</span>
                    </div>
                  </div>
                  <button onClick={() => handleVerify(company._id)} style={styles.btn}>
                    <UserCheck size={18}/> توثيق الشركة
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
