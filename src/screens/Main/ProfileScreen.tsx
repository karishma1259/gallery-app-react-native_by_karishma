import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { InputField } from '@/components/InputField';
import { Dropdown } from '@/components/Dropdown';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { PublicUser } from '@/types/auth';
import { validateEmail, validateMobile } from '@/utils/validation';
import { useThemeStore } from '@/store/useThemeStore';

const CITIES = ['Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata'];

export const ProfileScreen: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PublicUser | null>(user);
  const [saving, setSaving] = useState(false);

  const { mode, colors, isHydrated, loadTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (!isHydrated) loadTheme();
  }, [isHydrated, loadTheme]);

  if (!user || !draft) return null;

  const setField = <K extends keyof PublicUser>(key: K, value: PublicUser[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!validateEmail(draft.email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (!validateMobile(draft.mobile)) {
      Alert.alert('Invalid mobile', 'Mobile number must be exactly 10 digits.');
      return;
    }

    setSaving(true);
    await updateProfile(draft);
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(user);
    setIsEditing(false);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitial}>{user.fullName.charAt(0).toUpperCase()}</Text>
      </View>

      <InputField
        label="Full Name"
        value={draft.fullName}
        onChangeText={(t) => setField('fullName', t)}
        editable={isEditing}
      />
      <InputField
        label="Email Address"
        value={draft.email}
        onChangeText={(t) => setField('email', t)}
        editable={isEditing}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <InputField
        label="Mobile Number"
        value={draft.mobile}
        onChangeText={(t) => setField('mobile', t.replace(/[^0-9]/g, ''))}
        editable={isEditing}
        keyboardType="number-pad"
        maxLength={10}
      />
      <InputField label="Gender" value={draft.gender} editable={false} />
      <InputField
        label="Address"
        value={draft.address}
        onChangeText={(t) => setField('address', t)}
        editable={isEditing}
        multiline
      />

      {isEditing ? (
        <Dropdown
          label="City"
          selectedValue={draft.city}
          onValueChange={(v) => setField('city', v)}
          options={CITIES}
        />
      ) : (
        <InputField label="City" value={draft.city} editable={false} />
      )}

      {isEditing ? (
        <View style={styles.editActions}>
          <Button label="Save" onPress={handleSave} loading={saving} style={styles.flexButton} />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={handleCancel}
            style={styles.flexButton}
          />
        </View>
      ) : (
        <Button label="Edit Profile" onPress={() => setIsEditing(true)} style={styles.marginTop} />
      )}

      <View style={[styles.themeRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.themeLabel, { color: colors.text }]}>Dark Mode</Text>
          <Text style={[styles.themeSubLabel, { color: colors.textSecondary }]}>
            {mode === 'dark' ? 'Currently on' : 'Currently off'}
          </Text>
        </View>
        <Switch
          value={mode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#D1D5DB', true: colors.primary }}
          thumbColor="#fff"
        />
      </View>

      <Button label="Logout" variant="danger" onPress={logout} style={styles.logoutButton} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatarInitial: { color: '#fff', fontSize: 32, fontWeight: '700' },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  flexButton: { flex: 1 },
  marginTop: { marginTop: 10 },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  themeLabel: { fontSize: 15, fontWeight: '600' },
  themeSubLabel: { fontSize: 12, marginTop: 2 },
  logoutButton: { marginTop: 20 },
});