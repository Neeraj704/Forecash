import React, { useState } from 'react';
import { signup } from '../api/auth';

export default function SignupForm(){
  const [email,setEmail]=useState(''),
        [name,setName]=useState(''),
        [pw,setPw]=useState('');
  const handle = async e=>{
    e.preventDefault();
    try {
      await signup({email,name,password:pw});
      alert('Signup successful! Please login.');
    } catch{ alert('Signup failed'); }
  };
  return (
    <form onSubmit={handle} className="space-y-4">
      <input type="text" placeholder="Name" value={name}
            onChange={e=>setName(e.target.value)} className="w-full border p-2" required/>
      <input type="email" placeholder="Email" value={email}
            onChange={e=>setEmail(e.target.value)} className="w-full border p-2" required/>
      <input type="password" placeholder="Password" value={pw}
            onChange={e=>setPw(e.target.value)} className="w-full border p-2" required/>
      <button type="submit" className="w-full bg-green-500 text-white p-2">Signup</button>
    </form>
  );
}
