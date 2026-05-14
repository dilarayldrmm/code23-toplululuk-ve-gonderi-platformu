import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
 TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../context/PostContext';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;

  const {
    loadComments,
    addComment,
    commentCache,
    toggleBookmark,
    isBookmarked,
  } = usePosts();

  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [likedComments, setLikedComments] = useState({});

  const inputRef = useRef(null);

  const comments = commentCache[post.id] || [];
  const bookmarked = isBookmarked(post.id);

  useEffect(() => {
    loadComments(post.id);
  }, [post.id]);

  const handleSendComment = async () => {
    if (!comment.trim()) return;

    const text = comment.trim();
    setComment('');
    setError('');

    const result = await addComment(post.id, text);

    if (!result.success) {
      setError(result.message || 'Yorum eklenemedi');
    }
  };

  const toggleCommentLike = commentId => {
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReply = username => {
  setComment(`@${username} `);

  setTimeout(() => {
    inputRef.current?.focus();
  }, 100);
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={34} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Gönderi Detayı</Text>

        <TouchableOpacity onPress={() => toggleBookmark(post)}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.postCard}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>K{post.userId}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Kullanıcı #{post.userId}</Text>
              <Text style={styles.time}>Topluluk gönderisi</Text>
            </View>

            <Ionicons name="ellipsis-horizontal" size={24} color="#6b7280" />
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.body}</Text>

          <View style={styles.tagsRow}>
            {post.tags?.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.imageBox}>
            <Ionicons name="image-outline" size={70} color="#16a34a" />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.statText}>{post.reactions?.likes || 0}</Text>
              <Text style={styles.statLabel}>Beğeni</Text>
            </View>

            <View style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={24} color="#374151" />
              <Text style={styles.statText}>{comments.length}</Text>
              <Text style={styles.statLabel}>Yorum</Text>
            </View>

            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={24} color="#374151" />
              <Text style={styles.statText}>{post.views || 0}</Text>
              <Text style={styles.statLabel}>Görüntülenme</Text>
            </View>

            <TouchableOpacity
              style={styles.stat}
              onPress={() => toggleBookmark(post)}
            >
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={bookmarked ? '#16a34a' : '#374151'}
              />
              <Text style={styles.statLabel}>
                {bookmarked ? 'Kaydedildi' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentHeader}>
          <Text style={styles.commentTitle}>Yorumlar ({comments.length})</Text>

          <View style={styles.sortButton}>
            <Ionicons name="swap-vertical" size={18} color="#374151" />
            <Text style={styles.sortText}>En Yeniler</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {comments.map(item => {
          const username =
            item.user?.fullName ||
            item.user?.username ||
            item.user?.firstName ||
            'Kullanıcı';

          const initials = username.substring(0, 2).toUpperCase();

          return (
            <View key={item.id} style={styles.commentCard}>
              <View style={styles.commentTop}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{initials}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.commentName}>{username}</Text>
                  <Text style={styles.commentTime}>
                    {item.isOptimistic
                      ? 'Şimdi gönderiliyor...'
                      : 'Yeni yorum'}
                  </Text>
                </View>

                <Ionicons
                  name="ellipsis-horizontal"
                  size={22}
                  color="#6b7280"
                />
              </View>

              <Text style={styles.commentText}>{item.body}</Text>

              <View style={styles.commentActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => toggleCommentLike(item.id)}
                >
                  <Ionicons
                    name={
                      likedComments[item.id]
                        ? 'thumbs-up'
                        : 'thumbs-up-outline'
                    }
                    size={20}
                    color={
                      likedComments[item.id]
                        ? '#16a34a'
                        : '#6b7280'
                    }
                  />

                  <Text
                    style={[
                      styles.actionText,
                      likedComments[item.id] && {
                        color: '#16a34a',
                      },
                    ]}
                  >
                    {likedComments[item.id] ? 2 : 1}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.replyText}>Yanıtla</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputAvatar}>
          <Text style={styles.inputAvatarText}>S</Text>
        </View>

        <TextInput
          placeholder="Yorumunuzu yazın..."
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendComment}
        >
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f7' },

  header: {
    height: 92,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },

  postCard: {
    backgroundColor: '#fff',
    margin: 18,
    borderRadius: 28,
    padding: 20,
    elevation: 5,
  },

  userRow: { flexDirection: 'row', alignItems: 'center' },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: { color: '#16a34a', fontSize: 22, fontWeight: 'bold' },

  name: { fontSize: 24, fontWeight: 'bold', color: '#111827' },

  time: { marginTop: 4, fontSize: 15, color: '#6b7280' },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 24,
    lineHeight: 38,
  },

  body: {
    fontSize: 19,
    color: '#374151',
    marginTop: 18,
    lineHeight: 31,
  },

  tagsRow: { flexDirection: 'row', marginTop: 24, flexWrap: 'wrap' },

  tag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 10,
  },

  tagText: { color: '#16a34a', fontSize: 16, fontWeight: '600' },

  imageBox: {
    height: 260,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },

  stat: { alignItems: 'center', flex: 1 },

  statText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },

  statLabel: { fontSize: 14, color: '#6b7280', marginTop: 3 },

  commentHeader: {
    marginHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  commentTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },

  sortButton: { flexDirection: 'row', alignItems: 'center' },

  sortText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },

  errorText: {
    marginHorizontal: 18,
    marginBottom: 12,
    color: '#dc2626',
    fontWeight: '600',
  },

  commentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 24,
    padding: 18,
    elevation: 4,
  },

  commentTop: { flexDirection: 'row', alignItems: 'center' },

  commentAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  commentAvatarText: { color: '#16a34a', fontSize: 20, fontWeight: 'bold' },

  commentName: { fontSize: 21, fontWeight: 'bold', color: '#111827' },

  commentTime: { fontSize: 14, color: '#6b7280', marginTop: 3 },

  commentText: {
    marginTop: 18,
    fontSize: 19,
    color: '#374151',
    lineHeight: 30,
  },

  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },

  actionText: {
    marginLeft: 6,
    color: '#6b7280',
    fontWeight: 'bold',
    fontSize: 16,
  },

  replyText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },

  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  inputAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  inputAvatarText: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 22,
  },

  input: {
    flex: 1,
    height: 56,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 17,
    color: '#111827',
  },

  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});