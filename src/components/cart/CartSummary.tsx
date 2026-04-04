import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../src/context/ThemeContext';
import { formatPrice } from '../../../src/utils/helpers';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  deliveryFee,
  total,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Subtotal</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Tax (12%)</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatPrice(tax)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Delivery Fee</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatPrice(deliveryFee)}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: colors.primary }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});