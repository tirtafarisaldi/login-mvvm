import Axios from 'axios';

const baseApiURL = process.env.API_BASE_URL;

const api = Axios.create({
  baseURL: baseApiURL,
  headers: {
    Accept: 'application/json'
  }
});

export default api;
