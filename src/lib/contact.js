// src/lib/contact.js
import api from '@/lib/axios';

export async function sendContactMessage(payload) {
  const { data } = await api.post('/contact', payload);
  return data;
}