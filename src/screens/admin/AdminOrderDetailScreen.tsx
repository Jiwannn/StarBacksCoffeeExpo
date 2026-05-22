import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { orderService } from '../../services/orderService';
import { notificationService } from '../../services/notificationService';
import { Order } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const AdminOrderDetailScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Load order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: Order['status']) => {
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      if (newStatus === 'delivered') {
        await orderService.updatePaymentStatus(orderId, 'paid');
      }
      await notificationService.sendOrderStatusNotification(
        order!.userId,
        order!.orderNumber,
        newStatus
      );
      await loadOrder();
      Alert.alert('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setUpdating(false);
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
  const nextStatuses = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'out_for_delivery',
    out_for_delivery: 'delivered',
  } as const;

  const nextStatus = nextStatuses[order.status as keyof typeof nextStatuses];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.orderHeader, { backgroundColor: colors.surface }]}>
        <Text style={[styles.orderNumber, { color: colors.primary }]}>
          {order.orderNumber}
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
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Customer Information</Text>
        <Text style={[styles.customerName, { color: colors.text }]}>
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
        </Text>
        <Text style={[styles.customerInfo, { color: colors.textSecondary }]}>
          {order.shippingAddress.street}
        </Text>
        <Text style={[styles.customerInfo, { color: colors.textSecondary }]}>
          {order.shippingAddress.city}, {order.shippingAddress.zipCode}
        </Text>
        <Text style={[styles.customerInfo, { color: colors.textSecondary }]}>
          {order.shippingAddress.phone}
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
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Payment Method</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {order.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Payment Status</Text>
          <Text style={[styles.paymentStatus, { color: order.paymentStatus === 'paid' ? '#4CAF50' : '#FFC107' }]}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </Text>
        </View>
      </View>

      {nextStatus && (
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: colors.primary }]}
          onPress={() => updateStatus(nextStatus)}
          disabled={updating}
        >
          <Text style={styles.updateButtonText}>
            {updating ? 'Updating...' : `Mark as ${ORDER_STATUS[nextStatus].label}`}
          </Text>
        </TouchableOpacity>
      )}

      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.error }]}
          onPress={() => updateStatus('cancelled')}
        >
          <Text style={[styles.cancelButtonText, { color: colors.error }]}>Cancel Order</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderHeader: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 14,
    marginBottom: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
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
  paymentStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  updateButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 0,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AdminOrderDetailScreen;