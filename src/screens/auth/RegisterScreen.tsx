import { RootStackParamList } from '@/navigation/AppNavigator';
import { register } from '@/services/auth';
import { createUserProfile } from '@/services/users';
import { friendlyAuthError } from '@/utils/firebaseErrors';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthRegister'>;

export default function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert('Validation', 'Email and password are required');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const user = await register(email, password);
      await createUserProfile(user, { displayName: fullName });
      // Auth gate will redirect; optionally navigate back
    } catch (e: any) {
      Alert.alert('Registration failed', friendlyAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Create your account</Text>
        <TextInput
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          style={styles.input}
        />
        <TouchableOpacity
          disabled={loading}
          onPress={handleRegister}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating…' : 'Create account'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          onPress={() => navigation.replace('AuthLogin')}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  form: { width: '100%', maxWidth: 360 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: 'white', fontWeight: '600' },
  linkButton: { paddingVertical: 12, alignItems: 'center' },
  linkText: { color: '#2563eb', fontWeight: '500' },
});
