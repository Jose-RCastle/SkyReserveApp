import HashTable from "../dataStructures/HashTable";
import { DemoReservation } from "./reservationStructureService";

const reservationLookup = new HashTable<DemoReservation>(7);

// Agrega una reserva al índice hash usando su código como clave.
export function addReservationToLookup(reservation: DemoReservation): boolean {
  if (!reservation.code) return false;
  return reservationLookup.set(reservation.code, reservation);
}

// Busca una reserva por código con acceso promedio rápido mediante tabla hash.
export function findReservationByCode(code: string): DemoReservation | null {
  return reservationLookup.get(code);
}

// Verifica si un código de reserva existe sin depender del valor almacenado.
export function hasReservationCode(code: string): boolean {
  return reservationLookup.has(code);
}

// Expone entradas con bucketIndex para demostrar colisiones por encadenamiento.
export function getLookupEntries(): Array<{ key: string; value: DemoReservation; bucketIndex: number }> {
  return reservationLookup.toEntries();
}

// Devuelve las reservas indexadas como arreglo para inspección o renderizado futuro.
export function getLookupArray(): DemoReservation[] {
  return reservationLookup.toArray();
}
