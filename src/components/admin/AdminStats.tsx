import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../src/context/ThemeContext';
import { formatPrice } from '../../../src/utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );
};

interface AdminStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    pendingOrders: number;
    completedOrders: number;
  };
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#4CAF50' },
    { title: 'Revenue', value: formatPrice(stats.totalRevenue), icon: '💰', color: '#FF9800' },
    { title: 'Products', value: stats.totalProducts, icon: '☕', color: '#2196F3' },
    { title: 'Users', value: stats.totalUsers, icon: '👥', color: '#9C27B0' },
    { title: 'Pending', value: stats.pendingOrders, icon: '⏳', color: '#FFC107' },
    { title: 'Completed', value: stats.completedOrders, icon: '✅', color: '#4CAF50' },
  ];

  return (
    <View style={styles.container}>
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  card: {
    width: '31%',
    margin: '1%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    textAlign: 'center',
  },
});