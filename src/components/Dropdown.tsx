import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DropdownProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.pickerWrapper, error ? styles.pickerError : null]}>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          <Picker.Item label={`Select ${label}`} value="" />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  pickerError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
});
