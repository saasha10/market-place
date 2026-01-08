import { RootStackParamList } from '@/navigation/AppNavigator';
import { signIn } from '@/services/auth';
import { friendlyAuthError } from '@/utils/firebaseErrors';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthLogin'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (e: any) {
      Alert.alert('Sign in failed', friendlyAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  function goRegister() {
    navigation.replace('AuthRegister');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome
        </Text>
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
        <Button
          mode="contained"
          onPress={handleSignIn}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Sign In
        </Button>
        <Button mode="text" onPress={goRegister} disabled={loading} style={styles.linkButton}>
          Create an account
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
