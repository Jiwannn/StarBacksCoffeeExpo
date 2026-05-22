import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../src/context/ThemeContext';
import { formatPrice } from '../../../src/utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
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
    { title: 'Total Orders', value: stats.totalOrders, icon: 'receipt-outline' as const, color: '#4CAF50' },
    { title: 'Revenue', value: formatPrice(stats.totalRevenue), icon: 'cash-outline' as const, color: '#FF9800' },
    { title: 'Products', value: stats.totalProducts, icon: 'cube-outline' as const, color: '#2196F3' },
    { title: 'Users', value: stats.totalUsers, icon: 'people-outline' as const, color: '#9C27B0' },
    { title: 'Pending', value: stats.pendingOrders, icon: 'time-outline' as const, color: '#FFC107' },
    { title: 'Completed', value: stats.completedOrders, icon: 'checkmark-circle-outline' as const, color: '#4CAF50' },
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
