import http from 'service/http';

export const logout = async (): Promise<void> => {
  await http.delete('/logout');
};
