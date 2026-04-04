import { useAuth } from '../context/AuthContext';

export const useAuthHook = () => {
  const { user, isLoading, login, signup, logout, isAdmin, updateUser } = useAuth();
  
  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAdmin,
    updateUser,
    isAuthenticated: !!user,
  };
};