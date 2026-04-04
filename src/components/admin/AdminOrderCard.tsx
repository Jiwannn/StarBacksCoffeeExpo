import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Order } from '../../../src/types';
import { useTheme } from '../../../src/context/ThemeContext';
import { formatPrice, formatDate } from '../../../src/utils/helpers';
import { ORDER_STATUS } from '../../../src/utils/constants';

interface AdminOrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

export const AdminOrderCard: React.FC<AdminOrderCardProps> = ({ order, onPress }) => {
  const { colors } = useTheme();
  const statusInfo = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.orderNumber, { color: colors.primary }]}>
          {order.orderNumber}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo?.color + '20' }]}>
          <Text style={[styles.statusText, { color: statusInfo?.color }]}>
            {statusInfo?.label || order.status}
          </Text>
        </View>
      </View>
      <Text style={[styles.date, { color: colors.textSecondary }]}>
        {formatDate(order.createdAt)}
      </Text>
      <Text style={[styles.items, { color: colors.text }]}>
        {order.items.length} item(s)
      </Text>
      <Text style={[styles.total, { color: colors.primary }]}>
        {formatPrice(order.total)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
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
  date: {
    fontSize: 12,
    marginBottom: 4,
  },
  items: {
    fontSize: 14,
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});