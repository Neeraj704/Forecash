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
    <nav className="max-h-16 bg-[#2E3137] rounded-4xl shadow  text-white p-4 flex justify-between m-3">
      <div>ForeCash</div>
      <button onClick={handle} className="underline">Logout</button>
    </nav>
  );
}
