import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  value: string;
  onPress?: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  editable?: boolean;
  placeholder?: string;
};

export const InputField = ({ label, value, onPress, icon, editable = true, placeholder }: Props) => {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Container style={styles.inputContainer} onPress={onPress} disabled={!editable}>
        <Ionicons name={icon} size={20} color="#2e4566" />
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || placeholder || `Selecciona ${label.toLowerCase()}`}
        </Text>
        {onPress && <Ionicons name="chevron-down" size={20} color="#666" />}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
});