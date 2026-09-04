export const logout = async (): Promise<void> => {
  // Logout CAS mengharuskan full navigation (bukan fetch/axios): backend
  // membersihkan sesi lalu mengarahkan browser ke halaman logout CAS dan
  // kembali lagi ke frontend. Redirect lintas-origin hanya bisa diikuti oleh
  // navigasi penuh browser, bukan request fetch.
  if (typeof window !== 'undefined') {
    window.location.href = '/api/auth/cas/logout';
  }
};
