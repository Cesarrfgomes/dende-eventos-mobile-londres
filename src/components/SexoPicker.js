import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

const OPCOES = [
  { valor: 'M', label: 'Masculino' },
  { valor: 'F', label: 'Feminino' },
  { valor: 'O', label: 'Outro' },
];

export function labelSexo(valor) {
  return OPCOES.find((o) => o.valor === valor)?.label ?? valor ?? '—';
}

export default function SexoPicker({ label = 'Sexo', value, onChange, error }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {OPCOES.map((op) => {
          const ativo = value === op.valor;
          return (
            <Pressable
              key={op.valor}
              onPress={() => onChange(op.valor)}
              style={[styles.opcao, ativo && styles.opcaoAtiva]}
            >
              <Text style={[styles.texto, ativo && styles.textoAtivo]}>{op.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  opcao: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoAtiva: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  texto: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  textoAtivo: { color: colors.primaryDark },
  error: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});
