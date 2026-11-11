import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Chip } from '../components/Chip';
import { useAppData } from '../data/AppDataContext';
import { translate } from '../i18n/translations';
import { useTheme } from '../ThemeContext';
import { categoryColors, ThemeColors } from '../theme';

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function CategoriesScreen() {
  const store = useAppData();
  const { data } = store;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  const [category, setCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState(categoryColors[data.categories.length % categoryColors.length] ?? '#55866A');
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setCategory('');
    setEditingId(null);
    setCategoryColor(categoryColors[(data.categories.length + 1) % categoryColors.length] ?? '#55866A');
  };
  const saveCategory = () => {
    if (!category.trim()) return;
    const value = { id: editingId ?? id(), name: category.trim(), color: categoryColor };
    if (editingId) store.updateCategory(value); else store.addCategory(value);
    resetForm();
  };
  const editCategory = (categoryId: string) => {
    const value = data.categories.find((candidate) => candidate.id === categoryId);
    if (!value) return;
    setEditingId(value.id);
    setCategory(value.name);
    setCategoryColor(value.color);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.titleRow}>
        <View><Text style={styles.eyebrow}>{t('manage')}</Text><Text style={styles.title}>{t('categories')}</Text></View>
        <View style={styles.languages} accessibilityLabel={t('language')}>
          <Chip label="DE" selected={data.language === 'de'} onPress={() => store.setLanguage('de')} />
          <Chip label="EN" selected={data.language === 'en'} onPress={() => store.setLanguage('en')} />
        </View>
      </View>

      <View style={styles.section}>
        {data.categories.map((value) => (
          <View key={value.id} style={styles.entity}>
            <View style={[styles.color, { backgroundColor: value.color }]} />
            <View style={styles.entityText}>
              <Text style={styles.entityTitle}>{value.name}</Text>
              <Text style={styles.detail}>{data.items.filter((item) => item.categoryId === value.id).length} {t('objects').toLowerCase()}</Text>
            </View>
            <Pressable accessibilityLabel={`${t('edit')}: ${value.name}`} hitSlop={8} onPress={() => editCategory(value.id)}><Text style={styles.edit}>✎</Text></Pressable>
            <Pressable hitSlop={8} onPress={() => { store.deleteCategory(value.id); if (editingId === value.id) resetForm(); }}><Text style={styles.remove}>×</Text></Pressable>
          </View>
        ))}
        <Text style={styles.formLabel}>{t('color')}</Text>
        <View style={styles.palette}>
          {categoryColors.map((value) => (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ selected: categoryColor === value }}
              onPress={() => setCategoryColor(value)}
              style={[styles.swatchOuter, categoryColor === value && styles.swatchSelected]}
            ><View style={[styles.swatch, { backgroundColor: value }]} /></Pressable>
          ))}
        </View>
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, styles.flex]}
            value={category}
            onChangeText={setCategory}
            placeholder={t('name')}
            placeholderTextColor={colors.placeholder}
            onSubmitEditing={saveCategory}
          />
          <Pressable style={styles.addButton} onPress={saveCategory}><Text style={styles.addText}>{editingId ? t('save') : t('add')}</Text></Pressable>
        </View>
        {editingId && <Pressable style={styles.cancelButton} onPress={resetForm}><Text style={styles.cancelText}>{t('cancel')}</Text></Pressable>}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 28, fontWeight: '900' },
  languages: { flexDirection: 'row', gap: 5 },
  section: { backgroundColor: colors.surface, padding: 15, borderRadius: 18, borderWidth: 1, borderColor: colors.border, gap: 8 },
  entity: { flexDirection: 'row', alignItems: 'center', minHeight: 52, borderBottomWidth: 1, borderBottomColor: colors.divider, paddingVertical: 5 },
  color: { width: 12, height: 34, borderRadius: 6, marginRight: 11 },
  entityText: { flex: 1 },
  entityTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  detail: { color: colors.muted, fontSize: 11, marginTop: 2 },
  edit: { color: colors.primary, fontSize: 21, paddingHorizontal: 7 },
  remove: { color: colors.destructiveMuted, fontSize: 24, paddingHorizontal: 6 },
  formLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 4 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  swatchOuter: { width: 32, height: 32, borderRadius: 16, padding: 4, borderWidth: 2, borderColor: 'transparent' },
  swatchSelected: { borderColor: colors.ink },
  swatch: { flex: 1, borderRadius: 12 },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 5 },
  input: { backgroundColor: colors.field, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 11, minHeight: 43, color: colors.ink },
  flex: { flex: 1 },
  addButton: { backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 15 },
  addText: { color: colors.onPrimary, fontWeight: '800' },
  cancelButton: { alignSelf: 'center', padding: 7 },
  cancelText: { color: colors.muted, fontWeight: '700' }
});
