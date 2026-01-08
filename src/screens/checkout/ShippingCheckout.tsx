import { updateOrderWithShipping } from '@/services/productsService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';

type Props = NativeStackScreenProps<any, 'ShippingCheckout'>;

export default function ShippingCheckout({ route, navigation }: Props) {
  const { orderId } = route.params as { orderId: string; productId: string };
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleProceedToPayment() {
    // Validation
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Full name is required');
      return;
    }
    if (!addressLine1.trim()) {
      Alert.alert('Validation', 'Address line 1 is required');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Validation', 'City is required');
      return;
    }
    if (!postalCode.trim()) {
      Alert.alert('Validation', 'Postal code is required');
      return;
    }
    if (!country.trim()) {
      Alert.alert('Validation', 'Country is required');
      return;
    }

    try {
      setSaving(true);
      const shippingAddress = {
        fullName,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        state: state || undefined,
        postalCode,
        country,
        phone: phone || undefined,
      };

      await updateOrderWithShipping(orderId, shippingAddress);
      navigation.navigate('Payment', { orderId });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save shipping address');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          Shipping Address
        </Text>

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Address Line 1"
          value={addressLine1}
          onChangeText={setAddressLine1}
          style={styles.input}
          mode="outlined"
          placeholder="Street address"
        />

        <TextInput
          label="Address Line 2 (Optional)"
          value={addressLine2}
          onChangeText={setAddressLine2}
          style={styles.input}
          mode="outlined"
          placeholder="Apartment, suite, etc."
        />

        <View style={styles.row}>
          <TextInput
            label="City"
            value={city}
            onChangeText={setCity}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
          />
          <TextInput
            label="State (Optional)"
            value={state}
            onChangeText={setState}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
            keyboardType="number-pad"
          />
          <TextInput
            label="Country"
            value={country}
            onChangeText={setCountry}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
          />
        </View>

        <TextInput
          label="Phone (Optional)"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
        />

        <Button
          mode="contained"
          onPress={handleProceedToPayment}
          loading={saving}
          disabled={saving}
          style={styles.button}
        >
          Proceed to Payment
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 16 },
  title: { marginBottom: 24 },
  input: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfInput: { flex: 1 },
  button: { marginTop: 24, paddingVertical: 8 },
});
