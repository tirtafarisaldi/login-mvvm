/**
 * Validate token dari localStorage
 * Jika Anda memiliki endpoint untuk validasi token, gunakan ini
 */
export const validateAccessToken = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    // Uncomment jika Anda memiliki endpoint /validate-token di API
    // const response = await http.get('/validate-token');
    // if (!response || response.error) {
    //   localStorage.removeItem('token');
    //   throw new Error('Token invalid');
    // }
    // return response;
  } catch (error) {
    console.log('Token validation failed:', error);
    localStorage.removeItem('token');
    throw error;
  }
};
