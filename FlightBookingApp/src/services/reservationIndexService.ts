import LinkedList from "../dataStructures/LinkedList";
import HashTable from "../dataStructures/HashTable";
import { Reservation } from "../redux/slices/reservationSlice";

export type ReservationWithCode = Reservation & {
  reservationCode: string;
};

export type ReservationStructures = {
  list: LinkedList<ReservationWithCode>;
  lookup: HashTable<ReservationWithCode>;
  array: ReservationWithCode[];
};

function normalizeSegment(value: string): string {
  const airportCodeMatch = value.match(/\(([A-Z0-9]{3,})\)/i);
  const rawValue = airportCodeMatch?.[1] ?? value;
  const normalized = rawValue.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  return normalized.slice(0, 3) || "SKY";
}

function normalizeLookupCode(code: string): string {
  return code.trim().toUpperCase();
}

function buildValidDate(year: number, month: number, day: number): number | null {
  if (!year || !month || !day) return null;

  const parsedDate = new Date(year, month - 1, day);
  parsedDate.setHours(0, 0, 0, 0);

  const isValidDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day;

  return isValidDate ? parsedDate.getTime() : null;
}

function parseReservationDate(value?: string): number | null {
  if (!value) return null;

  const trimmedValue = value.trim();
  const slashDateParts = trimmedValue.split("/").map((part) => Number(part));
  const dashDateParts = trimmedValue.split("-").map((part) => Number(part));

  if (slashDateParts.length === 3) {
    const [day, month, year] = slashDateParts;
    return buildValidDate(year, month, day);
  }

  if (dashDateParts.length === 3) {
    const [year, month, day] = dashDateParts;
    return buildValidDate(year, month, day);
  }

  return null;
}

function normalizeDateRange(start: number, end: number): { start: number; end: number } {
  return start <= end ? { start, end } : { start: end, end: start };
}

function rangesOverlap(
  requestedRange: { start: number; end: number },
  existingRange: { start: number; end: number }
): boolean {
  const requestedStartInsideExisting =
    requestedRange.start >= existingRange.start && requestedRange.start <= existingRange.end;
  const requestedEndInsideExisting =
    requestedRange.end >= existingRange.start && requestedRange.end <= existingRange.end;
  const requestedWrapsExisting =
    requestedRange.start <= existingRange.start && requestedRange.end >= existingRange.end;

  return requestedStartInsideExisting || requestedEndInsideExisting || requestedWrapsExisting;
}

export function generateReservationCode(reservation: Reservation): string {
  const originCode = normalizeSegment(reservation.origin);
  const destinationCode = normalizeSegment(reservation.destination);
  const idSuffix = reservation.id.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase();
  const safeSuffix = idSuffix.padStart(4, "0");

  return `SKY-${originCode}-${destinationCode}-${safeSuffix}`;
}

export function buildReservationStructures(reservations: Reservation[]): ReservationStructures {
  const list = new LinkedList<ReservationWithCode>();
  const lookup = new HashTable<ReservationWithCode>(Math.max(reservations.length * 2 + 1, 7));

  reservations.forEach((reservation) => {
    const reservationWithCode: ReservationWithCode = {
      ...reservation,
      reservationCode: generateReservationCode(reservation),
    };

    list.append(reservationWithCode);
    lookup.set(reservationWithCode.reservationCode, reservationWithCode);
  });

  return {
    list,
    lookup,
    array: list.toArray(),
  };
}

export function findReservationByCode(
  lookup: HashTable<ReservationWithCode>,
  code: string
): ReservationWithCode | null {
  if (!code) return null;
  return lookup.get(normalizeLookupCode(code));
}

export function hasDateConflict(
  list: LinkedList<ReservationWithCode>,
  departDate: string,
  returnDate?: string
): boolean {
  const requestedStart = parseReservationDate(departDate);
  const requestedEnd = parseReservationDate(returnDate) ?? requestedStart;

  if (requestedStart === null || requestedEnd === null) return false;

  const requestedRange = normalizeDateRange(requestedStart, requestedEnd);
  const conflictingReservation = list.find((reservation) => {
    const existingStart = parseReservationDate(reservation.departDate);
    const existingEnd = parseReservationDate(reservation.returnDate) ?? existingStart;

    if (existingStart === null || existingEnd === null) return false;

    const existingRange = normalizeDateRange(existingStart, existingEnd);
    return rangesOverlap(requestedRange, existingRange);
  });

  return conflictingReservation !== null;
}
