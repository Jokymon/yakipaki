import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar as NativeStatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppDataProvider, useAppData } from './src/data/AppDataContext';
import { ItemsScreen } from './src/screens/ItemsScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { TravelScreen } from './src/screens/TravelScreen';
import { translate } from './src/i18n/translations';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import { ThemeColors } from './src/theme';

type Tab = 'items' | 'shopping' | 'categories' | 'travel';

function AppContent() {
  const { data, ready, storageError } = useAppData();
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const [tab, setTab] = useState<Tab>('items');
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  if (!ready) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return (
    <View style={styles.safe}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {storageError && <View style={styles.storageBanner}><Text style={styles.storageBannerText}>{t('storageError')}</Text></View>}
      <View style={styles.screen}>{tab === 'items' ? <ItemsScreen /> : tab === 'shopping' ? <ItemsScreen shopping /> : tab === 'categories' ? <CategoriesScreen /> : <TravelScreen />}</View>
      <View style={styles.nav}>
        <NavButton icon="🎒" label={t('items')} active={tab === 'items'} onPress={() => setTab('items')} />
        <NavButton icon="🛒" label={t('shopping')} active={tab === 'shopping'} onPress={() => setTab('shopping')} badge={data.items.filter((item) => !item.owned).length} />
        <NavButton icon="▦" label={t('categories')} active={tab === 'categories'} onPress={() => setTab('categories')} />
        <NavButton icon="✈" label={t('travel')} active={tab === 'travel'} onPress={() => setTab('travel')} />
      </View>
    </View>
  );
}

function NavButton({ icon, label, active, badge, onPress }: { icon: string; label: string; active: boolean; badge?: number; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable onPress={onPress} style={styles.navButton}><View><Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>{Boolean(badge) && <Text style={styles.badge}>{badge}</Text>}</View><Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text></Pressable>;
}

export default function App() { return <ThemeProvider><AppDataProvider><AppContent /></AppDataProvider></ThemeProvider>; }

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingTop: NativeStatusBar.currentHeight ?? 0 }, screen: { flex: 1 }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  storageBanner: { backgroundColor: colors.shoppingSoft, borderBottomWidth: 1, borderBottomColor: colors.shopping, paddingHorizontal: 14, paddingVertical: 8 }, storageBannerText: { color: colors.shopping, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  nav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 78, flexDirection: 'row', backgroundColor: colors.nav, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 7 }, navButton: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navIcon: { fontSize: 22, color: colors.inactive, textAlign: 'center' }, navLabel: { fontSize: 11, fontWeight: '700', color: colors.inactive, marginTop: 3 }, navActive: { color: colors.primary }, badge: { position: 'absolute', top: -4, right: -13, backgroundColor: colors.accent, color: '#18261E', borderRadius: 10, minWidth: 18, height: 18, lineHeight: 18, textAlign: 'center', fontSize: 10, fontWeight: '900' }
});
