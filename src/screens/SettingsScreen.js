import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { usePosts } from '../context/PostContext';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const { clearAll } = useNotifications();
  const { resetPosts } = usePosts();
  const { isDark, toggleTheme, colors } = useTheme();

  const handleLogout = () => {
    clearAll();
    resetPosts();
    logout();
  };

  const deleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Demo uygulama olduğu için hesap gerçekten silinmez. Çıkış yapılıp veriler temizlenecek.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: handleLogout },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Hesap ve Bildirim Ayarları',
      icon: 'person-outline',
      color: '#16a34a',
      onPress: () =>
        Alert.alert(
          'Hesap ve Bildirim Ayarları',
          'Bildirimleri sessize alma ve hesap silme işlemleri burada.',
          [
            { text: 'Bildirimleri Sessize Al' },
            { text: 'Hesabı Sil', style: 'destructive', onPress: deleteAccount },
            { text: 'Kapat', style: 'cancel' },
          ]
        ),
    },
    {
      title: 'İstatistikler',
      icon: 'bar-chart-outline',
      color: '#35179E',
      onPress: () => navigation.navigate('ProfileTab'),
    },
    {
      title: 'Gizlilik ve Güvenlik',
      icon: 'shield-checkmark-outline',
      color: '#16a34a',
      onPress: () =>
        Alert.alert(
          'Gizlilik ve Güvenlik',
          'Bu bölümde şifre güvenliği, hesap gizliliği ve uygulama izinleri yönetilir.'
        ),
    },
    {
      title: isDark ? 'Açık Tema' : 'Koyu Tema',
      icon: 'moon-outline',
      color: '#35179E',
      onPress: toggleTheme,
    },
    {
      title: 'Oturumu Kapat',
      icon: 'log-out-outline',
      color: '#B71414',
      onPress: handleLogout,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Ayarlar</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.menuCard, { backgroundColor: colors.card }]}
          onPress={item.onPress}
        >
          <View style={[styles.iconBox, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={28} color="#111827" />
          </View>

          <Text style={[styles.menuText, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.arrow, { color: colors.text }]}>{'>'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  header: { fontSize: 30, fontWeight: 'bold', marginBottom: 35 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderRadius: 18,
    marginBottom: 18,
    elevation: 4,
  },
  iconBox: {
    width: 65,
    height: 65,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 22,
  },
  menuText: { flex: 1, fontSize: 20, fontWeight: 'bold' },
  arrow: { fontSize: 28, fontWeight: 'bold' },
});