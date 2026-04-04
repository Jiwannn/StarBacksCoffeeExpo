import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  if (isAdmin) {
    return <AdminNavigator />;
  }

  return <UserNavigator />;
};

export default AppNavigator;