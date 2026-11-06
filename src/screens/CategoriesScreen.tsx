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

  const addCategory = () => {
    if (!category.trim()) return;
    store.addCategory({
      id: id(),
      name: category.trim(),
      color: categoryColors[data.categories.length % categoryColors.length] ?? '#55866A'
    });
    setCategory('');
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
              <Text style={styles.detail}>{data.items.filter((item) => item.categoryIds.includes(value.id)).length} {t('objects').toLowerCase()}</Text>
            </View>
            <Pressable hitSlop={8} onPress={() => store.deleteCategory(value.id)}><Text style={styles.remove}>×</Text></Pressable>
          </View>
        ))}
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, styles.flex]}
            value={category}
            onChangeText={setCategory}
            placeholder={t('name')}
            placeholderTextColor={colors.placeholder}
            onSubmitEditing={addCategory}
          />
          <Pressable style={styles.addButton} onPress={addCategory}><Text style={styles.addText}>{t('add')}</Text></Pressable>
        </View>
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
  remove: { color: colors.destructiveMuted, fontSize: 24, paddingHorizontal: 6 },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 5 },
  input: { backgroundColor: colors.field, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 11, minHeight: 43, color: colors.ink },
  flex: { flex: 1 },
  addButton: { backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 15 },
  addText: { color: colors.onPrimary, fontWeight: '800' }
});
