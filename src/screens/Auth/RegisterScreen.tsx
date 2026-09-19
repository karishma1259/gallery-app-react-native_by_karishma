import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import { InputField } from '@/components/InputField';
import { Dropdown } from '@/components/Dropdown';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateRegisterForm, isFormValid } from '@/utils/validation';
import { RegisterErrors, RegisterFormValues, Gender } from '@/types/auth';
import { AuthStackParamList } from '@/types/navigation';

type Props = StackScreenProps<AuthStackParamList, 'Register'>;

const CITIES = ['Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

const initialValues: RegisterFormValues = {
  fullName: '',
  email: '',
  gender: 'Male',
  mobile: '',
  address: '',
  city: '',
  password: '',
  confirmPassword: '',
};

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  const setField = <K extends keyof RegisterFormValues>(key: K, value: RegisterFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateRegisterForm(values);
    setErrors(validationErrors);
    if (!isFormValid(validationErrors)) return;

    setSubmitting(true);
    const result = await register(values);
    setSubmitting(false);

    if (!result.success) {
      Alert.alert('Registration failed', result.message ?? 'Please try again.');
      return;
    }

    Alert.alert('Success', 'Account created. Please log in.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#3B82F6', '#6366F1', '#8B5CF6']} style={styles.header}>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Join GalleryApp in a few steps</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <InputField
          label="Full Name"
          value={values.fullName}
          onChangeText={(t) => setField('fullName', t)}
          error={errors.fullName}
          placeholder="Jane Doe"
        />
        <InputField
          label="Email Address"
          value={values.email}
          onChangeText={(t) => setField('email', t)}
          error={errors.email}
          placeholder="jane@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g}
              style={styles.radioOption}
              onPress={() => setField('gender', g)}
            >
              <View style={styles.radioOuter}>
                {values.gender === g && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

        <InputField
          label="Mobile Number"
          value={values.mobile}
          onChangeText={(t) => setField('mobile', t.replace(/[^0-9]/g, ''))}
          error={errors.mobile}
          placeholder="9876543210"
          keyboardType="number-pad"
          maxLength={10}
        />
        <InputField
          label="Address"
          value={values.address}
          onChangeText={(t) => setField('address', t)}
          error={errors.address}
          placeholder="123 Main Street"
          multiline
        />
        <Dropdown
          label="City"
          selectedValue={values.city}
          onValueChange={(v) => setField('city', v)}
          options={CITIES}
          error={errors.city}
        />
        <InputField
          label="Password"
          value={values.password}
          onChangeText={(t) => setField('password', t)}
          error={errors.password}
          placeholder="At least 6 characters"
          secureTextEntry
        />
        <InputField
          label="Confirm Password"
          value={values.confirmPassword}
          onChangeText={(t) => setField('confirmPassword', t)}
          error={errors.confirmPassword}
          placeholder="Re-enter password"
          secureTextEntry
        />

        <Button label="Register" onPress={handleSubmit} loading={submitting} style={styles.button} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.footerLink1}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  radioRow: { flexDirection: 'row', marginBottom: 4 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' },
  radioLabel: { fontSize: 14, color: '#111827' },
  errorText: { color: '#EF4444', fontSize: 12, marginBottom: 10 },
  button: { marginTop: 10 },
  footerLink: { marginTop: 20, alignItems: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink1: { color: '#3B82F6', fontWeight: '600' },
});