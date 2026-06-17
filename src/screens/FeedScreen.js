import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import EventoCard from '../components/EventoCard';
import { EmptyView, ErrorView, Loading } from '../components/StateView';
import { listarFeed } from '../api/eventos';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';

export default function FeedScreen({ navigation }) {
  const { usuario } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const data = await listarFeed();
      setEventos(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function onRefresh() {
    setAtualizando(true);
    carregar();
  }

  if (carregando) return <Loading texto="Carregando eventos..." />;
  if (erro) return <ErrorView mensagem={erro} onRetry={carregar} />;

  return (
    <FlatList
      data={eventos}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.lista}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.ola}>Olá, {usuario?.nome?.split(' ')[0] || 'visitante'} 👋</Text>
          <Text style={styles.titulo}>Próximos eventos</Text>
        </View>
      }
      ListEmptyComponent={
        <EmptyView
          emoji="🎫"
          titulo="Nenhum evento disponível"
          subtitulo="Puxe para baixo para atualizar."
        />
      }
      renderItem={({ item }) => (
        <EventoCard
          evento={item}
          onPress={() => navigation.navigate('EventoDetalhe', { evento: item })}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: { padding: spacing.lg, flexGrow: 1, backgroundColor: colors.background },
  header: { marginBottom: spacing.md },
  ola: { fontSize: 14, color: colors.textMuted },
  titulo: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 2 },
});
