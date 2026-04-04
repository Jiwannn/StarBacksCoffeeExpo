import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { authService } from '../../services/authService';
import { AdminStats } from '../../components/admin/AdminStats';
import { AdminOrderCard } from '../../components/admin/AdminOrderCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Order } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboardScreen = ({ navigation }: any) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [orders, products, users] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProductsForAdmin(),
        authService.getAllUsers(),
      ]);

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const completedOrders = orders.filter(o => o.status === 'delivered').length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders,
        completedOrders,
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Load dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Admin Dashboard</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Welcome back, Administrator
        </Text>
      </View>

      <AdminStats stats={stats} />

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => navigation.navigate('Products')}
          >
            <Ionicons name="cafe-outline" size={32} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Manage Products</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => navigation.navigate('Orders')}
          >
            <Ionicons name="receipt-outline" size={32} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => navigation.navigate('Products', { screen: 'AdminAddEditProduct' })}
          >
            <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recent Orders</Text>
        {recentOrders.map(order => (
          <AdminOrderCard
            key={order.id}
            order={order}
            onPress={() => navigation.navigate('Orders', { screen: 'AdminOrderDetail', params: { orderId: order.id } })}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default AdminDashboardScreen;