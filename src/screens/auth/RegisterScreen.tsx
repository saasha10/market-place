import { RootStackParamList } from '@/navigation/AppNavigator';
import { register } from '@/services/auth';
import { createUserProfile } from '@/services/users';
import { friendlyAuthError } from '@/utils/firebaseErrors';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

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
        <Text variant="headlineMedium" style={styles.title}>
          Create your account
        </Text>
        <TextInput
          label="Full name"
          mode="outlined"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          label="Email"
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          label="Confirm password"
          mode="outlined"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Create account
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.replace('AuthLogin')}
          disabled={loading}
          style={styles.linkButton}
        >
          Already have an account? Sign in
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  form: { width: '100%', maxWidth: 360, gap: 8 },
  title: { marginBottom: 16, textAlign: 'center' },
  input: { marginBottom: 8 },
  button: { marginTop: 8 },
  linkButton: { marginTop: 8 },
});
