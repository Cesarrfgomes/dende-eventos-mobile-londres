import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors, radius, spacing } from '../theme';
import { formatData, parseLocalDateTime } from '../utils/format';

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DateField({ label, value, onChange, error }) {
  const [aberto, setAberto] = useState(false);

  const dataAtual =
    parseLocalDateTime(value) ?? new Date(new Date().getFullYear() - 18, 0, 1);

  function onPickerChange(event, selected) {
    setAberto(Platform.OS === 'ios');
    if (event.type === 'set' && selected) {
      onChange(toISODate(selected));
    }
  }

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        onPress={() => setAberto(true)}
        style={[styles.input, error && styles.inputError]}
      >
        <Text style={[styles.texto, !value && styles.placeholder]}>
          {value ? formatData(value) : 'Selecionar data'}
        </Text>
        <Text style={styles.icone}>📅</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {aberto ? (
        <DateTimePicker
          value={dataAtual}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={onPickerChange}
        />
      ) : null}

      {aberto && Platform.OS === 'ios' ? (
        <Pressable onPress={() => setAberto(false)} style={styles.okBtn}>
          <Text style={styles.okTexto}>OK</Text>
        </Pressable>
      ) : null}
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
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: { borderColor: colors.danger },
  texto: { fontSize: 15, color: colors.text },
  placeholder: { color: colors.textMuted },
  icone: { fontSize: 16 },
  error: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
  okBtn: { alignSelf: 'flex-end', paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  okTexto: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});
