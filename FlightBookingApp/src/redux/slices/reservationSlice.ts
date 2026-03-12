import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PassengerData = {
  adults: number;
  children: number;
  infants: number;
};

export type Reservation = {
  id: string;
  origin: string;
  destination: string;
  destinationName: string;
  departDate: string;
  returnDate?: string;
  passengers: PassengerData;
  totalPrice: number;
  reservationDate: string;
};

type ReservationState = {
  reservations: Reservation[];
};

const initialState: ReservationState = {
  reservations: [],
};

const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
    clearReservations: (state) => {
      state.reservations = [];
    },
  },
});

export const { addReservation, clearReservations } = reservationSlice.actions;
export default reservationSlice.reducer;