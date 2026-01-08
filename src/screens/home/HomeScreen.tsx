import { logout } from '@/services/auth';

import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Home
      </Text>
      <Text variant="bodyLarge">Catalog will appear here…</Text>
      <Button mode="contained" onPress={logout} style={styles.button}>
        Log out
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 8 },
  button: { marginTop: 16 },
});
