export const validation = {
  email: (email: string): { isValid: boolean; error?: string } => {
    if (!email) return { isValid: false, error: 'Email is required' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { isValid: false, error: 'Invalid email format' };
    return { isValid: true };
  },

  password: (password: string): { isValid: boolean; error?: string } => {
    if (!password) return { isValid: false, error: 'Password is required' };
    if (password.length < 6) return { isValid: false, error: 'Password must be at least 6 characters' };
    return { isValid: true };
  },

  confirmPassword: (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
    if (password !== confirmPassword) return { isValid: false, error: 'Passwords do not match' };
    return { isValid: true };
  },

  name: (name: string, field: string): { isValid: boolean; error?: string } => {
    if (!name) return { isValid: false, error: `${field} is required` };
    if (name.length < 2) return { isValid: false, error: `${field} must be at least 2 characters` };
    return { isValid: true };
  },

  phone: (phone: string): { isValid: boolean; error?: string } => {
    if (!phone) return { isValid: false, error: 'Phone number is required' };
    const phoneRegex = /^(\+63|0)[0-9]{10}$/;
    if (!phoneRegex.test(phone)) return { isValid: false, error: 'Invalid phone number format' };
    return { isValid: true };
  },

  address: (address: string): { isValid: boolean; error?: string } => {
    if (!address) return { isValid: false, error: 'Address is required' };
    if (address.length < 5) return { isValid: false, error: 'Address must be at least 5 characters' };
    return { isValid: true };
  },

  zipCode: (zipCode: string): { isValid: boolean; error?: string } => {
    if (!zipCode) return { isValid: false, error: 'ZIP code is required' };
    if (!/^\d{4}$/.test(zipCode)) return { isValid: false, error: 'ZIP code must be 4 digits' };
    return { isValid: true };
  },
};