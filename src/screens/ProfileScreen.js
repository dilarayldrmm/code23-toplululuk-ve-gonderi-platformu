import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  const postContext = usePosts();
  const { colors } = useTheme();

  const userPosts = postContext?.userPosts || [];
  const bookmarks = postContext?.bookmarks || [];
  const likedPostIds = postContext?.likedPostIds || [];

  const [activeTab, setActiveTab] = useState('posts');

  const myPosts = userPosts.length > 0
  ? userPosts
  : (postContext?.posts || []).filter(post => post.isOptimistic || post.userId === user?.id);

  const data = activeTab === 'posts' ? myPosts : bookmarks;

  const renderMiniPost = ({ item }) => (
    <TouchableOpacity
      style={[styles.miniCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('PostDetail', { post: item })}
    >
      <View style={styles.imageBox}>
        <Ionicons name="document-text-outline" size={34} color="#16a34a" />
      </View>

      <Text
        numberOfLines={2}
        style={[styles.miniTitle, { color: colors.text }]}
      >
        {item.title}
      </Text>

      <Text
        numberOfLines={2}
        style={[styles.miniBody, { color: colors.softText }]}
      >
        {item.body}
      </Text>

      <View style={styles.miniStats}>
        <Text style={styles.miniStat}>❤️ {item.reactions?.likes || 0}</Text>
        <Text style={styles.miniStat}>👁️ {item.views || 0}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileTop}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={75} color="#111827" />
        </View>

        <Text style={[styles.name, { color: colors.text }]}>
          {user?.firstName
            ? `${user.firstName} ${user.lastName || ''}`
            : user?.username || 'emilys'}
        </Text>

        <Text style={[styles.username, { color: colors.softText }]}>
          @{user?.username || 'emilys'}
        </Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {myPosts.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Gönderi
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {likedPostIds.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Beğeni
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {bookmarks.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Kaydedilen
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.text }]} />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'posts' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={styles.tabText}>Gönderilerim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'bookmarks' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('bookmarks')}
        >
          <Text style={styles.tabText}>Yer İmleri</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item, index) => `${item?.id || index}-${index}`}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.softText }]}>
            {activeTab === 'posts'
              ? 'Henüz gönderi paylaşmadın.'
              : 'Henüz kaydedilen gönderi yok.'}
          </Text>
        }
        renderItem={renderMiniPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileTop: {
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  avatar: {
    width: 135,
    height: 135,
    borderRadius: 75,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 25, fontWeight: 'bold' },
  username: { fontSize: 18, marginTop: 6 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 42,
    marginTop: 16,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 21 },
  statLabel: { fontSize: 18 },
  divider: { height: 1.5 },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tabButton: {
    backgroundColor: '#d9d9d9',
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderRadius: 15,
  },
  activeTab: {
    backgroundColor: '#c7c7c7',
  },
  tabText: {
    fontSize: 23,
    color: '#000',
  },
  grid: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 90,
  },
  miniCard: {
    width: '47%',
    borderRadius: 18,
    padding: 12,
    margin: '1.5%',
    elevation: 5,
  },
  imageBox: {
    height: 72,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  miniBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  miniStat: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 12,
  },
  empty: {
    marginTop: 25,
    fontSize: 16,
    textAlign: 'center',
  },
});