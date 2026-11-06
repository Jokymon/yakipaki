import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export function Chip({ label, selected = false, onPress, color }: { label: string; selected?: boolean; onPress: () => void; color?: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected, selected && color ? { backgroundColor: color, borderColor: color } : undefined]}>
      <Text numberOfLines={1} style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.surface, maxWidth: 220 },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  selectedText: { color: '#FFFFFF' }
});
