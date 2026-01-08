import { getProductById, reserveProductAndCreateOrder } from '@/services/productsService';
import { getCurrentUser } from '@/services/auth';
import { Product } from '@/types/models';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Text } from 'react-native-paper';

type Props = NativeStackScreenProps<any, 'ProductDetail'>;

export default function ProductDetail({ route, navigation }: Props) {
  const { productId } = route.params as { productId: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);
      const data = await getProductById(productId);
      setProduct(data);
      if (data?.sizes.length === 1) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load product');
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve() {
    if (!selectedSize) {
      Alert.alert('Validation', 'Please select a size');
      return;
    }

    if (!product || product.status !== 'available') {
      Alert.alert('Error', 'Product is not available');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to reserve a product');
      return;
    }

    try {
      setReserving(true);
      const orderId = await reserveProductAndCreateOrder(productId, currentUser.uid, selectedSize);
      navigation.navigate('ShippingCheckout', { orderId, productId });
    } catch (error: any) {
      Alert.alert('Reservation failed', error.message);
    } finally {
      setReserving(false);
    }
  }

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image gallery */}
      <FlatList
        data={product.photos}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            {item ? (
              <Image source={{ uri: item }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>
        )}
        scrollEnabled={false}
        style={styles.gallery}
      />

      {/* Details */}
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {product.title}
        </Text>

        <Text variant="displaySmall" style={styles.price}>
          ${(product.price / 100).toFixed(2)}
        </Text>

        {product.condition && (
          <Text variant="bodySmall" style={styles.condition}>
            Condition: {product.condition}
          </Text>
        )}

        {product.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {product.description}
          </Text>
        )}

        {/* Size selector */}
        <Text variant="labelLarge" style={styles.sizeLabel}>
          Select size:
        </Text>
        <View style={styles.sizesRow}>
          {product.sizes.map((size) => {
            const isReserved = product.reservedSizes?.some((rs) => rs.size === size);
            return (
              <Chip
                key={size}
                selected={selectedSize === size}
                disabled={isReserved}
                onPress={() => !isReserved && setSelectedSize(size)}
                style={[styles.sizeChip, isReserved && styles.sizeChipDisabled]}
              >
                {size}
              </Chip>
            );
          })}
        </View>

        {/* Status badge */}
        <Chip
          style={[
            styles.statusBadge,
            product.status === 'available' && styles.statusAvailable,
            product.status === 'reserved' && styles.statusReserved,
            product.status === 'sold' && styles.statusSold,
          ]}
        >
          {product.status.toUpperCase()}
        </Chip>

        {/* Reserve button */}
        {product.status === 'available' && (
          <Button
            mode="contained"
            onPress={handleReserve}
            loading={reserving}
            disabled={!selectedSize || reserving}
            style={styles.reserveButton}
          >
            Reserve
          </Button>
        )}

        {product.status === 'sold' && (
          <Text variant="bodySmall" style={styles.soldText}>
            This product has been sold
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loader: { flex: 1, justifyContent: 'center' },
  errorText: { textAlign: 'center', marginTop: 32 },
  gallery: { height: 300, backgroundColor: '#f0f0f0' },
  imageContainer: { width: '100%', height: 300, justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '100%', height: '100%' },
  placeholderImage: { width: '100%', height: 300, backgroundColor: '#e0e0e0' },
  content: { padding: 16 },
  title: { marginBottom: 8 },
  price: { color: '#10b981', fontWeight: 'bold', marginBottom: 12 },
  condition: { marginBottom: 8, fontStyle: 'italic', color: '#666' },
  description: { marginBottom: 16, lineHeight: 20 },
  sizeLabel: { marginTop: 16, marginBottom: 8 },
  sizesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  sizeChip: { minWidth: 60 },
  sizeChipDisabled: { opacity: 0.5 },
  statusBadge: { alignSelf: 'flex-start', marginBottom: 16 },
  statusAvailable: { backgroundColor: '#10b981' },
  statusReserved: { backgroundColor: '#f59e0b' },
  statusSold: { backgroundColor: '#ef4444' },
  reserveButton: { marginTop: 16, paddingVertical: 8 },
  soldText: { color: '#ef4444', textAlign: 'center', marginTop: 16 },
});
