import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const OrdersScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userOrders = await orderService.getUserOrders(user!.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusInfo = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
    return statusInfo?.color || '#999';
  };

  const getStatusLabel = (status: string) => {
    const statusInfo = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
    return statusInfo?.label || status;
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate('OrderConfirmation', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderNumber, { color: colors.primary }]}>
          {item.orderNumber}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
        {formatDate(item.createdAt)}
      </Text>
      <Text style={[styles.orderItems, { color: colors.text }]}>
        {item.items.length} item(s)
      </Text>
      <Text style={[styles.orderTotal, { color: colors.primary }]}>
        {formatPrice(item.total)}
      </Text>
      {item.status === 'delivered' && (
        <View style={styles.reviewRow}>
          {item.items.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.reviewButton, { borderColor: colors.primary }]}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('Review', {
                  orderId: item.id,
                  productId: product.productId,
                  productName: product.name,
                });
              }}
            >
              <Ionicons name="star-outline" size={14} color={colors.primary} />
              <Text style={[styles.reviewText, { color: colors.primary }]}>
                Review {product.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="receipt-outline" size={80} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No orders yet
        </Text>
        <TouchableOpacity
          style={[styles.shopButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.getParent()?.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
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
  listContainer: {
    padding: 16,
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    gap: 8,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  reviewText: {
    fontSize: 12,
    fontWeight: '600',
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
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrdersScreen;