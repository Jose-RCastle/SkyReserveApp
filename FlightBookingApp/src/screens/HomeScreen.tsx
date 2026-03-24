import { View, Text, ScrollView, Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
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
import { supabase } from "../lib/supabase";
import i18n from "../i18n";


const flightData = require("../data/flights.json") as any;

type OfferCard = {
  id: string;
  name: string;
  country: string;
  basePrice: number;
  image: string;
};

const offerImages = [
  "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/07/b1/fb/10.jpg",
  "https://www.kevmrc.com/wp-content/uploads/2021/07/19-famous-landmarks-in-madrid-spain.jpg",
  "https://tse2.mm.bing.net/th/id/OIP.b4IpjqLjqsKk3F-M3XK57AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://eventsandsports.com/wp-content/uploads/2023/11/BOGOTA-3.jpg",
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
      Alert.alert(
        i18n.t("requiredPassengers"),
        i18n.t("selectAtLeastOnePassenger")
      );
      return false;
    }

    if (adults < 1) {
      Alert.alert(
        i18n.t("requiredAdult"),
        i18n.t("atLeastOneAdult")
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

  const handleOfferPress = (offer: OfferCard) => {
    flightSearch.setSelectedDestination(offer);
    Alert.alert(
      i18n.t("destinationSelected"),
      `${offer.name} ${i18n.t("destinationAddedToForm")}`
    );
  };

  const handleConfirmReservation = async () => {
    try {
      const destination = flightSearch.selectedDestination;

      if (!destination) {
        Alert.alert(
          i18n.t("destinationRequired"),
          i18n.t("selectDestinationBeforeBooking")
        );
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        Alert.alert(i18n.t("sessionError"), userError.message);
        return;
      }

      if (!user) {
        Alert.alert(
          i18n.t("sessionNotFound"),
          i18n.t("mustLoginToBook")
        );
        return;
      }

      const reservationData = {
        user_email: user.email ?? "",
        origin: originLabel,
        destination: destination.id,
        destination_name: destination.name,
        depart_date: formatDate(flightSearch.departDate),
        return_date:
          flightSearch.flightType === "roundtrip"
            ? formatDate(flightSearch.returnDate)
            : null,
        adults: passengers.passengers.adults,
        children: passengers.passengers.children,
        infants: passengers.passengers.infants,
        total_price: passengers.calculateTotalPrice(destination.basePrice),
        reservation_date: new Date().toLocaleDateString("es-ES"),
      };

      const { error: insertError } = await supabase
        .from("reservations")
        .insert(reservationData);

      if (insertError) {
        Alert.alert(i18n.t("saveError"), insertError.message);
        return;
      }

      dispatch(
        addReservation({
          id: Date.now().toString(),
          origin: originLabel,
          destination: destination.id,
          destinationName: destination.name,
          departDate: reservationData.depart_date,
          returnDate: reservationData.return_date ?? undefined,
          passengers: passengers.passengers,
          totalPrice: reservationData.total_price,
          reservationDate: reservationData.reservation_date,
        })
      );

      modals.setShowConfirmationModal(false);
      Alert.alert(i18n.t("success"), i18n.t("flightBookedSuccessfully"));
    } catch (error: any) {
      Alert.alert(
        i18n.t("unexpectedError"),
        error?.message || i18n.t("reservationCouldNotBeCompleted")
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{i18n.t("homeHeroTitle")}</Text>
      </View>

      <View style={styles.searchCard}>
        <FlightTypeSelector
          flightType={flightSearch.flightType}
          onSelect={flightSearch.setFlightType}
        />

        <InputField
          label={i18n.t("origin")}
          value={originLabel}
          onPress={() => setShowOriginModal(true)}
          icon="airplane-outline"
        />

        <InputField
          label={i18n.t("destination")}
          value={flightSearch.selectedDestination?.name ?? ""}
          onPress={() => modals.setShowDestinationModal(true)}
          icon="search-outline"
          placeholder={i18n.t("selectDestination")}
        />

        <InputField
          label={i18n.t("departure")}
          value={formatDate(flightSearch.departDate)}
          onPress={() => modals.setShowDepartPicker(true)}
          icon="calendar-outline"
        />

        {flightSearch.flightType === "roundtrip" && (
          <InputField
            label={i18n.t("return")}
            value={formatDate(flightSearch.returnDate)}
            onPress={() => modals.setShowReturnPicker(true)}
            icon="calendar-outline"
          />
        )}

        <InputField
          label={i18n.t("passengers")}
          value={passengers.getPassengerText()}
          onPress={() => modals.setShowPassengerModal(true)}
          icon="people-outline"
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title={i18n.t("search")}
            onClick={handleSearch}
            variant="primary"
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{i18n.t("dailyOffers")}</Text>
        <Text style={styles.sectionSubtitle}>{i18n.t("dailyInspiration")}</Text>
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
              <Text style={styles.offerOrigin}>
                {i18n.t("departureFrom")} {selectedOrigin.name} ({selectedOrigin.code})
              </Text>
            </View>
            <Text style={styles.offerPrice}>
              {i18n.t("roundTripPriceFrom")} ${offer.basePrice}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>{i18n.t("travelYourWay")}</Text>
        <Text style={styles.featuresSubtitle}>
          {i18n.t("travelYourWaySubtitle")}
        </Text>

        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Ionicons name="pricetag-outline" size={28} color="#1f6ed4" />
            <Text style={styles.featureHeading}>{i18n.t("bestPrice")}</Text>
            <Text style={styles.featureText}>
              {i18n.t("bestPriceDescription")}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="location-outline" size={28} color="#1f6ed4" />
            <Text style={styles.featureHeading}>{i18n.t("inspiringDestinations")}</Text>
            <Text style={styles.featureText}>
              {i18n.t("inspiringDestinationsDescription")}
            </Text>
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
          onConfirm={handleConfirmReservation}
          flightDetails={{
            origin: originLabel,
            destination: flightSearch.selectedDestination.id,
            destinationName: flightSearch.selectedDestination.name,
            departDate: formatDate(flightSearch.departDate),
            returnDate:
              flightSearch.flightType === "roundtrip"
                ? formatDate(flightSearch.returnDate)
                : undefined,
            passengers: passengers.passengers,
            totalPrice: passengers.calculateTotalPrice(flightSearch.selectedDestination.basePrice),
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
    paddingTop: 41,
    paddingBottom: 92,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: {
    marginTop: 17,
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
  },
  searchCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: -69,
    borderRadius: 28,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
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