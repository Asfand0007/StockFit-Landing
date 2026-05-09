import api from '../api/axios';

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/${secure}; SameSite=Lax`;
}

function extractToken(data) {
  return data?.token || data?.accessToken || data?.data?.token || data?.data?.accessToken || null;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, null);
}

function deleteCookie(name) {
  document.cookie = `${name}=; Expires=${new Date(0).toUTCString()}; Path=/; SameSite=Lax`;
}

export async function signup({ fullName, email, password }) {
  const payload = { name: fullName, email, password };
  const res = await api.post('/auth/signup', payload);
  const token = extractToken(res.data);
  // if API returns token, store it in cookie
  if (token) {
    setCookie('token', token, 7);
    // also keep in localStorage for compatibility
    localStorage.setItem('token', token);
  }
  if (res.data?.user) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  const token = extractToken(res.data);
  if (token) {
    setCookie('token', token, 7);
    localStorage.setItem('token', token);
  }
  if (res.data?.user) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
}

export function logout() {
  deleteCookie('token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function getTokenFromCookie() {
  return getCookie('token') || localStorage.getItem('token');
}
