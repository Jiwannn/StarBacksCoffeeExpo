import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(getAuth(), email);
      Alert.alert('Success', 'Password reset email sent. Check your inbox.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email and we'll send you a reset link
          </Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
          />

          <Button
            title={loading ? 'Sending...' : 'Send Reset Email'}
            onPress={handleReset}
            loading={loading}
            style={styles.button}
          />

          <Button
            title="Back to Login"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center' },
  formContainer: { borderRadius: 20, padding: 20 },
  button: { marginBottom: 12 },
});
