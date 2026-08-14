export const BASE_URL = 'https://api-test.gomytruck.com/api/v1';

export async function sendOtp(phone, role = 'CUSTOMER') {
  const res = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, role }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to send OTP (${res.status})`);
  }
  return json;
}

export async function verifyOtp(phone, otp, role = 'CUSTOMER') {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp, role }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to verify OTP (${res.status})`);
  }
  return json.data; // Usually { user, tokens: { access, refresh } }
}
