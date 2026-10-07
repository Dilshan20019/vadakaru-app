import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { InputField } from '../components/InputField';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const { register, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      errors.name = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      Alert.alert('Terms & Conditions', 'Please accept the terms and conditions to proceed.');
      return false;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;

    const result = await register(name, email, password);
    if (!result.success && result.message) {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onNavigateToLogin}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#334155" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Brand / Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started with Vadakaru</Text>
        </View>

        {/* Global Error Banner */}
        {!!error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Form Fields */}
        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="e.g. Dilshan Perera"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (validationErrors.name) setValidationErrors({ ...validationErrors, name: undefined });
            }}
            iconName="person-outline"
            error={validationErrors.name}
          />

          <InputField
            label="Email Address"
            placeholder="e.g. user@vadakaru.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
            }}
            keyboardType="email-address"
            iconName="mail-outline"
            error={validationErrors.email}
          />

          <InputField
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
            }}
            isPassword
            iconName="lock-closed-outline"
            error={validationErrors.password}
          />

          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (validationErrors.confirmPassword) {
                setValidationErrors({ ...validationErrors, confirmPassword: undefined });
              }
            }}
            isPassword
            iconName="shield-checkmark-outline"
            error={validationErrors.confirmPassword}
          />

          {/* Terms Agreement */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreeTerms(!agreeTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
              {agreeTerms && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.registerButtonText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 2,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  form: {
    marginBottom: 24,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  termsText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },
  termsHighlight: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#4F46E5',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
