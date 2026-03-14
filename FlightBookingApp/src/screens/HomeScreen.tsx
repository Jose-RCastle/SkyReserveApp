import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { useFlightSearch } from "../hooks/useFlightSearch";
import { usePassengers } from "../hooks/usePassengers";
import { useModals } from "../hooks/useModals";

import CustomButton from "../components/CustomButton";
import { FlightTypeSelector } from "../components/FlightTypeSelector";
import { InputField } from "../components/InputField";
import PassengerSelector from "../components/PassengerSelector";
import DestinationModal from "./DestinationModal";
import ConfirmationModal from "./ConfirmationModal";
import OriginModal from "./OriginModal";

import { useAppDispatch } from "../redux/hooks";
import { addReservation } from "../redux/slices/reservationSlice";

const flightData = require("../data/flights.json") as any;

type OfferCard = {
  id: string;
  name: string;
  country: string;
  basePrice: number;
  image: string;
};

const offerImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
];

export default function HomeScreen() {
  const [selectedOrigin, setSelectedOrigin] = useState(flightData.origins[0]);
  const [showOriginModal, setShowOriginModal] = useState(false);

  const originLabel = `${selectedOrigin.name} (${selectedOrigin.code})`;

  const dispatch = useAppDispatch();
  const flightSearch = useFlightSearch();
  const passengers = usePassengers();
  const modals = useModals();

  const offers: OfferCard[] = flightData.destinations.slice(0, 4).map((item: any, index: number) => ({
    ...item,
    image: offerImages[index % offerImages.length],
  }));

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
      Alert.alert("Adulto requerido", "Debe haber al menos un adulto en la reserva.");
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

  const handleOfferPress = (offer: OfferCard) => {
    flightSearch.setSelectedDestination(offer);
    Alert.alert("Destino seleccionado", `${offer.name} fue agregado al formulario.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Encuentra con AppReserve</Text>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.productTabs}>
          <View style={[styles.productTab, styles.productTabActive]}>
            <Ionicons name="airplane" size={20} color="#ffffff" />
            <Text style={styles.productTabActiveText}>Vuelos</Text>
          </View>
          <View style={styles.productTab}>
            <Ionicons name="bed-outline" size={20} color="#1f6ed4" />
            <Text style={styles.productTabText}>Hoteles</Text>
          </View>
        </View>

        <FlightTypeSelector flightType={flightSearch.flightType} onSelect={flightSearch.setFlightType} />

        <InputField
          label="Origen"
          value={originLabel}
          onPress={() => setShowOriginModal(true)}
          icon="airplane-outline"
        />

        <InputField
          label="Destino"
          value={flightSearch.selectedDestination?.name ?? ""}
          onPress={() => modals.setShowDestinationModal(true)}
          icon="search-outline"
          placeholder="Selecciona el destino"
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
          <CustomButton title="Buscar" onClick={handleSearch} variant="primary" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ofertas del día</Text>
        <Text style={styles.sectionSubtitle}>Nueva inspiración diaria. ¡Atrápala!</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersRow}>
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            style={styles.offerCard}
            activeOpacity={0.9}
            onPress={() => handleOfferPress(offer)}
          >
            <Image source={{ uri: offer.image }} style={styles.offerImage} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{offer.country.toUpperCase()}</Text>
            </View>
            <View style={styles.offerOverlay}>
              <Text style={styles.offerTitle}>{offer.name}</Text>
              <Text style={styles.offerOrigin}>Salida desde {selectedOrigin.name} ({selectedOrigin.code})</Text>
            </View>
            <Text style={styles.offerPrice}>Precio de vuelta desde ${offer.basePrice}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Viaja a tu manera</Text>
        <Text style={styles.featuresSubtitle}>
          Escapadas, vacaciones y vuelos al mejor precio en un solo lugar.
        </Text>

        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Ionicons name="pricetag-outline" size={28} color="#1f6ed4" />
            <Text style={styles.featureHeading}>Mejor precio</Text>
            <Text style={styles.featureText}>Opciones cómodas para que reserves sin complicarte.</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="location-outline" size={28} color="#1f6ed4" />
            <Text style={styles.featureHeading}>Destinos inspiradores</Text>
            <Text style={styles.featureText}>Explora lugares disponibles saliendo desde tu origen favorito.</Text>
          </View>
        </View>
      </View>

      <OriginModal
        visible={showOriginModal}
        onClose={() => setShowOriginModal(false)}
        onSelect={setSelectedOrigin}
        origins={flightData.origins}
      />

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

            dispatch(
              addReservation({
                id: Date.now().toString(),
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
                reservationDate: new Date().toLocaleDateString("es-ES"),
              })
            );

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
            totalPrice: passengers.calculateTotalPrice(flightSearch.selectedDestination!.basePrice),
          }}
        />
      )}

      {modals.showDepartPicker && (
        <DateTimePicker
          value={flightSearch.departDate}
          mode="date"
          minimumDate={flightSearch.today}
          onChange={(_event: any, selectedDate?: Date) => {
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
          onChange={(_event: any, selectedDate?: Date) => {
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
    backgroundColor: "#f6f7fb",
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: "#1f6ed4",
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 92,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
  },
  searchCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: -58,
    borderRadius: 28,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  productTabs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  productTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cfe0f8",
    backgroundColor: "#fff",
  },
  productTabActive: {
    backgroundColor: "#1f6ed4",
    borderColor: "#1f6ed4",
  },
  productTabText: {
    color: "#1f6ed4",
    fontSize: 16,
    fontWeight: "700",
  },
  productTabActiveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonContainer: {
    marginTop: 6,
  },
  sectionHeader: {
    marginTop: 26,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#636b78",
  },
  offersRow: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  offerCard: {
    width: 290,
    marginRight: 14,
  },
  offerImage: {
    width: "100%",
    height: 180,
    borderRadius: 24,
  },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4b5563",
  },
  offerOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 56,
  },
  offerTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },
  offerOrigin: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  offerPrice: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "600",
    color: "#2e3440",
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginTop: 34,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  featuresSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#636b78",
    marginBottom: 18,
  },
  featuresGrid: {
    flexDirection: "row",
    gap: 16,
  },
  featureItem: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
  },
  featureHeading: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2533",
  },
  featureText: {
    color: "#636b78",
    fontSize: 15,
    lineHeight: 22,
  },
});
