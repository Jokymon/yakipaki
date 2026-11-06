import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { PackingItem } from '../domain/types';
import { safeQuantity } from '../domain/packing';
import { useAppData } from '../data/AppDataContext';
import { translate } from '../i18n/translations';
import { colors } from '../theme';
import { Chip } from './Chip';

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function ItemEditor({ item, visible, onClose }: { item?: PackingItem; visible: boolean; onClose: () => void }) {
  const { data, saveItem } = useAppData();
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  const [name, setName] = useState(item?.name ?? '');
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1));
  const [notes, setNotes] = useState(item?.notes ?? '');
  const [owned, setOwned] = useState(item?.owned ?? true);
  const [categoryIds, setCategoryIds] = useState(item?.categoryIds ?? []);
  const [phaseIds, setPhaseIds] = useState(item?.phaseIds ?? []);

  const toggle = (values: string[], id: string, setter: (value: string[]) => void) => setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);
  const submit = () => {
    if (!name.trim()) return;
    saveItem({ id: item?.id ?? newId(), name: name.trim(), quantity: safeQuantity(quantity), notes: notes.trim(), owned, packed: item?.packed ?? false, categoryIds, phaseIds });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{item ? t('editItem') : t('addItem')}</Text>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            <Text style={styles.label}>{t('name')}</Text>
            <TextInput autoFocus style={styles.input} value={name} onChangeText={setName} placeholder="z. B. Wanderschuhe" placeholderTextColor="#98A29B" />
            <Text style={styles.label}>{t('quantity')}</Text>
            <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />
            <View style={styles.switchRow}><Text style={styles.switchLabel}>{t('owned')}</Text><Switch value={owned} onValueChange={setOwned} trackColor={{ true: colors.primary }} /></View>
            <Text style={styles.label}>{t('categories')}</Text>
            <View style={styles.wrap}>{data.categories.map((category) => <Chip key={category.id} label={category.name} selected={categoryIds.includes(category.id)} color={category.color} onPress={() => toggle(categoryIds, category.id, setCategoryIds)} />)}</View>
            <Text style={styles.label}>{t('phases')}</Text>
            <View style={styles.wrap}>{data.phases.map((phase) => <Chip key={phase.id} label={phase.name} selected={phaseIds.includes(phase.id)} onPress={() => toggle(phaseIds, phase.id, setPhaseIds)} />)}</View>
            <Text style={styles.label}>{t('notes')}</Text>
            <TextInput style={[styles.input, styles.notes]} multiline value={notes} onChangeText={setNotes} textAlignVertical="top" />
          </ScrollView>
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.secondary}><Text style={styles.secondaryText}>{t('cancel')}</Text></Pressable>
            <Pressable onPress={submit} disabled={!name.trim()} style={[styles.primary, !name.trim() && styles.disabled]}><Text style={styles.primaryText}>{t('save')}</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,25,18,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%', paddingTop: 10 },
  handle: { width: 42, height: 4, borderRadius: 2, backgroundColor: '#B9C0BA', alignSelf: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink, paddingHorizontal: 20, marginBottom: 8 },
  form: { padding: 20, paddingTop: 8, gap: 10 },
  label: { color: colors.muted, fontWeight: '700', fontSize: 13, marginTop: 5 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, minHeight: 48, color: colors.ink, fontSize: 16 },
  notes: { minHeight: 78, paddingTop: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 12 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: colors.ink },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  actions: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  primary: { flex: 1, backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' },
  secondary: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' }, secondaryText: { color: colors.ink, fontWeight: '700' }, disabled: { opacity: 0.4 }
});
