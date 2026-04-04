import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminAddEditProductScreen from '../screens/admin/AdminAddEditProductScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminOrderDetailScreen from '../screens/admin/AdminOrderDetailScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProductsStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFF',
      }}
    >
      <Stack.Screen name="AdminProductsList" component={AdminProductsScreen} options={{ title: 'Manage Products' }} />
      <Stack.Screen name="AdminAddEditProduct" component={AdminAddEditProductScreen} options={{ title: 'Product Details' }} />
    </Stack.Navigator>
  );
};

const OrdersStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFF',
      }}
    >
      <Stack.Screen name="AdminOrdersList" component={AdminOrdersScreen} options={{ title: 'Manage Orders' }} />
      <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} options={{ title: 'Order Details' }} />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'grid';
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Users" component={AdminUsersScreen} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;