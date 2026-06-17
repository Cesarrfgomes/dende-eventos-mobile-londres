import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

export default function Badge({ texto, tone = 'neutral' }) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={[styles.text, styles[`${tone}Text`]]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  text: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },

  neutral: { backgroundColor: colors.primaryLight },
  neutralText: { color: colors.primaryDark },

  success: { backgroundColor: '#E3F4E4' },
  successText: { color: colors.success },

  danger: { backgroundColor: '#FBE6E3' },
  dangerText: { color: colors.danger },

  accent: { backgroundColor: '#FDF0D5' },
  accentText: { color: '#9A6700' },
});
