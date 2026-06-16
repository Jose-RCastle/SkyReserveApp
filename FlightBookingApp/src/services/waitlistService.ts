import enhancedFlightsData from "../data/enhancedFlights.json";
import Queue from "../dataStructures/Queue";
import { EnhancedFlight, ReservationOption } from "./flightSearchService";

export type WaitlistEntry = {
  id: string;
  flightId: string;
  origin: string;
  destination: string;
  passengerName: string;
  joinedAt: string;
};

export type JoinWaitlistInput = {
  flightId: string;
  passengerName?: string;
};

export type RealWaitlistEntry = {
  id?: string;
  userEmail: string;
  flightId: string;
  origin: string;
  destination: string;
  destinationName: string;
  departureDate: string;
  returnDate?: string | null;
  passengersTotal: number;
  status: string;
  createdAt?: string | null;
};

export type WaitlistInsertPayload = {
  user_email: string;
  flight_id: string;
  origin: string;
  destination: string;
  destination_name: string;
  departure_date: string;
  return_date: string | null;
  passengers_total: number;
  status: string;
};

export type CreateWaitlistEntryInput = {
  userEmail: string;
  origin: string;
  destination: string;
  destinationName: string;
  departureDate: string;
  returnDate?: string | null;
  totalPassengers: number;
  reservationOption: ReservationOption;
};

const enhancedFlights = enhancedFlightsData as EnhancedFlight[];
const waitlist = new Queue<WaitlistEntry>();
let waitlistCounter = 1;

// Devuelve vuelos llenos para probar la cola de espera con availableSeats = 0.
export function getFullFlightsForWaitlistDemos(): EnhancedFlight[] {
  return enhancedFlights.filter((flight) => flight.availableSeats === 0);
}

// Agrega un pasajero a la cola de espera solo si el vuelo existe y está lleno.
export function joinWaitlist(input: JoinWaitlistInput): WaitlistEntry | null {
  if (!input.flightId) return null;

  const flight = enhancedFlights.find((item) => item.id === input.flightId);
  if (!flight || flight.availableSeats > 0) return null;

  const entry: WaitlistEntry = {
    id: `WL-${waitlistCounter.toString().padStart(4, "0")}`,
    flightId: flight.id,
    origin: flight.origin,
    destination: flight.destination,
    passengerName: input.passengerName ?? "Pasajero en espera",
    joinedAt: new Date().toISOString(),
  };

  waitlistCounter += 1;
  waitlist.enqueue(entry);
  return entry;
}

// Procesa y retira al siguiente pasajero de la cola FIFO.
export function processNext(): WaitlistEntry | null {
  return waitlist.dequeue();
}

// Devuelve el siguiente pasajero sin retirarlo de la cola.
export function getNext(): WaitlistEntry | null {
  return waitlist.front();
}

// Devuelve la cola de espera como arreglo para inspección o renderizado futuro.
export function getWaitlistArray(): WaitlistEntry[] {
  return waitlist.toArray();
}

// Construye una cola real desde registros persistidos, respetando orden de llegada.
export function buildWaitlistQueue(entries: RealWaitlistEntry[]): Queue<RealWaitlistEntry> {
  const orderedEntries = [...entries].sort((a, b) => {
    const firstDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const secondDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return firstDate - secondDate;
  });

  return new Queue<RealWaitlistEntry>(orderedEntries);
}

// Convierte una cola real en arreglo sin retirar elementos.
export function getWaitlistArrayFromQueue(
  queue: Queue<RealWaitlistEntry>
): RealWaitlistEntry[] {
  return queue.toArray();
}

// Calcula posición del usuario en la cola para un vuelo específico.
export function getUserWaitlistPosition(
  queue: Queue<RealWaitlistEntry>,
  userEmail: string,
  flightId: string
): number | null {
  if (!userEmail || !flightId) return null;

  const entriesForFlight = queue
    .toArray()
    .filter((entry) => entry.flightId === flightId && entry.status !== "cancelled");

  const positionIndex = entriesForFlight.findIndex(
    (entry) => entry.userEmail === userEmail
  );

  return positionIndex >= 0 ? positionIndex + 1 : null;
}

// Prepara la entrada real para persistencia cuando no hay cupos suficientes.
export function createWaitlistEntryFromReservationOption(
  input: CreateWaitlistEntryInput
): WaitlistInsertPayload {
  const selectedFlight = input.reservationOption.selectedFlights[0];
  const unavailableSegment = input.reservationOption.unavailableSegments[0];
  const fallbackFlightId = unavailableSegment
    ? unavailableSegment.replace(/\s+/g, "")
    : `${input.origin}-${input.destination}`;

  return {
    user_email: input.userEmail,
    flight_id: selectedFlight?.id ?? fallbackFlightId,
    origin: input.origin,
    destination: input.destination,
    destination_name: input.destinationName,
    departure_date: input.departureDate,
    return_date: input.returnDate ?? null,
    passengers_total: input.totalPassengers,
    status: "pending",
  };
}
