// src/services/vaccinationApi.js
const API_BASE = '/api/vaccinations';

function getToken() {
  let token =
    localStorage.getItem('access_token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token');
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      token = user?.token;
    } catch {}
  }
  return token;
}

export async function createVaccinationRecord(data) {
  const token = getToken();
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getVaccinationsByStudent(studentId) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/student/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteVaccinationRecord(id) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
} 