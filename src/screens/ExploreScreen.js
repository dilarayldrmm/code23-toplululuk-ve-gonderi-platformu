import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function ExploreScreen({ navigation }) {
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getTags();
    getPopularPosts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === '') {
        getPopularPosts();
      } else {
        searchByTag(search.trim().toLowerCase());
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const getTags = async () => {
    const res = await fetch('https://dummyjson.com/posts/tags');
    const data = await res.json();

    const cleanTags = data.map(item =>
      typeof item === 'string' ? item : item.slug || item.name
    );

    setTags(cleanTags);
    setTopTags(cleanTags.slice(0, 8));
  };

  const getPopularPosts = async () => {
    const res = await fetch('https://dummyjson.com/posts?limit=30');
    const data = await res.json();

    const sorted = data.posts.sort(
      (a, b) => (b.reactions?.likes || 0) - (a.reactions?.likes || 0)
    );

    setPosts(sorted);
  };

  const searchByTag = async tag => {
    const res = await fetch(`https://dummyjson.com/posts/tag/${tag}`);
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const filteredTags =
    search.trim() === ''
      ? topTags
      : tags.filter(tag => tag.toLowerCase().includes(search.toLowerCase()));

  const selectTag = tag => {
    setSearch(tag);
    searchByTag(tag);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Keşfet</Text>

      <TextInput
        style={[styles.search, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Etiket ara..."
        placeholderTextColor={colors.softText}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        En Çok Tutan Etiketler
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
        {filteredTags.map((tag, index) => (
          <TouchableOpacity
            key={`${tag}-${index}`}
            style={styles.tag}
            onPress={() => selectTag(tag)}
          >
            <Text style={styles.tagText}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {search ? `#${search} gönderileri` : 'En Çok Beğenilenler'}
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
          >
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

            <Text numberOfLines={2} style={[styles.body, { color: colors.softText }]}>
              {item.body}
            </Text>

            <Text style={styles.info}>
              ❤️ {item.reactions?.likes || 0}   💬 {item.reactions?.dislikes || 0}   👁️ {item.views || 0}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  header: { fontSize: 34, fontWeight: 'bold', marginBottom: 20 },
  search: { padding: 18, borderRadius: 20, marginBottom: 22, fontSize: 16 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  tagScroll: { minHeight: 55, marginBottom: 20 },
  tag: {
  backgroundColor: '#16a34a',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  marginRight: 10,
  height: 42,
  justifyContent: 'center',
  alignItems: 'center',
},
  tagText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  card: { padding: 18, borderRadius: 22, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: 'bold', marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 22 },
  info: { marginTop: 12, color: '#16a34a', fontWeight: 'bold', fontSize: 16 },
});