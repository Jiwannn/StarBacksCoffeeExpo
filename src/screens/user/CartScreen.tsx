import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { CartItemComponent } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ navigation }: any) => {
  const {
  cartItems,
  removeFromCart,
  updateQuantity,
  getSubtotal,
  getTax,
  getDeliveryFee,
  getGrandTotal,
} = useCart();
  const { colors } = useTheme();

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="cart-outline" size={80} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Your cart is empty
        </Text>
        <Button
          title="Start Shopping"
          onPress={() => navigation.navigate('HomeTab')}
          style={styles.shopButton}
        />
      </View>
    );
  }

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = getDeliveryFee();
  const total = getGrandTotal();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItemComponent
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        )}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.cartList}
      />
      
      <CartSummary
        subtotal={subtotal}
        tax={tax}
        deliveryFee={deliveryFee}
        total={total}
      />
      
      <View style={[styles.checkoutContainer, { backgroundColor: colors.surface }]}>
        <Button
          title={`Proceed to Checkout • ${total.toFixed(2)}`}
          onPress={() => navigation.navigate('Checkout')}
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    paddingHorizontal: 32,
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default CartScreen;