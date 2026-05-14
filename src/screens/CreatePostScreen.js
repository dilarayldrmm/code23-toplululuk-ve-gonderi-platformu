import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const { addPostOptimistic } = usePosts();
  const { addNotification } = useNotifications();
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/posts/tags')
      .then(res => res.json())
      .then(data => {
        const cleanTags = data.map(item =>
          typeof item === 'string' ? item : item.slug
        );

        setTags(cleanTags.slice(0, 20));
      })
      .catch(() => {
        Alert.alert('Hata', 'Etiketler alınamadı');
      });
  }, []);

  const toggleTag = tag => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(item => item !== tag));
      return;
    }

    if (selectedTags.length >= 3) {
      Alert.alert('Uyarı', 'En fazla 3 etiket seçebilirsin');
      return;
    }

    setSelectedTags(prev => [...prev, tag]);
  };

  const isValid = title.trim().length > 0 && body.trim().length >= 12;

  const handleShare = async () => {
    if (!isValid) {
      Alert.alert('Eksik bilgi', 'Başlık ve en az 5 karakterlik gönderi yazmalısın.');
      return;
    }

    const result = await addPostOptimistic({
      title: title.trim(),
      body: body.trim(),
      tags: selectedTags,
      userId: user?.id || 1,
    });

    if (result.success) {
      addNotification('post', 'Gönderiniz paylaşıldı.');

      Alert.alert('Başarılı', 'Gönderiniz paylaşıldı.');

      setTitle('');
      setBody('');
      setSelectedTags([]);

      navigation.navigate('FeedTab');
    } else {
      Alert.alert('Hata', result.message || 'Gönderi oluşturulamadı');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: colors.text }]}>
        Gönderi Oluştur
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Başlık</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Başlık yaz..."
        placeholderTextColor={colors.softText}
        value={title}
        onChangeText={setTitle}
      />

      {title.trim().length === 0 && (
        <Text style={styles.error}>Başlık zorunlu.</Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Gönderi</Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="En az 12 karakter yaz..."
        placeholderTextColor={colors.softText}
        value={body}
        onChangeText={setBody}
        multiline
        maxLength={500}
      />

      <Text style={[styles.counter, { color: colors.softText }]}>
        {body.length} / 500
      </Text>

      {body.length > 0 && body.trim().length < 20 && (
        <Text style={styles.error}>Gönderi en az 20 karakter olmalı.</Text>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Etiketler</Text>

      <View style={styles.tags}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={`${tag}-${index}`}
            style={[
              styles.tag,
              selectedTags.includes(tag) && styles.selectedTag,
            ]}
            onPress={() => toggleTag(tag)}
          >
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag) && styles.selectedTagText,
              ]}
            >
              #{tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.disabledButton]}
        disabled={!isValid}
        onPress={handleShare}
      >
        <Text style={styles.buttonText}>Paylaş</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    marginTop: 6,
  },
  error: {
    color: '#dc2626',
    marginTop: 5,
    fontSize: 13,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },
  selectedTag: {
    backgroundColor: '#16A34A',
  },
  tagText: {
    color: '#333333',
  },
  selectedTagText: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 25,
  },
  disabledButton: {
    backgroundColor: '#9AD6AA',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});