import api from '../api/axios';

// One day in milliseconds (24 * 60 * 60 * 1000)
const ONE_DAY_MS = 86400000;

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * ONE_DAY_MS).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/${secure}; SameSite=Strict`;
}

function extractToken(data) {
  // Explicitly extract access_token from API response as per spec
  return data?.access_token || null;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=', 2);
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, null);
}

function deleteCookie(name) {
  document.cookie = `${name}=; Expires=${new Date(0).toUTCString()}; Path=/; SameSite=Strict`;
}

function persistAuthSession(data) {
  const token = extractToken(data);
  if (token) {
    setCookie('auth_token', token, 7);
  }

  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}

export async function signup({ firstName, lastName, email, password }) {
  const payload = {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  };
  const res = await api.post('/auth/signup', payload);
  return res.data;
}

export async function verifyEmail({ email, code }) {
  const res = await api.post('/auth/verify-email', { email, code });
  persistAuthSession(res.data);
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  persistAuthSession(res.data);
  return res.data;
}

export function logout() {
  deleteCookie('auth_token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const u = localStorage.getItem('user');
  if (!u) return null;

  try {
    return JSON.parse(u);
  } catch {
    return null;
  }
}

export function getTokenFromCookie() {
  return getCookie('auth_token');
}
