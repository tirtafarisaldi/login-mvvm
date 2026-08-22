import http from 'service/http';

export const getInventories = async () => http.get('/inventories');
