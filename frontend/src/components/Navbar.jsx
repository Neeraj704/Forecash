import React from 'react';
import { useAuthStore } from '../store/authStore';
import { logout as apiLogout } from '../api/auth';

export default function Navbar(){
  const { logout } = useAuthStore();
  const handle = async ()=>{
    await apiLogout();
    logout();
  };
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div>Expenditure Predictor</div>
      <button onClick={handle} className="underline">Logout</button>
    </nav>
  );
}
