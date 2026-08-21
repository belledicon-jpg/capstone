const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function apiGetUser() {
  const res = await fetch(`${API_BASE}/api/user`, {
    credentials: 'include',
  });
  return res.json();
}

export async function apiUpdateUser(payload: { name?: string }) {
  const res = await fetch(`${API_BASE}/api/user`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function apiUploadAvatar(file: File) {
  const fd = new FormData();
  fd.append('avatar', file);
  const res = await fetch(`${API_BASE}/api/user/avatar`, {
    method: 'POST',
    credentials: 'include',
    body: fd,
  });
  return res.json();
}

export async function apiChangePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/api/user/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
}

export async function apiDeactivateUser() {
  const res = await fetch(`${API_BASE}/api/user/deactivate`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}

export async function apiDeleteUser() {
  const res = await fetch(`${API_BASE}/api/user/delete`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}
