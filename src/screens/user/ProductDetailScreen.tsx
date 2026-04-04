import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/common/Button';
import { formatPrice } from '../../utils/helpers';

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    Alert.alert(
      'Added to Cart',
      `${quantity}x ${product.name} added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          {formatPrice(product.price)}
        </Text>
        
        <View style={styles.stockContainer}>
          <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Stock:</Text>
          <Text style={[styles.stockValue, { color: product.stock > 0 ? '#4CAF50' : '#F44336' }]}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Description</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {product.description}
        </Text>

        {product.stock > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.border }]}
                onPress={decreaseQuantity}
              >
                <Text style={[styles.quantityButtonText, { color: colors.text }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.quantity, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.border }]}
                onPress={increaseQuantity}
              >
                <Text style={[styles.quantityButtonText, { color: colors.text }]}>+</Text>
              </TouchableOpacity>
            </View>

            <Button
              title={`Add to Cart - ${formatPrice(product.price * quantity)}`}
              onPress={handleAddToCart}
              style={styles.addButton}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stockLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  addButton: {
    marginBottom: 20,
  },
});

export default ProductDetailScreen;