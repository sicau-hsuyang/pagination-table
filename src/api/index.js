import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:7001',
  timeout: 30000,
})

export default http;
