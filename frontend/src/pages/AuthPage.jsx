import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export default function AuthPage(){
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 shadow-lg rounded">
        {isLogin ? <LoginForm/> : <SignupForm/>}
        <button onClick={()=>setIsLogin(!isLogin)} className="mt-4 text-blue-500">
          {isLogin ? "Don't have an account? Sign up" : "Already have one? Log in"}
        </button>
      </div>
    </div>
  );
}
