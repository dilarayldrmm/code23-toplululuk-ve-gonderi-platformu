import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const { notifications, markRead, markAllAsRead, clearAll } =
    useNotifications();

  const { colors } = useTheme();

  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Tümü' },
    { key: 'like', label: 'Beğeni' },
    { key: 'comment', label: 'Yorum' },
    { key: 'post', label: 'Sistem' },
  ];

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications || []
      : (notifications || []).filter(item => item.type === activeFilter);

  const getIcon = type => {
    if (type === 'like') return '❤️';
    if (type === 'comment') return '💬';
    if (type === 'post') return '✅';
    return '🔔';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Bildirimler</Text>

      <View style={styles.filterRow}>
        {filters.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.filterButton,
              activeFilter === item.key && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === item.key && styles.activeFilterText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.greenButton} onPress={markAllAsRead}>
          <Text style={styles.buttonText}>Okundu Say</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.redButton} onPress={clearAll}>
          <Text style={styles.buttonText}>Temizle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.softText }]}>
            Bu filtrede bildirim yok.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card },
              !item.read && styles.unread,
            ]}
            onPress={() => markRead(item.id)}
          >
            <View style={styles.notificationRow}>
              <Text style={styles.icon}>{getIcon(item.type)}</Text>

              <View style={{ flex: 1 }}>
                <Text style={[styles.text, { color: colors.text }]}>
                  {item.text}
                </Text>

                <Text style={[styles.time, { color: colors.softText }]}>
                  {item.timestamp || item.createdAt || 'Şimdi'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: '#d9d9d9',
  },
  activeFilter: {
    backgroundColor: '#16a34a',
  },
  filterText: {
    color: '#111827',
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  greenButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  redButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: '#16a34a',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    marginTop: 6,
    fontSize: 12,
  },
  empty: {
    fontSize: 16,
  },
});