import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Destination = {
  id: string;
  name: string;
  country: string;
  basePrice: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (destination: Destination) => void;
  destinations: Destination[];
};

export default function DestinationModal({ visible, onClose, onSelect, destinations }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona tu destino</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#2e4566" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={destinations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.destinationItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <View>
                  <Text style={styles.destinationName}>{item.name}</Text>
                  <Text style={styles.destinationCountry}>{item.country}</Text>
                </View>
                <Text style={styles.destinationPrice}>${item.basePrice}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e4566',
  },
  destinationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '500',
  },
  destinationCountry: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  destinationPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e4566',
  },
});