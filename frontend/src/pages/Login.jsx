import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#F1F5F9' },
    card: { backgroundColor: 'white', width: '100%', maxWidth: '480px', padding: '45px', borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: '2px solid #E2E8F0', textAlign: 'right', fontFamily: 'sans-serif' },
    label: { fontWeight: '800', color: '#1E293B', marginBottom: '8px', display: 'block', fontSize: '15px' },
    input: { width: '100%', padding: '16px', marginTop: '5px', marginBottom: '20px', borderRadius: '16px', border: '2px solid #CBD5E1', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box', fontSize: '16px', fontWeight: '500', transition: '0.3s' },
    button: { width: '100%', padding: '18px', backgroundColor: '#0F172A', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', transition: '0.3s' },
    link: { color: '#2563eb', fontWeight: '900', textDecoration: 'none', fontSize: '15px' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);
      
      if (res.data.user.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    } catch (err) {
      alert('⚠️ عذراً، بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div style={styles.container} dir='rtl'>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
           <h2 style={{ fontWeight: '900', fontSize: '32px', color: '#0F172A', margin: 0 }}>تسجيل الدخول</h2>
           <p style={{ color: '#64748B', marginTop: '10px', fontWeight: '600' }}>مرحباً بك مجدداً في منصة ProHire</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>البريد الإلكتروني</label>
          <input type='email' style={styles.input} placeholder='example@mail.com' onChange={e => setFormData({...formData, email: e.target.value})} required />
          
          <label style={styles.label}>كلمة المرور</label>
          <input type='password' style={styles.input} placeholder='••••••••' onChange={e => setFormData({...formData, password: e.target.value})} required />
          
          <button 
            type='submit' 
            style={styles.button} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
          >
            دخول آمن للمنصة
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '25px', color: '#64748B', fontWeight: '500' }}>
            ليس لديك حساب؟ <a href='/register' style={styles.link}>أنشئ حسابك الآن</a>
          </div>
        </form>
      </div>
    </div>
  );
}
