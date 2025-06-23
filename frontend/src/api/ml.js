import axios from 'axios';
import { distributeSavings } from './goal';

const URL = import.meta.env.VITE_API_URL;
export const getMockSavings = token =>
  axios.get(`${URL}/ml/savings`, { headers:{Authorization:`Bearer ${token}`}});
export const runMLAndDistribute = async (token) => {
  const { data } = await axios.get(`${URL}/ml/savings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  await distributeSavings(data.amount, token);
  return data.amount; 
};
