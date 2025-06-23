import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar(){
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <Link to="/dashboard" className="block mb-2">Dashboard</Link>
    </aside>
  );
}
