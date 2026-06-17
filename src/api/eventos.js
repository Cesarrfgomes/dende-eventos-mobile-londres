import api from './client';

export async function listarFeed() {
  const { data } = await api.get('/eventos');
  return data;
}
