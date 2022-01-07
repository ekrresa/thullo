import axios from 'axios';

const controller = new AbortController();

export const axiosClient = axios.create({ signal: controller.signal });
export default axios;
