import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { AdminOrderCard } from '../../components/admin/AdminOrderCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ORDER_STATUS } from '../../utils/constants';

const AdminOrdersScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { colors } = useTheme();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const statusFilters = [
    { id: 'all', label: 'All' },
    ...Object.entries(ORDER_STATUS).map(([key, value]) => ({
      id: key,
      label: value.label,
    })),
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        horizontal
        data={statusFilters}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: colors.surface },
              filter === item.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setFilter(item.id)}
          >
            <Text style={[styles.filterText, { color: filter === item.id ? colors.primary : colors.textSecondary }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      />

      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => (
          <AdminOrderCard
            order={item}
            onPress={() => navigation.navigate('AdminOrderDetail', { orderId: item.id })}
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
  filterList: {
    flexGrow: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default AdminOrdersScreen;