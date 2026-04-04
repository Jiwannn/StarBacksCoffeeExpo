import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Product } from '../../../src/types';
import { useTheme } from '../../../src/context/ThemeContext';
import { useCart } from '../../../src/context/CartContext';
import { formatPrice } from '../../../src/utils/helpers';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, horizontal = false }) => {
  const { colors } = useTheme();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (horizontal) {
    return (
      <TouchableOpacity
        style={[styles.horizontalCard, { backgroundColor: colors.surface }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: product.imageUrl }} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatPrice(product.price)}
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          {formatPrice(product.price)}
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addButton: {
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalCard: {
    flexDirection: 'row',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
});