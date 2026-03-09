import { createContext, useState, ReactNode } from "react";

export type Reservation = {
  id: string;
  origin: string;
  destination: string;
  destinationName: string;
  departDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  totalPrice: number;
  reservationDate: string;
};

type ReservationContextType = {
  reservations: Reservation[];
  addReservation: (flight: Omit<Reservation, 'id' | 'reservationDate'>) => void;
};

export const ReservationContext = createContext<ReservationContextType>({
  reservations: [],
  addReservation: () => {},
});

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addReservation = (flight: Omit<Reservation, 'id' | 'reservationDate'>) => {
    const newReservation: Reservation = {
      ...flight,
      id: Date.now().toString(), // ID único basado en timestamp
      reservationDate: new Date().toLocaleDateString('es-ES')
    };
    setReservations([...reservations, newReservation]);
  };

  return (
    <ReservationContext.Provider value={{ reservations, addReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}