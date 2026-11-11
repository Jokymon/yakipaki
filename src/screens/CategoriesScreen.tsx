import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Chip } from '../components/Chip';
import { useAppData } from '../data/AppDataContext';
import { translate } from '../i18n/translations';
import { useTheme } from '../ThemeContext';
import { categoryColors, ThemeColors } from '../theme';

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const extendedCategoryColors = [
  '#B83A3A', '#D45D3E', '#E17B3C', '#D49A2A', '#C2AD35', '#84A83D',
  '#3D9B58', '#32977A', '#32999B', '#367FA5', '#3E62A8', '#5B4FA3',
  '#7950A5', '#9A4F9B', '#B34F7A', '#C15A65', '#7E5C48', '#6D6D6D',
  '#E89A9A', '#F0AD8B', '#F2C47B', '#DED47A', '#ACCF80', '#7FC69A',
  '#78C8B5', '#77C5D2', '#82AED6', '#919AD2', '#AC91D0', '#D090C4'
];
const isHexColor = (value: string) => /^#[0-9A-F]{6}$/.test(value);

export function CategoriesScreen() {
  const store = useAppData();
  const { data } = store;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  const [category, setCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState(categoryColors[data.categories.length % categoryColors.length] ?? '#55866A');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCustomColor, setShowCustomColor] = useState(false);

  const resetForm = () => {
    setCategory('');
    setEditingId(null);
    setShowCustomColor(false);
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
              accessibilityLabel={value}
              onPress={() => setCategoryColor(value)}
              style={[styles.swatchOuter, categoryColor === value && styles.swatchSelected]}
            ><View style={[styles.swatch, { backgroundColor: value }]} /></Pressable>
          ))}
        </View>
        <Pressable style={styles.customColorButton} onPress={() => setShowCustomColor(true)}>
          <View style={[styles.customColorPreview, { backgroundColor: categoryColor }]} />
          <Text style={styles.customColorText}>{t('customColor')}</Text>
          <Text style={styles.customColorValue}>{categoryColor.toUpperCase()}</Text>
        </Pressable>
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
      {showCustomColor && (
        <CustomColorPicker
          initialColor={categoryColor}
          onApply={(value) => { setCategoryColor(value); setShowCustomColor(false); }}
          onClose={() => setShowCustomColor(false)}
        />
      )}
    </ScrollView>
  );
}

function CustomColorPicker({ initialColor, onApply, onClose }: { initialColor: string; onApply: (value: string) => void; onClose: () => void }) {
  const { data } = useAppData();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  const normalizedInitial = isHexColor(initialColor.toUpperCase()) ? initialColor.toUpperCase() : '#55866A';
  const [hex, setHex] = useState(normalizedInitial);
  const valid = isHexColor(hex);

  const updateHex = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^0-9A-F#]/g, '');
    setHex(cleaned.startsWith('#') ? cleaned.slice(0, 7) : `#${cleaned.slice(0, 6)}`);
  };

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
        <View style={styles.colorDialog}>
          <Text style={styles.dialogTitle}>{t('customColor')}</Text>
          <View style={[styles.largePreview, { backgroundColor: valid ? hex : normalizedInitial }]} />
          <Text style={styles.formLabel}>{t('moreColors')}</Text>
          <View style={styles.extendedPalette}>
            {extendedCategoryColors.map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityState={{ selected: hex === value }}
                accessibilityLabel={value}
                onPress={() => setHex(value)}
                style={[styles.extendedSwatchOuter, hex === value && styles.swatchSelected]}
              ><View style={[styles.swatch, { backgroundColor: value }]} /></Pressable>
            ))}
          </View>
          <Text style={styles.formLabel}>{t('hexColor')}</Text>
          <TextInput
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
            selectTextOnFocus
            style={[styles.input, !valid && styles.invalidInput]}
            value={hex}
            onChangeText={updateHex}
            placeholder="#55866A"
            placeholderTextColor={colors.placeholder}
          />
          <View style={styles.dialogActions}>
            <Pressable style={styles.dialogSecondary} onPress={onClose}><Text style={styles.cancelText}>{t('cancel')}</Text></Pressable>
            <Pressable disabled={!valid} style={[styles.dialogPrimary, !valid && styles.disabled]} onPress={() => onApply(hex)}><Text style={styles.addText}>{t('apply')}</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
  customColorButton: { flexDirection: 'row', alignItems: 'center', minHeight: 44, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, gap: 9 },
  customColorPreview: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  customColorText: { flex: 1, color: colors.ink, fontWeight: '700' },
  customColorValue: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 5 },
  input: { backgroundColor: colors.field, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 11, minHeight: 43, color: colors.ink },
  flex: { flex: 1 },
  addButton: { backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 15 },
  addText: { color: colors.onPrimary, fontWeight: '800' },
  cancelButton: { alignSelf: 'center', padding: 7 },
  cancelText: { color: colors.muted, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'center', padding: 20 },
  colorDialog: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 10 },
  dialogTitle: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  largePreview: { height: 58, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  extendedPalette: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' },
  extendedSwatchOuter: { width: 34, height: 34, borderRadius: 17, padding: 4, borderWidth: 2, borderColor: 'transparent' },
  invalidInput: { borderColor: colors.danger },
  dialogActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  dialogSecondary: { flex: 1, alignItems: 'center', padding: 12 },
  dialogPrimary: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: colors.primary },
  disabled: { opacity: 0.4 }
});
