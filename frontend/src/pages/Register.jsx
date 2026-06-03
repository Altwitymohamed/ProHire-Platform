import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'seeker', description: '', website: '', address: '' });
  const navigate = useNavigate();

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#F8FAFC' },
    card: { backgroundColor: 'white', width: '100%', maxWidth: '500px', padding: '45px', borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', border: '2px solid #E2E8F0', textAlign: 'right', fontFamily: 'sans-serif' },
    label: { fontWeight: '800', color: '#1E293B', marginBottom: '8px', display: 'block', fontSize: '15px' },
    input: { width: '100%', padding: '16px', marginTop: '5px', marginBottom: '20px', borderRadius: '16px', border: '2px solid #CBD5E1', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box', fontSize: '15px', transition: '0.3s' },
    button: { width: '100%', padding: '18px', backgroundColor: '#0F172A', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' },
    tabContainer: { display: 'flex', gap: '10px', marginBottom: '35px', backgroundColor: '#E2E8F0', padding: '6px', borderRadius: '20px', border: '1px solid #CBD5E1' },
    tab: (active) => ({ flex: 1, padding: '14px', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: '900', backgroundColor: active ? '#3B82F6' : 'transparent', color: active ? 'white' : '#64748B', transition: '0.3s' })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // التحقق من تعبئة الحقول المطلوبة برمجياً قبل الإرسال
    if (formData.role === 'employer' && !formData.address) {
      return alert('⚠️ يرجى إدخال عنوان الشركة');
    }
    try { 
      await API.post('/auth/register', formData); 
      alert('✅ تم التسجيل بنجاح!'); 
      navigate('/login'); 
    } catch (err) { 
      alert(err.response?.data?.msg || 'خطأ في البيانات'); 
    }
  };

  return (
    <div style={styles.container} dir='rtl'>
      <div style={styles.card}>
        <h2 style={{ fontWeight: '900', fontSize: '30px', marginBottom: '10px', color: '#0F172A' }}>إنشاء حساب جديد</h2>
        <p style={{ color: '#64748B', marginBottom: '30px', fontWeight: '600' }}>ابدأ رحلتك المهنية مع ProHire</p>
        
        <div style={styles.tabContainer}>
          <button type="button" style={styles.tab(formData.role === 'seeker')} onClick={() => setFormData({...formData, role: 'seeker'})}>باحث عن عمل</button>
          <button type="button" style={styles.tab(formData.role === 'employer')} onClick={() => setFormData({...formData, role: 'employer'})}>صاحب شركة</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>{formData.role === 'employer' ? 'اسم الشركة *' : 'اسم المتقدم *'}</label>
          <input type='text' style={styles.input} onChange={e => setFormData({...formData, name: e.target.value})} placeholder='أدخل الاسم هنا' required />
          
          <label style={styles.label}>البريد الإلكتروني *</label>
          <input type='email' style={styles.input} onChange={e => setFormData({...formData, email: e.target.value})} placeholder='example@mail.com' required />
          
          <label style={styles.label}>كلمة المرور *</label>
          <input type='password' style={styles.input} onChange={e => setFormData({...formData, password: e.target.value})} placeholder='********' required />

          {formData.role === 'employer' && (
            <div style={{ borderTop: '2px dashed #E2E8F0', paddingTop: '20px', marginTop: '10px' }}>
              <label style={styles.label}>عنوان الشركة *</label>
              <input type='text' style={styles.input} onChange={e => setFormData({...formData, address: e.target.value})} placeholder='المدينة، الشارع' required />
            </div>
          )}
          
          <button type='submit' style={styles.button}>إنشاء الحساب الآن</button>
        </form>
      </div>
    </div>
  );
}
