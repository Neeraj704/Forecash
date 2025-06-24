import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/authStore';
import { getMe } from './api/user';

export default function App(){
  const { user, setAuth, setToken, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    setToken(token);

    getMe(token)
      .then(res => {
        setAuth({ user: res.data, token });
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setAuth, setToken, logout]);

  if (loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }

  return (
    <BrowserRouter>
      <div className='bg-[#1E1E21]'>
        <Routes>
          <Route path="/auth" element={!user ? <AuthPage/> : <Navigate to="/dashboard" replace/>}/>
          <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/auth" replace/>}/>
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} replace/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
