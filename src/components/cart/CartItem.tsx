import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem as CartItemType } from '../../../src/types';
import { useTheme } from '../../../src/context/ThemeContext';
import { formatPrice } from '../../../src/utils/helpers';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          {formatPrice(item.price)}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.border }]}
            onPress={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          >
            <Text style={[styles.quantityButtonText, { color: colors.text }]}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.border }]}
            onPress={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          >
            <Text style={[styles.quantityButtonText, { color: colors.text }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(item.productId)} style={styles.removeButton}>
        <Text style={[styles.removeText, { color: colors.error }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    marginLeft: 12,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});