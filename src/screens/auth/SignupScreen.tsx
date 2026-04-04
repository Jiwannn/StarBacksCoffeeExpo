import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { validation } from '../../utils/validation';
import { formatPhoneNumber } from '../../utils/helpers';

const SignupScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+63',  // start with +63 prefix
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const { colors } = useTheme();

  const handlePhoneChange = (text: string) => {
    setFormData({ ...formData, phone: formatPhoneNumber(text) });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const firstNameValidation = validation.name(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) newErrors.firstName = firstNameValidation.error || '';
    
    const lastNameValidation = validation.name(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) newErrors.lastName = lastNameValidation.error || '';
    
    const emailValidation = validation.email(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.error || '';
    
    const phoneValidation = validation.phone(formData.phone);
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error || '';
    
    const passwordValidation = validation.password(formData.password);
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.error || '';
    
    const confirmValidation = validation.confirmPassword(formData.password, formData.confirmPassword);
    if (!confirmValidation.isValid) newErrors.confirmPassword = confirmValidation.error || '';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const success = await signup(formData);
    setLoading(false);

    if (!success) {
      Alert.alert('Error', 'Failed to create account. Email may already be in use.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join StarBacks Coffee family
          </Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
          <Input
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            error={errors.firstName}
            placeholder="Enter your first name"
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            error={errors.lastName}
            placeholder="Enter your last name"
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            placeholder="Enter your email"
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            error={errors.phone}
            placeholder="9123456789"
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            error={errors.password}
            placeholder="Create a password"
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            error={errors.confirmPassword}
            placeholder="Confirm your password"
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            style={styles.signupButton}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <Button
            title="Already have an account? Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 100, height: 100, borderRadius: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { fontSize: 14, marginTop: 8 },
  formContainer: { borderRadius: 20, padding: 20 },
  signupButton: { marginTop: 10, marginBottom: 20 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { paddingHorizontal: 10, fontSize: 14 },
});

export default SignupScreen;