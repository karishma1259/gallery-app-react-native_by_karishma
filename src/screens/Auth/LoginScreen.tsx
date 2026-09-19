import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateLoginForm, isFormValid } from '@/utils/validation';
import { LoginErrors, LoginFormValues } from '@/types/auth';
import { AuthStackParamList } from '@/types/navigation';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    const validationErrors = validateLoginForm(values);
    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result = await login(values);
    setSubmitting(false);

    if (!result.success) {
      setErrors({ form: result.message });
      return;
    }
    // Navigation to Main flow happens automatically via RootNavigator
    // reacting to isAuthenticated becoming true.
  };

  return (
    <LinearGradient colors={['#3B82F6', '#6366F1', '#8B5CF6']} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>📷</Text>
          </View>
          <Text style={styles.brandTitle}>GalleryApp</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue</Text>

        <InputField
          label="Email Address"
          value={values.email}
          onChangeText={(t) => setValues((p) => ({ ...p, email: t }))}
          error={errors.email}
          placeholder="jane@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <InputField
          label="Password"
          value={values.password}
          onChangeText={(t) => setValues((p) => ({ ...p, password: t }))}
          error={errors.password}
          placeholder="Your password"
          secureTextEntry
        />

        {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

        <Button label="Log In" onPress={handleSubmit} loading={submitting} style={styles.button} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.footerLink1}>Register</Text>
          </Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  brandBlock: { alignItems: 'center', marginTop: 36, marginBottom: 6 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoText: { fontSize: 30 },
  brandTitle: { color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },
  content: {
    flex: 1,
    padding: 24,
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4, marginTop: 12 },
  subtitle: { fontSize: 15, color: '#6B7280', marginBottom: 28 },
  formError: { color: '#EF4444', fontSize: 13, marginBottom: 10, textAlign: 'center' },
  button: { marginTop: 8 },
  footerLink: { marginTop: 20, alignItems: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink1: { color: '#3B82F6', fontWeight: '600' },
});