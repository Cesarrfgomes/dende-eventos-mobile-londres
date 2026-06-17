import axios from 'axios';
import Constants from 'expo-constants';

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ?? 'http://192.168.0.161:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.mensagem) {
      const e = new Error(error.response.data.mensagem);
      e.status = error.response.status;
      return Promise.reject(e);
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tempo de conexão esgotado. Verifique a API.'));
    }
    if (!error.response) {
      return Promise.reject(
        new Error(`Sem conexão com a API (${API_BASE_URL}). Verifique se o backend está no ar.`)
      );
    }
    const e = new Error('Erro inesperado. Tente novamente.');
    e.status = error.response.status;
    return Promise.reject(e);
  }
);

export default api;
