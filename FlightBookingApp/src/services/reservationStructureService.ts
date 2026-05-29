import LinkedList from "../dataStructures/LinkedList";

export type DemoReservationInput = {
  origin: string;
  destination: string;
  flightId?: string;
  passengerName?: string;
  totalPrice?: number;
};

export type DemoReservation = Required<Pick<DemoReservationInput, "origin" | "destination">> & {
  id: string;
  code: string;
  flightId?: string;
  passengerName: string;
  totalPrice: number;
  createdAt: string;
};

const reservations = new LinkedList<DemoReservation>();
let reservationCounter = 1;

// Genera códigos legibles para reservas demo: SKY-SAP-MIA-0001.
export function generateReservationCode(origin: string, destination: string): string {
  const sequence = reservationCounter.toString().padStart(4, "0");
  return `SKY-${origin}-${destination}-${sequence}`;
}

// Agrega una reserva demo a la lista enlazada principal.
export function addReservation(input: DemoReservationInput): DemoReservation | null {
  if (!input.origin || !input.destination) return null;

  const reservation: DemoReservation = {
    id: `RES-${reservationCounter.toString().padStart(4, "0")}`,
    code: generateReservationCode(input.origin, input.destination),
    origin: input.origin,
    destination: input.destination,
    flightId: input.flightId,
    passengerName: input.passengerName ?? "Pasajero demo",
    totalPrice: input.totalPrice ?? 0,
    createdAt: new Date().toISOString(),
  };

  reservationCounter += 1;
  reservations.append(reservation);
  return reservation;
}

// Elimina una reserva por id usando un predicado flexible de la lista enlazada.
export function removeReservationById(id: string): DemoReservation | null {
  if (!id) return null;
  return reservations.remove((reservation) => reservation.id === id);
}

// Busca una reserva por código usando un predicado flexible de la lista enlazada.
export function findReservationByCode(code: string): DemoReservation | null {
  if (!code) return null;
  return reservations.find((reservation) => reservation.code === code);
}

// Devuelve las reservas como arreglo para inspección o renderizado futuro.
export function getReservationsArray(): DemoReservation[] {
  return reservations.toArray();
}

// Limpia el servicio demo sin tocar Redux ni Supabase.
export function clearDemoReservations(): void {
  while (!reservations.isEmpty()) {
    const firstReservation = reservations.toArray()[0];
    if (!firstReservation) return;
    reservations.remove((reservation) => reservation.id === firstReservation.id);
  }
  reservationCounter = 1;
}
