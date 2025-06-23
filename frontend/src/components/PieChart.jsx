// frontend/src/components/PieChart.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getTransactions } from '../api/transaction';
import { useAuthStore } from '../store/authStore';

export default function CategoryPieChart() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState([]);

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

  const colors = ['#0088FE','#00C49F','#FFBB28','#FF8042'];

  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
        {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
