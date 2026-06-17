import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Badge from './Badge';
import { colors, radius, spacing } from '../theme';
import { formatDataHora, formatMoeda, humanizeEnum } from '../utils/format';

export default function EventoCard({ evento, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <Badge texto={humanizeEnum(evento.tipoEvento)} />
        <Badge texto={humanizeEnum(evento.modalidadeEvento)} tone="accent" />
      </View>

      <Text style={styles.nome} numberOfLines={2}>
        {evento.nome}
      </Text>

      <Text style={styles.info}>📅 {formatDataHora(evento.dataInicio)}</Text>
      {evento.localEvento ? (
        <Text style={styles.info} numberOfLines={1}>
          📍 {evento.localEvento}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.preco}>{formatMoeda(evento.precoIngresso)}</Text>
        {evento.eventoPrincipal ? (
          <Badge texto="Ingresso casado" tone="neutral" />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.9 },
  headerRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  nome: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  info: { fontSize: 13, color: colors.textMuted, marginBottom: 2 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  preco: { fontSize: 18, fontWeight: '800', color: colors.primary },
});
