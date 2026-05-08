import api from '../api/axios';

export async function signup({ fullName, email, password }) {
  const payload = { name: fullName, email, password };
  const res = await api.post('/auth/signup', payload);
  // if API returns token, store it
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token);
  }
  if (res.data?.user) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token);
  }
  if (res.data?.user) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
