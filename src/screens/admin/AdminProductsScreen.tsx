import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { AdminProductCard } from '../../components/admin/AdminProductCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const AdminProductsScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProductsForAdmin();
      setProducts(data);
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await productService.deleteProduct(productId);
            await loadProducts();
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (productId: string, isAvailable: boolean) => {
    await productService.updateProduct(productId, { isAvailable });
    await loadProducts();
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AdminAddEditProduct')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <AdminProductCard
            product={item}
            onEdit={(product) => navigation.navigate('AdminAddEditProduct', { product })}
            onDelete={handleDelete}
            onToggleAvailability={handleToggleAvailability}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default AdminProductsScreen;