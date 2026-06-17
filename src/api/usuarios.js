import api from './client';

export async function cadastrarUsuario(dados) {
  const { data } = await api.post('/usuarios/comuns', { ...dados, isAtivo: true });
  return data;
}

export async function buscarUsuarioPorEmail(email) {
  const { data } = await api.get(`/usuarios/comuns/email/${encodeURIComponent(email)}`);
  return data;
}

export async function buscarUsuarioPorId(id) {
  const { data } = await api.get(`/usuarios/comuns/${id}`);
  return data;
}

export async function atualizarUsuario(id, dados) {
  const { data } = await api.put(`/usuarios/comuns/${id}`, dados);
  return data;
}

export async function desativarUsuario(id) {
  await api.delete(`/usuarios/comuns/${id}`);
}
