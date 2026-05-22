import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { validation } from '../../utils/validation';
import { formatPhoneNumber } from '../../utils/helpers';

const CheckoutScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '+63',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { getGrandTotal } = useCart();

  const handlePhoneChange = (text: string) => {
    setFormData({ ...formData, phone: formatPhoneNumber(text) });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const firstNameValidation = validation.name(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) newErrors.firstName = firstNameValidation.error || '';
    
    const lastNameValidation = validation.name(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) newErrors.lastName = lastNameValidation.error || '';
    
    const addressValidation = validation.address(formData.address);
    if (!addressValidation.isValid) newErrors.address = addressValidation.error || '';
    
    const cityValidation = validation.name(formData.city, 'City');
    if (!cityValidation.isValid) newErrors.city = cityValidation.error || '';
    
    const zipValidation = validation.zipCode(formData.zipCode);
    if (!zipValidation.isValid) newErrors.zipCode = zipValidation.error || '';
    
    const phoneValidation = validation.phone(formData.phone);
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error || '';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      navigation.navigate('Payment', { shippingAddress: formData });
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Contact Information</Text>
        
        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          error={errors.phone}
          placeholder="9123456789"
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Shipping Address</Text>
        
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              error={errors.firstName}
              placeholder="John"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              error={errors.lastName}
              placeholder="Doe"
            />
          </View>
        </View>
        
        <Input
          label="Street Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          error={errors.address}
          placeholder="123 Coffee Street"
        />
        
        <Input
          label="City"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          error={errors.city}
          placeholder="Davao City"
        />
        
        <Input
          label="ZIP Code"
          value={formData.zipCode}
          onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
          keyboardType="numeric"
          error={errors.zipCode}
          placeholder="8000"
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount:</Text>
        <Text style={[styles.totalAmount, { color: colors.primary }]}>
          ₱{getGrandTotal().toFixed(2)}
        </Text>
      </View>

      <Button
        title="Continue to Payment"
        onPress={handleContinue}
        loading={loading}
        style={styles.continueButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: '600' },
  totalAmount: { fontSize: 24, fontWeight: 'bold' },
  continueButton: { marginBottom: 30 },
});

export default CheckoutScreen;