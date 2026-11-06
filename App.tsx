import React, { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StatusBar as NativeStatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppDataProvider, useAppData } from './src/data/AppDataContext';
import { ItemsScreen } from './src/screens/ItemsScreen';
import { ManageScreen } from './src/screens/ManageScreen';
import { translate } from './src/i18n/translations';
import { colors } from './src/theme';

type Tab = 'items' | 'shopping' | 'manage';

function AppContent() {
  const { data, ready } = useAppData();
  const [tab, setTab] = useState<Tab>('items');
  const t = (key: Parameters<typeof translate>[1]) => translate(data.language, key);
  if (!ready) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.screen}>{tab === 'items' ? <ItemsScreen /> : tab === 'shopping' ? <ItemsScreen shopping /> : <ManageScreen />}</View>
      <View style={styles.nav}>
        <NavButton icon="🎒" label={t('items')} active={tab === 'items'} onPress={() => setTab('items')} />
        <NavButton icon="🛒" label={t('shopping')} active={tab === 'shopping'} onPress={() => setTab('shopping')} badge={data.items.filter((item) => !item.owned).length} />
        <NavButton icon="✈" label={t('manage')} active={tab === 'manage'} onPress={() => setTab('manage')} />
      </View>
    </SafeAreaView>
  );
}

function NavButton({ icon, label, active, badge, onPress }: { icon: string; label: string; active: boolean; badge?: number; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.navButton}><View><Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>{Boolean(badge) && <Text style={styles.badge}>{badge}</Text>}</View><Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text></Pressable>;
}

export default function App() { return <AppDataProvider><AppContent /></AppDataProvider>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingTop: NativeStatusBar.currentHeight ?? 0 }, screen: { flex: 1 }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  nav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 78, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.97)', borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 7 }, navButton: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navIcon: { fontSize: 22, color: '#869189', textAlign: 'center' }, navLabel: { fontSize: 11, fontWeight: '700', color: '#869189', marginTop: 3 }, navActive: { color: colors.primary }, badge: { position: 'absolute', top: -4, right: -13, backgroundColor: colors.accent, color: colors.ink, borderRadius: 10, minWidth: 18, height: 18, lineHeight: 18, textAlign: 'center', fontSize: 10, fontWeight: '900' }
});
