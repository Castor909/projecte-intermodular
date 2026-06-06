async function parseError(res, fallback) {
  try {
    const data = await res.json();
    if (data?.message) return data.message;
  } catch { /* ignore */ }
  return fallback;
}

export async function registerUser(email, password) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Registration failed'));
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Login failed'));
  return res.json();
}

export async function updateSavedAddress(token, address) {
  const res = await fetch('/api/auth/address', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Failed to save address'));
  return res.json();
}

export async function changePassword(token, currentPassword, newPassword) {
  const res = await fetch('/api/auth/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Failed to change password'));
  return res.json();
}

export async function confirmOrder(token, payload) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Order confirmation failed'));
  return res.json();
}
