import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { searchFlightsByRoute } from "../services/flightSearchService";
import {
  addReservation,
  DemoReservation,
  getReservationsArray,
} from "../services/reservationStructureService";
import { findRouteBFS } from "../services/routeService";
import {
  addReservationToLookup,
  findReservationByCode as findReservationInLookup,
  getLookupEntries,
  hasReservationCode,
} from "../services/lookupService";
import {
  getFullFlightsForWaitlistDemos,
  getNext,
  getWaitlistArray,
  joinWaitlist,
  processNext,
} from "../services/waitlistService";
import {
  getHistoryArray,
  peekLastAction,
  pushAction,
  undoLastAction,
} from "../services/historyService";

export default function DataStructuresDemoScreen() {
  const routeResult = useMemo(() => findRouteBFS("SAP", "MAD"), []);
  const flightResult = useMemo(() => searchFlightsByRoute("SAP", "MIA"), []);
  const fullFlights = useMemo(() => getFullFlightsForWaitlistDemos(), []);

  const [reservations, setReservations] = useState<DemoReservation[]>(() =>
    getReservationsArray()
  );
  const [selectedReservation, setSelectedReservation] = useState<DemoReservation | null>(
    null
  );
  const [lookupCode, setLookupCode] = useState<string>("");
  const [lookupFound, setLookupFound] = useState<DemoReservation | null>(null);
  const [waitlistItems, setWaitlistItems] = useState(() => getWaitlistArray());
  const [nextWaitlistItem, setNextWaitlistItem] = useState(() => getNext());
  const [historyItems, setHistoryItems] = useState(() => getHistoryArray());
  const [lastAction, setLastAction] = useState(() => peekLastAction());

  const refreshReservations = () => {
    setReservations(getReservationsArray());
  };

  const refreshWaitlist = () => {
    setWaitlistItems(getWaitlistArray());
    setNextWaitlistItem(getNext());
  };

  const refreshHistory = () => {
    setHistoryItems(getHistoryArray());
    setLastAction(peekLastAction());
  };

  const handleCreateDemoReservation = () => {
    const reservation = addReservation({
      origin: "SAP",
      destination: "MIA",
      flightId: "SR-SAP-MIA-001",
      passengerName: "Pasajero Demo",
      totalPrice: 320,
    });

    if (!reservation) return;

    addReservationToLookup(reservation);
    pushAction({
      type: "CREATE_RESERVATION",
      description: `Reserva demo creada: ${reservation.code}`,
      payload: reservation,
    });

    setSelectedReservation(reservation);
    setLookupCode(reservation.code);
    setLookupFound(findReservationInLookup(reservation.code));
    refreshReservations();
    refreshHistory();
  };

  const handleFindReservationInLookup = () => {
    if (!lookupCode) {
      setLookupFound(null);
      return;
    }

    setLookupFound(findReservationInLookup(lookupCode));
  };

  const handleJoinWaitlist = () => {
    const fullFlight = fullFlights[0];
    if (!fullFlight) return;

    const entry = joinWaitlist({
      flightId: fullFlight.id,
      passengerName: "Pasajero FIFO",
    });

    if (entry) {
      pushAction({
        type: "JOIN_WAITLIST",
        description: `Pasajero agregado a cola para ${entry.flightId}`,
        payload: entry,
      });
    }

    refreshWaitlist();
    refreshHistory();
  };

  const handleProcessNextWaitlist = () => {
    const processed = processNext();

    if (processed) {
      pushAction({
        type: "PROCESS_WAITLIST",
        description: `Procesado siguiente en cola: ${processed.id}`,
        payload: processed,
      });
    }

    refreshWaitlist();
    refreshHistory();
  };

  const handlePushHistoryAction = () => {
    pushAction({
      type: "DEMO_ACTION",
      description: "Acción académica agregada a la pila LIFO",
    });
    refreshHistory();
  };

  const handleUndoLastAction = () => {
    undoLastAction();
    refreshHistory();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>SkyRoute DS - Demo de Estructuras</Text>
      <Text style={styles.subtitle}>
        Pantalla académica para demostrar estructuras de datos con servicios locales.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Grafo BFS</Text>
        <Text style={styles.badge}>Estructura usada: Graph | Algoritmo: BFS</Text>
        <Text style={styles.text}>Consulta: SAP → MAD</Text>
        <Text style={styles.result}>Ruta: {routeResult.route.join(" → ")}</Text>
        <Text style={styles.text}>Escalas: {routeResult.stops}</Text>
        <Text style={styles.text}>{routeResult.message}</Text>
        {routeResult.segments.map((segment) => (
          <Text key={`${segment.origin}-${segment.destination}`} style={styles.smallText}>
            {segment.origin} → {segment.destination} | {segment.airline} | ${segment.basePrice}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Árbol Binario</Text>
        <Text style={styles.badge}>Estructura usada: BinarySearchTree</Text>
        <Text style={styles.text}>Consulta: vuelos SAP → MIA ordenados por precio</Text>
        {flightResult.inOrder.map((flight) => (
          <Text key={flight.id} style={styles.result}>
            {flight.id}: ${flight.price} | Cupos: {flight.availableSeats}/{flight.capacity}
          </Text>
        ))}
        <Text style={styles.smallTitle}>Recorridos técnicos</Text>
        <Text style={styles.smallText}>
          inOrder: {flightResult.inOrder.map((flight) => flight.price).join(" → ")}
        </Text>
        <Text style={styles.smallText}>
          preOrder: {flightResult.preOrder.map((flight) => flight.price).join(" → ")}
        </Text>
        <Text style={styles.smallText}>
          postOrder: {flightResult.postOrder.map((flight) => flight.price).join(" → ")}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lista Enlazada</Text>
        <Text style={styles.badge}>Estructura usada: LinkedList</Text>
        <TouchableOpacity style={styles.button} onPress={handleCreateDemoReservation}>
          <Text style={styles.buttonText}>Crear reserva demo</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Reservas activas: {reservations.length}</Text>
        <Text style={styles.text}>
          Última reserva creada: {selectedReservation ? selectedReservation.code : "Ninguna"}
        </Text>
        {reservations.map((reservation) => (
          <Text key={reservation.id} style={styles.result}>
            {reservation.code} | {reservation.origin} → {reservation.destination} | ${reservation.totalPrice}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tabla Hash</Text>
        <Text style={styles.badge}>Estructura usada: HashTable | Clave: código de reserva</Text>
        <Text style={styles.text}>Código actual: {lookupCode || "Crea una reserva demo primero"}</Text>
        <TouchableOpacity style={styles.button} onPress={handleFindReservationInLookup}>
          <Text style={styles.buttonText}>Buscar código en HashTable</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Existe código: {lookupCode ? String(hasReservationCode(lookupCode)) : "false"}
        </Text>
        <Text style={styles.result}>
          Resultado: {lookupFound ? `${lookupFound.code} encontrado` : "Sin resultado"}
        </Text>
        <Text style={styles.smallTitle}>Entradas y buckets</Text>
        {getLookupEntries().map((entry) => (
          <Text key={entry.key} style={styles.smallText}>
            bucket {entry.bucketIndex}: {entry.key}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cola FIFO</Text>
        <Text style={styles.badge}>Estructura usada: Queue | Caso: vuelos llenos</Text>
        <Text style={styles.text}>Vuelos llenos disponibles para demo:</Text>
        {fullFlights.slice(0, 4).map((flight) => (
          <Text key={flight.id} style={styles.smallText}>
            {flight.id} | {flight.origin} → {flight.destination} | Cupos: {flight.availableSeats}
          </Text>
        ))}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleJoinWaitlist}>
            <Text style={styles.buttonText}>Unir pasajero demo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleProcessNextWaitlist}>
            <Text style={styles.secondaryButtonText}>Procesar siguiente</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>
          Siguiente: {nextWaitlistItem ? `${nextWaitlistItem.id} - ${nextWaitlistItem.flightId}` : "Nadie en cola"}
        </Text>
        {waitlistItems.map((entry) => (
          <Text key={entry.id} style={styles.result}>
            {entry.id}: {entry.passengerName} | {entry.flightId}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pila LIFO</Text>
        <Text style={styles.badge}>Estructura usada: Stack | Caso: historial/deshacer</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handlePushHistoryAction}>
            <Text style={styles.buttonText}>Registrar acción</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleUndoLastAction}>
            <Text style={styles.secondaryButtonText}>Deshacer</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>
          Última acción: {lastAction ? `${lastAction.id} - ${lastAction.description}` : "Sin acciones"}
        </Text>
        {historyItems.map((action) => (
          <Text key={action.id} style={styles.result}>
            {action.id}: {action.type} | {action.description}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#5f6b7a",
    marginTop: 6,
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f3658",
    marginBottom: 6,
  },
  badge: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f6ed4",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: "#263447",
    marginBottom: 6,
  },
  result: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 5,
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#374151",
    marginTop: 10,
    marginBottom: 4,
  },
  smallText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#1f6ed4",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#1f6ed4",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  secondaryButtonText: {
    color: "#1f6ed4",
    fontWeight: "800",
  },
});
