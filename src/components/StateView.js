import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Button from './Button';
import { colors, spacing } from '../theme';

export function Loading({ texto = 'Carregando...' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{texto}</Text>
    </View>
  );
}

export function ErrorView({ mensagem, onRetry }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.muted}>{mensagem}</Text>
      {onRetry ? (
        <Button title="Tentar novamente" variant="outline" onPress={onRetry} style={styles.btn} />
      ) : null}
    </View>
  );
}

export function EmptyView({ titulo = 'Nada por aqui', subtitulo, emoji = '🗒️' }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{titulo}</Text>
      {subtitulo ? <Text style={styles.muted}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emoji: { fontSize: 44, marginBottom: spacing.sm },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  muted: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  btn: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
