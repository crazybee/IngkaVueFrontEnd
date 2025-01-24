import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://reports.semopx.com/api/v1/documents/',
  timeout: 5000,
});

export default instance;
