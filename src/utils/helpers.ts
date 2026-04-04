export const formatPrice = (price: number): string => {
  return `₱${price.toFixed(2)}`;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateOrderNumber = (): string => {
  return `SB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+63|0)[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ----- Phone formatting helpers -----
export const formatPhoneNumber = (text: string): string => {
  // Remove all non-digit characters
  let digits = text.replace(/\D/g, '');
  // If the number starts with '63', keep it; otherwise assume it's the local part
  if (digits.startsWith('63')) {
    digits = digits.slice(2);
  }
  // Limit to 10 digits
  if (digits.length > 10) digits = digits.slice(0, 10);
  return `+63${digits}`;
};

export const stripPhonePrefix = (phone: string): string => {
  return phone.replace('+63', '');
};