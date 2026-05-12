import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, isAuthLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!username || !password) {
      setError('Kullanıcı adı ve şifre zorunludur.');
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      navigation.replace('MainTabs');
    } else {
      setError(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.logoContainer}>
        <Text style={styles.owl}>🦉</Text>

        <View>
          <Text style={styles.logoText}>code 23</Text>
          <Text style={styles.logoText}>FIRAT</Text>
        </View>
      </View>

      <View style={styles.line} />

      <Text style={styles.subtitle}>
        Topluluk & Gönderi Platformu
      </Text>

      {/* Kullanıcı adı */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="#16a34a"
          style={styles.leftIcon}
        />

        <TextInput
          placeholder="Kullanıcı Adı"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      {/* Şifre */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#16a34a"
          style={styles.leftIcon}
        />

        <TextInput
          placeholder="Şifre"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
        >
          <Ionicons
            name={
              secureText
                ? 'eye-outline'
                : 'eye-off-outline'
            }
            size={24}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {/* Giriş Butonu */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isAuthLoading}
      >
        {isAuthLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>
            Giriş Yap
          </Text>
        )}
      </TouchableOpacity>

      {/* Güvenli giriş kartı */}
      <View style={styles.securityCard}>
        <View style={styles.securityIcon}>
          <Ionicons
            name="shield-checkmark-outline"
            size={28}
            color="#16a34a"
          />
        </View>

        <View>
          <Text style={styles.securityTitle}>
            Güvenli Giriş
          </Text>

          <Text style={styles.securityText}>
            Bilgileriniz SSL ile korunmaktadır.
          </Text>
        </View>
      </View>

      {/* Test hesabı */}
      <View style={styles.testContainer}>
        <Text style={styles.testText}>
          Test hesabı için:
        </Text>

        <Text style={styles.testAccount}>
          emilys / emilyspass
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  circleTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#dff5e5',
    opacity: 0.35,
    top: -120,
    right: -120,
  },

  circleBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#dff5e5',
    opacity: 0.35,
    bottom: -120,
    left: -120,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  owl: {
    fontSize: 72,
    marginRight: 18,
  },

  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#16a34a',
    lineHeight: 52,
  },

  

  subtitle: {
    fontSize: 20,
    color: '#6e6f6e',
    fontWeight: '600',
    marginBottom: 60,
    textAlign: 'center',
  },

  inputContainer: {
    width: '100%',
    height: 72,
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  leftIcon: {
    marginRight: 14,
  },

  input: {
    flex: 1,
    fontSize: 20,
    color: '#111827',
  },

  errorText: {
    color: '#dc2626',
    marginBottom: 12,
    fontSize: 15,
  },

  loginButton: {
    width: '100%',
    height: 72,
    backgroundColor: '#16a34a',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,

    shadowColor: '#16a34a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,

    elevation: 8,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },

  securityCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  securityIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  securityTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  securityText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },

  testContainer: {
    marginTop: 70,
    alignItems: 'center',
  },

  testText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 8,
  },

  testAccount: {
    fontSize: 22,
    color: '#16a34a',
    fontWeight: 'bold',
  },
});