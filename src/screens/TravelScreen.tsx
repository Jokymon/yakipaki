import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Chip } from '../components/Chip';
import { useAppData } from '../data/AppDataContext';
import { translate } from '../i18n/translations';
import { useTheme } from '../ThemeContext';
import { ThemeColors } from '../theme';

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function TravelScreen() {
  const store = useAppData();
  const { data } = store;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  const [collection, setCollection] = useState('');
  const [phase, setPhase] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [collectionId, setCollectionId] = useState<string | undefined>();

  const addCollection = () => {
    if (!collection.trim()) return;
    store.addCollection({ id: id(), name: collection.trim() });
    setCollection('');
  };

  const addPhase = () => {
    if (!phase.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || Date.parse(end) < Date.parse(start)) {
      Alert.alert(t('invalidDates'));
      return;
    }
    store.addPhase({ id: id(), name: phase.trim(), startDate: start, endDate: end, collectionId });
    setPhase(''); setStart(''); setEnd(''); setCollectionId(undefined);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View><Text style={styles.eyebrow}>{t('manage')}</Text><Text style={styles.title}>{t('travel')}</Text></View>

      <Section title={t('collections')} styles={styles}>
        {data.collections.map((value) => (
          <EntityRow key={value.id} title={value.name} detail={`${data.phases.filter((candidate) => candidate.collectionId === value.id).length} ${t('phases').toLowerCase()}`} onDelete={() => store.deleteCollection(value.id)} styles={styles} />
        ))}
        <AddRow value={collection} onChange={setCollection} placeholder={t('name')} onAdd={addCollection} button={t('add')} colors={colors} styles={styles} />
      </Section>

      <Section title={t('phases')} styles={styles}>
        {data.phases.map((value) => (
          <EntityRow
            key={value.id}
            title={value.name}
            detail={`${value.startDate} → ${value.endDate}${value.collectionId ? ` · ${data.collections.find((candidate) => candidate.id === value.collectionId)?.name ?? ''}` : ''}`}
            onDelete={() => store.deletePhase(value.id)}
            styles={styles}
          />
        ))}
        <View style={styles.phaseForm}>
          <TextInput style={styles.input} value={phase} onChangeText={setPhase} placeholder={t('name')} placeholderTextColor={colors.placeholder} />
          <View style={styles.dateRow}>
            <TextInput style={[styles.input, styles.half]} value={start} onChangeText={setStart} placeholder={t('startDate')} placeholderTextColor={colors.placeholder} />
            <TextInput style={[styles.input, styles.half]} value={end} onChangeText={setEnd} placeholder={t('endDate')} placeholderTextColor={colors.placeholder} />
          </View>
          <Text style={styles.smallLabel}>{t('collection')}</Text>
          <View style={styles.wrap}>
            <Chip label={t('ungrouped')} selected={!collectionId} onPress={() => setCollectionId(undefined)} />
            {data.collections.map((value) => <Chip key={value.id} label={value.name} selected={collectionId === value.id} onPress={() => setCollectionId(value.id)} />)}
          </View>
          <Pressable style={styles.addWide} onPress={addPhase}><Text style={styles.addText}>{t('add')}</Text></Pressable>
        </View>
      </Section>
    </ScrollView>
  );
}

type Styles = ReturnType<typeof createStyles>;
function Section({ title, children, styles }: React.PropsWithChildren<{ title: string; styles: Styles }>) { return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>; }
function EntityRow({ title, detail, onDelete, styles }: { title: string; detail: string; onDelete: () => void; styles: Styles }) { return <View style={styles.entity}><View style={styles.entityText}><Text style={styles.entityTitle}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><Pressable hitSlop={8} onPress={onDelete}><Text style={styles.remove}>×</Text></Pressable></View>; }
function AddRow({ value, onChange, placeholder, button, onAdd, colors, styles }: { value: string; onChange: (text: string) => void; placeholder: string; button: string; onAdd: () => void; colors: ThemeColors; styles: Styles }) { return <View style={styles.addRow}><TextInput style={[styles.input, styles.flex]} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.placeholder} onSubmitEditing={onAdd} /><Pressable style={styles.addSmall} onPress={onAdd}><Text style={styles.addText}>{button}</Text></Pressable></View>; }

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 120, gap: 16 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }, title: { color: colors.ink, fontSize: 28, fontWeight: '900' },
  section: { backgroundColor: colors.surface, padding: 15, borderRadius: 18, borderWidth: 1, borderColor: colors.border, gap: 8 }, sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginBottom: 3 },
  entity: { flexDirection: 'row', alignItems: 'center', minHeight: 48, borderBottomWidth: 1, borderBottomColor: colors.divider, paddingVertical: 5 }, entityText: { flex: 1 }, entityTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' }, detail: { color: colors.muted, fontSize: 11, marginTop: 2 }, remove: { color: colors.destructiveMuted, fontSize: 24, paddingHorizontal: 6 },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 5 }, input: { backgroundColor: colors.field, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 11, minHeight: 43, color: colors.ink }, flex: { flex: 1 }, addSmall: { backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 15 }, addText: { color: colors.onPrimary, fontWeight: '800' },
  phaseForm: { gap: 8, marginTop: 6 }, dateRow: { flexDirection: 'row', gap: 7 }, half: { flex: 1, fontSize: 11 }, smallLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' }, wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, addWide: { backgroundColor: colors.primary, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 3 }
});
