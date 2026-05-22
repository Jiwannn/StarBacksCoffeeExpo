import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const OrderConfirmationScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Load order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Order not found</Text>
      </View>
    );
  }

  const statusInfo = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.successHeader, { backgroundColor: colors.surface }]}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        <Text style={[styles.successTitle, { color: colors.primary }]}>Order Confirmed!</Text>
        <Text style={[styles.successText, { color: colors.textSecondary }]}>
          Thank you for your purchase
        </Text>
      </View>

      <View style={[styles.orderInfo, { backgroundColor: colors.surface }]}>
        <Text style={[styles.orderNumber, { color: colors.primary }]}>
          Order #{order.orderNumber}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
          {formatDate(order.createdAt)}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
                x{item.quantity}
              </Text>
            </View>
            <Text style={[styles.itemPrice, { color: colors.primary }]}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(order.subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tax (12%)</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(order.tax)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(order.deliveryFee)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.primary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(order.total)}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Shipping Address</Text>
        <Text style={[styles.addressText, { color: colors.text }]}>
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
        </Text>
        <Text style={[styles.addressText, { color: colors.textSecondary }]}>
          {order.shippingAddress.street}
        </Text>
        <Text style={[styles.addressText, { color: colors.textSecondary }]}>
          {order.shippingAddress.city}, {order.shippingAddress.zipCode}
        </Text>
        <Text style={[styles.addressText, { color: colors.textSecondary }]}>
          {order.shippingAddress.phone}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.trackButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
        {order.status === 'delivered' && order.items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.reviewButton, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Review', {
              orderId: order.id,
              productId: item.productId,
              productName: item.name,
            })}
          >
            <Ionicons name="star-outline" size={18} color={colors.primary} />
            <Text style={[styles.reviewButtonText, { color: colors.primary }]}>
              Review {item.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.shopButton, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.shopButtonText, { color: colors.primary }]}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  successHeader: { alignItems: 'center', padding: 32, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  successText: { fontSize: 14 },
  orderInfo: { margin: 16, padding: 16, borderRadius: 16, alignItems: 'center' },
  orderNumber: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  orderDate: { fontSize: 12 },
  section: { margin: 16, padding: 16, borderRadius: 16, marginTop: 0 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemInfo: { flex: 1, flexDirection: 'row' },
  itemName: { fontSize: 14, flex: 1 },
  itemQuantity: { fontSize: 12, marginLeft: 8 },
  itemPrice: { fontSize: 14, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '500' },
  divider: { height: 1, marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  addressText: { fontSize: 14, marginBottom: 4 },
  buttonContainer: { padding: 16, marginBottom: 30 },
  trackButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  trackButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  reviewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12, gap: 8 },
  reviewButtonText: { fontSize: 14, fontWeight: '600' },
  shopButton: { padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  shopButtonText: { fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 18, textAlign: 'center', marginTop: 50 },
});

export default OrderConfirmationScreen;