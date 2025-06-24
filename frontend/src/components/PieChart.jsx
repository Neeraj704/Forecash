// frontend/src/components/CategoryDonutChart.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getTransactions } from '../api/transaction';
import { useAuthStore } from '../store/authStore';

const COLORS = ['#ed7f19','#eae3e3','#eddf19','#84e0ee', 'FF6B6B']; 

export default function CategoryDonutChart() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getTransactions(accessToken);
      const agg = {};
      res.data.forEach(t => {
        const name = t.category.name;
        agg[name] = (agg[name] || 0) + t.amount;
      });
      setData(Object.entries(agg).map(([name, value]) => ({ name, value })));
    })();
  }, [accessToken]);

  return (
    <div>
      <div className='flex justify-between'>
        <div className="text-white text-lg font-medium mb-2">Your Spendings</div>
        <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-4xl border border-[#444446] shadow-sm px-4 py-2 bg-transparent text-sm font-medium text-white hover:bg-gray-700 focus:outline-none cursor-pointer"
            onClick={() => setOpen(!open)}
          >
              Month
            <svg className="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1 text-black">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">January</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">February</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">March</button>
            </div>
          </div>
        )}
      </div>
      </div>
      <div className='flex justify-center'>
        <PieChart width={350} height={250}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="flex justify-around mt-4 text-sm text-gray-300">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
