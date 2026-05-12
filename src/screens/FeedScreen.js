import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../context/PostContext';

export default function FeedScreen({ navigation }) {
  const { posts, loadMore, isLoading, hasMore } = usePosts();

  useEffect(() => {
    if (posts.length === 0) {
      loadMore();
    }
  }, []);

  const renderPost = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('PostDetail', { post: item })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.userId}
            </Text>
          </View>

          <View>
            <Text style={styles.author}>
              Kullanıcı #{item.userId}
            </Text>
            <Text style={styles.time}>Topluluk gönderisi</Text>
          </View>
        </View>

        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>

        <View style={styles.tags}>
          {item.tags?.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.stat}>
            <Ionicons
              name="heart-outline"
              size={20}
              color="#16a34a"
            />
            <Text style={styles.statText}>
              {item.reactions?.likes || 0}
            </Text>
          </View>

          <View style={styles.stat}>
            <Ionicons
              name="chatbubble-outline"
              size={19}
              color="#6b7280"
            />
            <Text style={styles.statText}>
              {item.reactions?.dislikes || 0}
            </Text>
          </View>

          <View style={styles.stat}>
            <Ionicons
              name="eye-outline"
              size={20}
              color="#6b7280"
            />
            <Text style={styles.statText}>
              {item.views || 0}
            </Text>
          </View>

          <Ionicons
            name="bookmark-outline"
            size={22}
            color="#16a34a"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color="#16a34a" />
        <Text style={styles.loadingText}>
          Gönderiler yükleniyor...
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba 👋</Text>
          <Text style={styles.headerTitle}>CODE23 Akış</Text>
        </View>

        <View style={styles.notificationBox}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#16a34a"
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          `${item.id}-${index}`
        }
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f7',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 15,
    color: '#6b7280',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 2,
  },

  notificationBox: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 4,
  },

  badge: {
    position: 'absolute',
    top: 7,
    right: 7,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 15,
  },

  author: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  time: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },

  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },

  body: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 8,
  },

  tag: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  tagText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '600',
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 16,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },

  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
});