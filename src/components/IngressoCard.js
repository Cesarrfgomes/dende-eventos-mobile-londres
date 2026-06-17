import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Badge from './Badge';
import Button from './Button';
import { colors, radius, spacing } from '../theme';
import { formatDataHora, formatMoeda } from '../utils/format';

export default function IngressoCard({ ingresso, onCancelar, cancelando }) {
  const ativo = ingresso.status === 'ATIVO';
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.nome} numberOfLines={2}>
          {ingresso.eventoNome || `Evento #${ingresso.eventoId}`}
        </Text>
        <Badge texto={ingresso.status} tone={ativo ? 'success' : 'danger'} />
      </View>

      <Text style={styles.info}>Comprado em {formatDataHora(ingresso.dataCompra)}</Text>
      <Text style={styles.info}>Valor pago: {formatMoeda(ingresso.valorPago)}</Text>

      {!ativo && ingresso.valorEstornado > 0 ? (
        <Text style={styles.estorno}>
          Estornado: {formatMoeda(ingresso.valorEstornado)}
        </Text>
      ) : null}
      {!ativo && ingresso.dataCancelamento ? (
        <Text style={styles.info}>
          Cancelado em {formatDataHora(ingresso.dataCancelamento)}
        </Text>
      ) : null}

      {ativo && onCancelar ? (
        <Button
          title="Cancelar ingresso"
          variant="danger"
          loading={cancelando}
          onPress={onCancelar}
          style={styles.btn}
        />
      ) : null}
    </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  nome: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  info: { fontSize: 13, color: colors.textMuted, marginBottom: 2 },
  estorno: { fontSize: 13, color: colors.success, fontWeight: '600', marginTop: 2 },
  btn: { marginTop: spacing.md },
});
