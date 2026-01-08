import { logout } from '@/services/auth';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<any, 'App'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Welcome to MarketPlace
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Buy and sell clothing with ease
      </Text>

      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">🛍️ Shop</Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Browse available products
            </Text>
            <Button mode="contained" onPress={() => navigation.navigate('Products')} style={styles.cardButton}>
              View Catalog
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">👤 Account</Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Manage your profile and settings
            </Text>
            <Button mode="outlined" onPress={logout} style={styles.cardButton}>
              Log Out
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { marginBottom: 8, textAlign: 'center' },
  subtitle: { marginBottom: 24, textAlign: 'center', color: '#666' },
  cardsContainer: { gap: 16 },
  card: { marginBottom: 16 },
  cardDescription: { marginTop: 8, marginBottom: 12 },
  cardButton: { marginTop: 8 },
});
