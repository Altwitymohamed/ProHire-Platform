import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// استدعاء المكونات المشتركة الفخمة
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // استدعاء الفوتر الذي أنشأناه للتو

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
        
        {/* حقن الهيدر الذكي المطور في الأعلى */}
        <Navbar />
        
        {/* صندوق المنتصف المرن لاستقبال الصفحات */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/seeker-dashboard' element={<SeekerDashboard />} />
            <Route path='/employer-dashboard' element={<EmployerDashboard />} />
            <Route path='/admin-pro-panel' element={<AdminDashboard />} />
            <Route path='/' element={<Navigate to='/login' />} />
          </Routes>
        </div>

        {/* حقن الفوتر الفخم للمهندس محمد التويتي في الأسفل */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
