import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { usePosts } from '../context/PostContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export default function FeedScreen({ navigation }) {
  const {
    posts,
    loadMore,
    hasMore,
    isLoading,
    toggleLike,
    isLiked,
    toggleBookmark,
    isBookmarked,
  } = usePosts();

  const { unreadCount } = useNotifications();
  const { colors } = useTheme();

  useEffect(() => {
    if (posts.length === 0) {
      loadMore();
    }
  }, []);

  const handleLike = post => {
    toggleLike(post.id);
  };

  const handleBookmark = post => {
    toggleBookmark(post);
  };
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('PostDetail', { post: item })}
    >
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userId}</Text>
        </View>

        <View>
          <Text style={[styles.username, { color: colors.text }]}>
            Kullanıcı #{item.userId}
          </Text>
          <Text style={[styles.subText, { color: colors.softText }]}>
            Topluluk gönderisi
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

      <Text numberOfLines={2} style={[styles.body, { color: colors.softText }]}>
        {item.body}
      </Text>

      <View style={styles.tags}>
        {item.tags?.slice(0, 3).map((tag, index) => (
          <View key={`${tag}-${index}`} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={() => handleLike(item)}>
          <Ionicons
            name={isLiked(item.id) ? 'heart' : 'heart-outline'}
            size={26}
            color="#16a34a"
          />
          <Text style={[styles.actionText, { color: colors.softText }]}>
            {item.reactions?.likes || 0}
          </Text>
        </TouchableOpacity>

        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={24} color={colors.softText} />
          <Text style={[styles.actionText, { color: colors.softText }]}>
            {item.reactions?.dislikes || 0}
          </Text>
        </View>

        <View style={styles.action}>
          <Ionicons name="eye-outline" size={25} color={colors.softText} />
          <Text style={[styles.actionText, { color: colors.softText }]}>
            {item.views || 0}
          </Text>
        </View>

        <TouchableOpacity onPress={() => handleBookmark(item)}>
          <Ionicons
            name={isBookmarked(item.id) ? 'bookmark' : 'bookmark-outline'}
            size={30}
            color="#16a34a"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.hello, { color: colors.softText }]}>Merhaba 👋</Text>
          <Text style={[styles.header, { color: colors.text }]}>CODE23 Akış</Text>
        </View>

        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={30} color="#16a34a" />

          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasMore && !isLoading) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 18 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  hello: { fontSize: 16, fontWeight: 'bold' },
  header: { fontSize: 34, fontWeight: 'bold' },
  notificationButton: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 5,
    backgroundColor: '#dc2626',
    width: 25,
    height: 25,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  listContent: { paddingBottom: 90 },
  card: {
    padding: 20,
    borderRadius: 28,
    marginBottom: 18,
    elevation: 4,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: { color: '#16a34a', fontSize: 20, fontWeight: 'bold' },
  username: { fontSize: 18, fontWeight: 'bold' },
  subText: { fontSize: 15, marginTop: 3 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  body: { fontSize: 17, lineHeight: 26 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 18 },
  tag: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: '#16a34a', fontWeight: 'bold' },
  actions: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 18,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 16, fontWeight: 'bold' },
});