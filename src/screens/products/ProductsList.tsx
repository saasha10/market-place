import { getAvailableProducts } from '@/services/productsService';
import { Product } from '@/types/models';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, Text } from 'react-native-paper';

type Props = NativeStackScreenProps<any, 'Products'>;

export default function ProductsList({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    loadProducts();
  }, [selectedSize, priceRange]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getAvailableProducts({
        size: selectedSize || undefined,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      });
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function openProductDetail(productId: string) {
    navigation.navigate('ProductDetail', { productId });
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text variant="labelMedium" style={styles.filterLabel}>
          Filter by size:
        </Text>
        <View style={styles.chipsRow}>
          {sizes.map((size) => (
            <Chip
              key={size}
              selected={selectedSize === size}
              onPress={() => setSelectedSize(selectedSize === size ? null : size)}
              style={styles.chip}
            >
              {size}
            </Chip>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <Card style={styles.productCard} onPress={() => openProductDetail(item.id)}>
              <Card.Cover
                source={{ uri: item.photos[0] || 'https://via.placeholder.com/200' }}
                style={styles.cardImage}
              />
              <Card.Content style={styles.cardContent}>
                <Text variant="titleSmall" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text variant="labelMedium" style={styles.price}>
                  ${(item.price / 100).toFixed(2)}
                </Text>
                <Chip
                  style={[
                    styles.statusChip,
                    item.status === 'available' && styles.statusAvailable,
                    item.status === 'reserved' && styles.statusReserved,
                    item.status === 'sold' && styles.statusSold,
                  ]}
                >
                  {item.status}
                </Chip>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingBottom: 16 },
  filterSection: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  filterLabel: { marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginBottom: 8 },
  loader: { flex: 1, justifyContent: 'center' },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 8 },
  productCard: { flex: 0.48, marginHorizontal: 4 },
  cardImage: { height: 150 },
  cardContent: { paddingVertical: 8 },
  price: { color: '#2563eb', fontWeight: '600', marginTop: 4 },
  statusChip: { marginTop: 8, alignSelf: 'flex-start' },
  statusAvailable: { backgroundColor: '#10b981' },
  statusReserved: { backgroundColor: '#f59e0b' },
  statusSold: { backgroundColor: '#ef4444' },
  emptyText: { textAlign: 'center', marginTop: 32 },
});
