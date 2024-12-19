import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import History from './pages/History';
import Intervention from './pages/Intervention';
import Employee from './pages/Employee';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword'
import AdminDashboard from './pages/AdminDashboard'
import AdminHistory from './pages/AdminHistory'
import AdminSettings from './pages/AdminSettings'



export default function App() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    localStorage.setItem('sidebarOpen', 'false');
  }

  return (
    <>
      {screenWidth && (
              <Router>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/admindashboard' element={<AdminDashboard />} />
            <Route path='/history' element={<History />} />
            <Route path='/adminhistory' element={<AdminHistory />} />
            <Route path='/employee' element={<Employee />} />
            <Route path='/intervention' element={<Intervention />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/adminsettings' element={<AdminSettings />} />
            <Route path='/forgot-password' element={<ForgotPassword/>} />
            <Route path='/ChangePassword' element={<ChangePassword />} />
                  </Routes>
        </Router>
      )}
    </>
  )
}