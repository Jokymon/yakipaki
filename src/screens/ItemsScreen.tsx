import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip } from '../components/Chip';
import { ItemEditor } from '../components/ItemEditor';
import { useAppData } from '../data/AppDataContext';
import { Filter, PackingItem } from '../domain/types';
import { itemUsageDays, matchesFilter } from '../domain/packing';
import { translate } from '../i18n/translations';
import { useTheme } from '../ThemeContext';
import { ThemeColors } from '../theme';

export function ItemsScreen({ shopping = false }: { shopping?: boolean }) {
  const { data, saveItem, deleteItem } = useAppData();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  const [filter, setFilter] = useState<Filter>({ kind: 'all' });
  const [editor, setEditor] = useState<PackingItem | 'new' | null>(null);
  const items = useMemo(() => data.items.filter((item) => (shopping ? !item.owned : true) && matchesFilter(item, filter, data)), [data, filter, shopping]);
  const packed = data.items.filter((item) => item.packed).length;
  const selected = (kind: Filter['kind'], id?: string) => filter.kind === kind && (!id || ('id' in filter && filter.id === id));
  const remove = (item: PackingItem) => Alert.alert(t('confirmDelete'), t('deleteItemText'), [{ text: t('cancel'), style: 'cancel' }, { text: t('delete'), style: 'destructive', onPress: () => deleteItem(item.id) }]);

  return (
    <View style={styles.root}>
      <View style={styles.headingRow}>
        <View><Text style={styles.eyebrow}>{shopping ? t('notOwned') : `${packed}/${data.items.length} ${t('packedCount')}`}</Text><Text style={styles.title}>{shopping ? t('shopping') : t('title')}</Text></View>
        <Pressable style={styles.addButton} onPress={() => setEditor('new')}><Text style={styles.addText}>＋</Text></Pressable>
      </View>
      <View>
        <Text style={styles.filterLabel}>{t('filters')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label={t('all')} selected={selected('all')} onPress={() => setFilter({ kind: 'all' })} />
          <Chip label={t('shortUse')} selected={selected('short-use')} onPress={() => setFilter({ kind: 'short-use' })} />
          <Chip label={t('singlePhase')} selected={selected('single-phase')} onPress={() => setFilter({ kind: 'single-phase' })} />
          {data.categories.map((category) => <Chip key={category.id} label={category.name} color={category.color} selected={selected('category', category.id)} onPress={() => setFilter({ kind: 'category', id: category.id })} />)}
          {data.collections.map((collection) => <Chip key={collection.id} label={`⌁ ${collection.name}`} selected={selected('collection', collection.id)} onPress={() => setFilter({ kind: 'collection', id: collection.id })} />)}
          {data.phases.map((phase) => <Chip key={phase.id} label={phase.name} selected={selected('phase', phase.id)} onPress={() => setFilter({ kind: 'phase', id: phase.id })} />)}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {items.length === 0 && <View style={styles.empty}><Text style={styles.emptyIcon}>✓</Text><Text style={styles.emptyText}>{t('empty')}</Text></View>}
        {items.map((item) => {
          const categories = data.categories.filter((category) => item.categoryIds.includes(category.id));
          return (
            <View key={item.id} style={[styles.card, item.packed && !shopping && styles.cardPacked]}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: shopping ? item.owned : item.packed }}
                onPress={() => saveItem({ ...item, ...(shopping ? { owned: true } : { packed: !item.packed }) })}
                style={[styles.checkbox, (shopping ? item.owned : item.packed) && styles.checkboxActive]}
              ><Text style={styles.check}>{(shopping ? item.owned : item.packed) ? '✓' : ''}</Text></Pressable>
              <View style={styles.cardBody}>
                <Text style={[styles.itemName, item.packed && !shopping && styles.strike]}>{item.quantity > 1 ? `${item.quantity}× ` : ''}{item.name}</Text>
                <View style={styles.metaRow}>
                  {categories.map((category) => <View key={category.id} style={[styles.dot, { backgroundColor: category.color }]} />)}
                  <Text style={styles.meta}>{t('usage')}: {itemUsageDays(item, data.phases)} d</Text>
                  {!item.owned && <Text style={styles.buyBadge}>{t('shopping')}</Text>}
                </View>
              </View>
              <Pressable hitSlop={8} onPress={() => setEditor(item)} style={styles.iconButton}><Text style={styles.icon}>✎</Text></Pressable>
              <Pressable hitSlop={8} onPress={() => remove(item)} style={styles.iconButton}><Text style={styles.deleteIcon}>×</Text></Pressable>
            </View>
          );
        })}
      </ScrollView>
      {editor && <ItemEditor key={editor === 'new' ? 'new' : editor.id} item={editor === 'new' ? undefined : editor} visible onClose={() => setEditor(null)} />}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background }, headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 }, title: { color: colors.ink, fontSize: 28, fontWeight: '900', letterSpacing: -0.6 },
  addButton: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, addText: { color: colors.onPrimary, fontSize: 27, lineHeight: 30 },
  filterLabel: { marginLeft: 20, color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 7 }, chips: { gap: 7, paddingHorizontal: 20, paddingBottom: 15 },
  list: { paddingHorizontal: 16, paddingBottom: 120, gap: 9 }, card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 13, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  cardPacked: { opacity: 0.63 }, checkbox: { width: 27, height: 27, borderRadius: 9, borderWidth: 2, borderColor: colors.checkbox, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary }, check: { color: colors.onPrimary, fontWeight: '900' },
  cardBody: { flex: 1 }, itemName: { color: colors.ink, fontSize: 16, fontWeight: '700' }, strike: { textDecorationLine: 'line-through' }, metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 5 }, dot: { width: 8, height: 8, borderRadius: 4 }, meta: { color: colors.muted, fontSize: 11 }, buyBadge: { backgroundColor: colors.shoppingSoft, color: colors.shopping, fontSize: 10, fontWeight: '800', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  iconButton: { padding: 6 }, icon: { color: colors.primary, fontSize: 21 }, deleteIcon: { color: colors.destructiveMuted, fontSize: 24 }, empty: { alignItems: 'center', paddingTop: 60 }, emptyIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primarySoft, color: colors.primary, fontSize: 30, textAlign: 'center', lineHeight: 48 }, emptyText: { color: colors.muted, marginTop: 12 }
});
