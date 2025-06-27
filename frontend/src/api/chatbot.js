import axios from 'axios';

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL;

export const askChatBot = (payload) =>
  axios.post(CHATBOT_URL, payload, { 
    timeout: 30000
  }
);
