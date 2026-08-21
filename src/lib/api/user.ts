export async function apiGetUser() {
  const res = await fetch('http://localhost:4000/api/user', {
    credentials: 'include',
  });
  return res.json();
}

export async function apiUpdateUser(payload: { name?: string }) {
  const res = await fetch('http://localhost:4000/api/user', {
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
  const res = await fetch('http://localhost:4000/api/user/avatar', {
    method: 'POST',
    credentials: 'include',
    body: fd,
  });
  return res.json();
}

export async function apiChangePassword(currentPassword: string, newPassword: string) {
  const res = await fetch('http://localhost:4000/api/user/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
}

export async function apiDeactivateUser() {
  const res = await fetch('http://localhost:4000/api/user/deactivate', {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}

export async function apiDeleteUser() {
  const res = await fetch('http://localhost:4000/api/user/delete', {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}
