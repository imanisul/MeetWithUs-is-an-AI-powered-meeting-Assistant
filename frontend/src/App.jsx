import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role || 'user');
      } catch (err) {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
      }
    } else {
      setRole(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="min-h-screen">
        <nav className="navbar glass mb-4">
          <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>MeetWithUs 🚀</Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {role === 'admin' && <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Admin View</span>}
            {token ? (
              <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border-color)', color: 'white', background: 'transparent' }}>Logout</button>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign In</Link>
            )}
          </div>
        </nav>
        
        <main className="container animate-fade-in">
          <Routes>
            <Route path="/" element={
              !token ? <Navigate to="/login" /> : 
              role === 'admin' ? <AdminDashboard token={token} /> : <UserDashboard token={token} />
            } />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
