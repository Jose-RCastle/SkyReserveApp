import enhancedFlightsData from "../data/enhancedFlights.json";
import Queue from "../dataStructures/Queue";
import { EnhancedFlight } from "./flightSearchService";

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
