import api from './client';

export async function comprarIngresso(usuarioComumId, eventoId) {
  const { data } = await api.post('/ingressos', { usuarioComumId, eventoId });
  return data;
}

export async function listarIngressosDoUsuario(usuarioComumId) {
  const { data } = await api.get(`/ingressos/usuario/${usuarioComumId}`);
  return data;
}

export async function cancelarIngresso(ingressoId, usuarioComumId) {
  const { data } = await api.patch(
    `/ingressos/${ingressoId}/cancelar?usuarioComumId=${usuarioComumId}`
  );
  return data;
}
