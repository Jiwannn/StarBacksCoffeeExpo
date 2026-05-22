import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { Button } from '../../components/common/Button';
import { GCASH_DETAILS } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';

const PaymentScreen = ({ route, navigation }: any) => {
  const { shippingAddress } = route.params;
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cod'>('gcash');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { cartItems, getSubtotal, getTax, getDeliveryFee, getGrandTotal, clearCart } = useCart();
  const { user } = useAuth();

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const subtotal = getSubtotal();
      const tax = getTax();
      const deliveryFee = getDeliveryFee();
      const total = getGrandTotal();

      const orderId = await orderService.createOrder(
        user!.id,
        cartItems,
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod,
        {
          id: Date.now().toString(),
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          street: shippingAddress.address,
          city: shippingAddress.city,
          province: shippingAddress.city,
          zipCode: shippingAddress.zipCode,
          phone: shippingAddress.phone,
          isDefault: true,
        }
      );

      await paymentService.createPayment({
        orderId,
        userId: user!.id,
        amount: total,
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending',
      });

      await clearCart();
      navigation.navigate('OrderConfirmation', { orderId });
    } catch (error: any) {
      console.error('Place order error:', error);
      Alert.alert('Error', error?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = getDeliveryFee();
  const total = getGrandTotal();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Payment Method</Text>
        
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'gcash' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
          ]}
          onPress={() => setPaymentMethod('gcash')}
        >
          <Text style={styles.paymentIcon}>📱</Text>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentName, { color: colors.text }]}>GCash</Text>
            <Text style={[styles.paymentDesc, { color: colors.textSecondary }]}>
              Pay via GCash mobile wallet
            </Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'gcash' && { backgroundColor: colors.primary }]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'cod' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
          ]}
          onPress={() => setPaymentMethod('cod')}
        >
          <Text style={styles.paymentIcon}>💵</Text>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentName, { color: colors.text }]}>Cash on Delivery</Text>
            <Text style={[styles.paymentDesc, { color: colors.textSecondary }]}>
              Pay when you receive your order
            </Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'cod' && { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
      </View>

      {paymentMethod === 'gcash' && (
        <View style={[styles.gcashSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.gcashTitle, { color: colors.primary }]}>GCash Payment Details</Text>
          <View style={styles.gcashInfo}>
            <Text style={[styles.gcashLabel, { color: colors.textSecondary }]}>Account Name:</Text>
            <Text style={[styles.gcashValue, { color: colors.text }]}>{GCASH_DETAILS.accountName}</Text>
          </View>
          <View style={styles.gcashInfo}>
            <Text style={[styles.gcashLabel, { color: colors.textSecondary }]}>GCash Number:</Text>
            <Text style={[styles.gcashValue, { color: colors.text }]}>{GCASH_DETAILS.accountNumber}</Text>
          </View>
          <View style={styles.instructions}>
            <Text style={[styles.instructionsTitle, { color: colors.primary }]}>Payment Instructions:</Text>
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>1. Open your GCash app</Text>
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>2. Send money to the number above</Text>
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>3. Enter amount: {formatPrice(total)}</Text>
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>4. Add your order number in reference</Text>
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>5. Complete the payment</Text>
          </View>
        </View>
      )}

      <View style={[styles.summarySection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.summaryTitle, { color: colors.primary }]}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tax (12%)</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(tax)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(deliveryFee)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.primary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(total)}</Text>
        </View>
      </View>

      <Button
        title="Place Order"
        onPress={handlePlaceOrder}
        loading={loading}
        size="large"
        style={styles.placeOrderButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  gcashSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  gcashTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  gcashInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gcashLabel: {
    fontSize: 14,
  },
  gcashValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  instructions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    marginBottom: 4,
  },
  summarySection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    marginBottom: 30,
  },
});

export default PaymentScreen;