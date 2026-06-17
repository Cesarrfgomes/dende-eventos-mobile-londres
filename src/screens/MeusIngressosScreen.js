import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, SectionList, StyleSheet, Text } from 'react-native';

import IngressoCard from '../components/IngressoCard';
import { EmptyView, ErrorView, Loading } from '../components/StateView';
import { cancelarIngresso, listarIngressosDoUsuario } from '../api/ingressos';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';

function montarSecoes(ingressos) {
  const ativos = ingressos.filter((i) => i.status === 'ATIVO');
  const outros = ingressos.filter((i) => i.status !== 'ATIVO');
  const secoes = [];
  if (ativos.length) secoes.push({ titulo: 'Ativos', data: ativos });
  if (outros.length) secoes.push({ titulo: 'Cancelados / finalizados', data: outros });
  return secoes;
}

export default function MeusIngressosScreen() {
  const { usuario } = useAuth();
  const [ingressos, setIngressos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const data = await listarIngressosDoUsuario(usuario.id);
      setIngressos(data);
    } catch (err) {
      if (err.status === 404) setIngressos([]);
      else setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [usuario.id]);

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregar();
    }, [carregar])
  );

  function confirmarCancelamento(ingresso) {
    Alert.alert(
      'Cancelar ingresso',
      `Deseja cancelar o ingresso de "${ingresso.eventoNome}"? O estorno segue a política do evento.`,
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Cancelar ingresso', style: 'destructive', onPress: () => cancelar(ingresso) },
      ]
    );
  }

  async function cancelar(ingresso) {
    try {
      setCancelandoId(ingresso.id);
      const atualizado = await cancelarIngresso(ingresso.id, usuario.id);
      setIngressos((lista) =>
        lista.map((i) => (i.id === atualizado.id ? atualizado : i))
      );
    } catch (err) {
      Alert.alert('Não foi possível cancelar', err.message);
    } finally {
      setCancelandoId(null);
    }
  }

  if (carregando) return <Loading texto="Carregando ingressos..." />;
  if (erro) return <ErrorView mensagem={erro} onRetry={() => { setCarregando(true); carregar(); }} />;

  if (ingressos.length === 0) {
    return (
      <EmptyView
        emoji="🎟️"
        titulo="Você ainda não tem ingressos"
        subtitulo="Compre no feed de eventos e eles aparecerão aqui."
      />
    );
  }

  return (
    <SectionList
      sections={montarSecoes(ingressos)}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.lista}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <Text style={styles.secao}>{section.titulo}</Text>
      )}
      renderItem={({ item }) => (
        <IngressoCard
          ingresso={item}
          cancelando={cancelandoId === item.id}
          onCancelar={item.status === 'ATIVO' ? () => confirmarCancelamento(item) : undefined}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: { padding: spacing.lg, backgroundColor: colors.background, flexGrow: 1 },
  secao: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
});
