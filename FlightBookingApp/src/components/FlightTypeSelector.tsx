import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  flightType: 'roundtrip' | 'oneway';
  onSelect: (type: 'roundtrip' | 'oneway') => void;
};

export const FlightTypeSelector = ({ flightType, onSelect }: Props) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.button, flightType === 'roundtrip' && styles.active]}
      onPress={() => onSelect('roundtrip')}
    >
      <Text style={[styles.text, flightType === 'roundtrip' && styles.textActive]}>
        Ida y vuelta
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, flightType === 'oneway' && styles.active]}
      onPress={() => onSelect('oneway')}
    >
      <Text style={[styles.text, flightType === 'oneway' && styles.textActive]}>
        Sencillo
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  active: {
    backgroundColor: '#2e4566',
  },
  text: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  textActive: {
    color: 'white',
  },
});