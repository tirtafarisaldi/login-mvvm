import http from 'service/http';

export const loginBySSO = () => {
  // Arahkan browser (full navigation, bukan fetch) ke endpoint CAS backend.
  // Backend meneruskan redirect ke login.pens.ac.id/cas lalu kembali lagi ke
  // frontend membawa kode sekali pakai (?code=...). Kode ditukar ke access
  // token oleh AuthProvider saat bootstrap. Endpoint melewati proxy /api (yang
  // otomatis menambahkan x-api-key), sehingga cukup navigasi biasa.
  if (typeof window !== 'undefined') {
    window.location.href = '/api/auth/cas/login';
  }
};

export interface LoginByEmailInput {
  email: string;
  password: string;
}

// Login email/password lama sudah diganti SSO CAS, dipertahankan sebagai
// dokumentasi/fallback bila suatu saat register manual diperlukan kembali.
export const loginByEmail = async (input: LoginByEmailInput) => {
  return http.post('/login', { email: input.email, password: input.password });
};
