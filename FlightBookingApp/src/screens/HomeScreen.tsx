import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useContext, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ReservationContext } from "../context/ReservationContext";

// Hooks
import { useFlightSearch } from "../hooks/useFlightSearch";
import { usePassengers } from "../hooks/usePassengers";
import { useModals } from "../hooks/useModals";

// Componentes
import CustomButton from "../components/CustomButton";
import { FlightTypeSelector } from "../components/FlightTypeSelector";
import { InputField } from "../components/InputField";
import PassengerSelector from "../components/PassengerSelector";
import DestinationModal from "./DestinationModal";
import ConfirmationModal from "./ConfirmationModal";
import OriginModal from "./OriginModal";

// Datos
const flightData = require("../data/flights.json") as any;

export default function HomeScreen() {
  const [selectedOrigin, setSelectedOrigin] = useState(flightData.origins[0]);
  const [showOriginModal, setShowOriginModal] = useState(false);

  const originLabel = `${selectedOrigin.name} (${selectedOrigin.code})`;

  const { addReservation } = useContext(ReservationContext);

  const flightSearch = useFlightSearch();
  const passengers = usePassengers();
  const modals = useModals();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  const validatePassengers = () => {
  const { adults, children, infants } = passengers.passengers;
  const total = adults + children + infants;

  if (total === 0) {
    Alert.alert("Pasajeros requeridos", "Debes seleccionar al menos un pasajero.");
    return false;
  }

  if (adults < 1) {
    Alert.alert(
      "Adulto requerido",
      "Debe haber al menos un adulto en la reserva."
    );
    return false;
  }

  return true;
};


 const handleSearch = () => {
  if (!validatePassengers()) return;

  if (flightSearch.handleSearch(flightSearch.selectedDestination)) {
    modals.setShowConfirmationModal(true);
  }
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeTitle}>Encuentra tu vuelo</Text>

      <FlightTypeSelector
        flightType={flightSearch.flightType}
        onSelect={flightSearch.setFlightType}
      />

      <InputField
        label="Origen"
        value={originLabel}
        onPress={() => setShowOriginModal(true)}
        icon="airplane-outline"
      />

      <OriginModal
        visible={showOriginModal}
        onClose={() => setShowOriginModal(false)}
        onSelect={setSelectedOrigin}
        origins={flightData.origins}
      />

      <InputField
        label="Destino"
        value={flightSearch.selectedDestination?.name ?? ""}
        onPress={() => modals.setShowDestinationModal(true)}
        icon="search-outline"
        placeholder="Selecciona un destino"
      />

      <InputField
        label="Salida"
        value={formatDate(flightSearch.departDate)}
        onPress={() => modals.setShowDepartPicker(true)}
        icon="calendar-outline"
      />

      {flightSearch.flightType === "roundtrip" && (
        <InputField
          label="Regreso"
          value={formatDate(flightSearch.returnDate)}
          onPress={() => modals.setShowReturnPicker(true)}
          icon="calendar-outline"
        />
      )}

      <InputField
        label="Pasajeros"
        value={passengers.getPassengerText()}
        onPress={() => modals.setShowPassengerModal(true)}
        icon="people-outline"
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Buscar vuelo"
          onClick={handleSearch}
          variant="primary"
        />
      </View>

      <DestinationModal
        visible={modals.showDestinationModal}
        onClose={() => modals.setShowDestinationModal(false)}
        onSelect={flightSearch.setSelectedDestination}
        destinations={flightData.destinations}
      />

      <PassengerSelector
        visible={modals.showPassengerModal}
        onClose={() => modals.setShowPassengerModal(false)}
        onConfirm={passengers.setPassengers}
        initialValues={passengers.passengers}
      />

      {flightSearch.selectedDestination && (
        <ConfirmationModal
          visible={modals.showConfirmationModal}
          onClose={() => modals.setShowConfirmationModal(false)}
          onConfirm={() => {
            const destination = flightSearch.selectedDestination!;

            addReservation({
              origin: originLabel,
              destination: destination.id,
              destinationName: destination.name,
              departDate: formatDate(flightSearch.departDate),
              returnDate:
                flightSearch.flightType === "roundtrip"
                  ? formatDate(flightSearch.returnDate)
                  : undefined,
              passengers: passengers.passengers,
              totalPrice: passengers.calculateTotalPrice(destination.basePrice),
            });

            modals.setShowConfirmationModal(false);
            Alert.alert("¡Éxito!", "Vuelo reservado correctamente");
          }}
          flightDetails={{
            origin: originLabel,
            destination: flightSearch.selectedDestination!.id,
            destinationName: flightSearch.selectedDestination!.name,
            departDate: formatDate(flightSearch.departDate),
            returnDate:
              flightSearch.flightType === "roundtrip"
                ? formatDate(flightSearch.returnDate)
                : undefined,
            passengers: passengers.passengers,
            totalPrice: passengers.calculateTotalPrice(
              flightSearch.selectedDestination!.basePrice
            ),
          }}
        />
      )}

      {modals.showDepartPicker && (
        <DateTimePicker
          value={flightSearch.departDate}
          mode="date"
          minimumDate={flightSearch.today}
          onChange={(event: any, selectedDate?: Date) => {
            modals.setShowDepartPicker(false);
            if (selectedDate) {
              flightSearch.setDepartDate(selectedDate);
            }
          }}
        />
      )}

      {modals.showReturnPicker && (
        <DateTimePicker
          value={flightSearch.returnDate}
          mode="date"
          minimumDate={flightSearch.departDate}
          onChange={(event: any, selectedDate?: Date) => {
            modals.setShowReturnPicker(false);
            if (selectedDate) {
              flightSearch.setReturnDate(selectedDate);
            }
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f0fa",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e4566',
    marginBottom: 30,
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
});