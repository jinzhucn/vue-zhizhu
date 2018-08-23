import axios from 'axios';
import queryString from 'querystring';

const axiosByJson = axios.create({
  baseURL: 'http://localhost:1031/zhizhu/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosByKeyValue = axios.create({
  baseURL: 'http://localhost:1031/zhizhu/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest(data) {
    return queryString.stringify(data);
  },
});

export {
  axiosByJson,
  axiosByKeyValue,
};
