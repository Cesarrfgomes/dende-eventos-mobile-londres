import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Badge from '../components/Badge';
import Button from '../components/Button';
import { comprarIngresso } from '../api/ingressos';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';
import { formatDataHora, formatMoeda, humanizeEnum } from '../utils/format';

function Linha({ rotulo, valor }) {
  if (!valor && valor !== 0) return null;
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

export default function EventoDetalheScreen({ route, navigation }) {
  const { evento } = route.params;
  const { usuario } = useAuth();
  const [comprando, setComprando] = useState(false);

  const temIngressoCasado = !!evento.eventoPrincipal;

  async function onComprar() {
    try {
      setComprando(true);
      const compra = await comprarIngresso(usuario.id, evento.id);
      const qtd = compra.ingressos?.length ?? 1;
      Alert.alert(
        'Compra confirmada! 🎉',
        `${qtd} ingresso(s) emitido(s).\nTotal: ${formatMoeda(compra.valorTotal)}`,
        [
          { text: 'Ver meus ingressos', onPress: () => navigation.navigate('Ingressos') },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } catch (err) {
      Alert.alert('Não foi possível comprar', err.message);
    } finally {
      setComprando(false);
    }
  }

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badges}>
          <Badge texto={humanizeEnum(evento.tipoEvento)} />
          <Badge texto={humanizeEnum(evento.modalidadeEvento)} tone="accent" />
        </View>

        <Text style={styles.nome}>{evento.nome}</Text>

        {evento.descricao ? <Text style={styles.descricao}>{evento.descricao}</Text> : null}

        <View style={styles.card}>
          <Linha rotulo="Início" valor={formatDataHora(evento.dataInicio)} />
          <Linha rotulo="Término" valor={formatDataHora(evento.dataFim)} />
          <Linha rotulo="Local" valor={evento.localEvento} />
          <Linha rotulo="Página" valor={evento.paginaWeb} />
          <Linha rotulo="Capacidade" valor={`${evento.capacidadeMaxima} lugares`} />
          {evento.organizador ? (
            <Linha rotulo="Organizador" valor={evento.organizador.nome} />
          ) : null}
        </View>

        {temIngressoCasado ? (
          <View style={styles.aviso}>
            <Text style={styles.avisoTexto}>
              🎟️ Este evento está vinculado a “{evento.eventoPrincipal.nome}”. A compra gera{' '}
              <Text style={styles.bold}>2 ingressos</Text> (o valor total soma os dois).
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Linha
            rotulo="Estorno no cancelamento"
            valor={evento.estornaIngresso ? `Sim (taxa de ${evento.taxaEstorno}%)` : 'Não'}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.precoLabel}>Preço do ingresso</Text>
          <Text style={styles.preco}>{formatMoeda(evento.precoIngresso)}</Text>
        </View>
        <Button
          title="Comprar"
          onPress={onComprar}
          loading={comprando}
          style={styles.btnComprar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  badges: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  nome: { fontSize: 24, fontWeight: '800', color: colors.text },
  descricao: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  rotulo: { fontSize: 14, color: colors.textMuted },
  valor: { fontSize: 14, color: colors.text, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  aviso: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  avisoTexto: { fontSize: 13, color: colors.primaryDark, lineHeight: 19 },
  bold: { fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  precoLabel: { fontSize: 12, color: colors.textMuted },
  preco: { fontSize: 22, fontWeight: '800', color: colors.primary },
  btnComprar: { paddingHorizontal: spacing.xl },
});
