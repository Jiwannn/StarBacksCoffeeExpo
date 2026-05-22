import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { ProductCard } from '../../components/common/ProductCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const ProductListScreen = ({ route, navigation }: any) => {
  const { category, title, search } = route.params || {};
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc'>('name');
  const { colors } = useTheme();

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      console.log('📱 ProductList screen, category:', category);
      const data = await productService.getProducts(category);
      setProducts(data);
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (productsToSort: Product[]) => {
    const filtered = search
      ? productsToSort.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        )
      : productsToSort;

    switch (sortBy) {
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'price_asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      default:
        return filtered;
    }
  };

  const sortedProducts = sortProducts(products);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    />
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {title || (category ? category.toUpperCase() : 'All Products')}
        </Text>
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && { backgroundColor: colors.primary + '20' }]}
            onPress={() => setSortBy('name')}
          >
            <Text style={[styles.sortText, { color: sortBy === 'name' ? colors.primary : colors.textSecondary }]}>
              Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price_asc' && { backgroundColor: colors.primary + '20' }]}
            onPress={() => setSortBy('price_asc')}
          >
            <Text style={[styles.sortText, { color: sortBy === 'price_asc' ? colors.primary : colors.textSecondary }]}>
              Price ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price_desc' && { backgroundColor: colors.primary + '20' }]}
            onPress={() => setSortBy('price_desc')}
          >
            <Text style={[styles.sortText, { color: sortBy === 'price_desc' ? colors.primary : colors.textSecondary }]}>
              Price ↓
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {sortedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {search ? `No results found for "${search}"` : 'No products found in this category.'}
          </Text>
          {search && (
            <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
              Try searching with a different keyword.
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  sortContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  sortLabel: { fontSize: 14, marginRight: 8 },
  sortButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  sortText: { fontSize: 12, fontWeight: '500' },
  productList: { padding: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, marginTop: 16, fontWeight: '600', textAlign: 'center' },
  emptySubText: { fontSize: 13, marginTop: 8, textAlign: 'center' },
});

export default ProductListScreen;