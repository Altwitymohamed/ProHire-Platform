import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home'; // 🚀 استدعاء صفحة الرئيسية المستقلة الجديدة

import Navbar from './components/Navbar';
import Footer from './components/Footer'; // 👑 إعادة استدعاء الفوتر الفخم الخاص بك

function App() {
  return (
    <Router>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#F8FAFC', 
        fontFamily: "'Segoe UI', Roboto, sans-serif" 
      }}>
        
        <Navbar />
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/seeker-dashboard' element={<SeekerDashboard />} />
            <Route path='/employer-dashboard' element={<EmployerDashboard />} />
            <Route path='/admin-pro-panel' element={<AdminDashboard />} />
            
            {/* 🚀 تسجيل المسار المستقل والمطلوب للرفع */}
            <Route path='/home' element={<Home />} />
            
            <Route path='/' element={<Navigate to='/login' />} />
          </Routes>
        </div>

        {/* 👑 حقن الفوتر الفخم للمهندس محمد التويتي في الأسفل كما كان تماماً */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
