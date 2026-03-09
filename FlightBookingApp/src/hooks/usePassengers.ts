import { useState } from 'react';

export type PassengerCounts = {
  adults: number;
  children: number;
  infants: number;
};

export const usePassengers = () => {
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infants: 0
  });

  const getPassengerText = () => {
    const { adults, children, infants } = passengers;
    const total = adults + children + infants;
    
    if (total === 0) return "Selecciona pasajeros";
    
    const details = [];
    if (adults > 0) details.push(`${adults} adulto${adults > 1 ? 's' : ''}`);
    if (children > 0) details.push(`${children} niño${children > 1 ? 's' : ''}`);
    if (infants > 0) details.push(`${infants} bebé${infants > 1 ? 's' : ''}`);
    
    return `${total} pasajeros (${details.join(', ')})`;
  };

  const calculateTotalPrice = (basePrice: number) => {
    const total = 
      (passengers.adults * basePrice) +
      (passengers.children * basePrice * 0.75) +
      (passengers.infants * basePrice * 0.2);
    
    return Math.round(total);
  };

  return {
    passengers,
    setPassengers,
    getPassengerText,
    calculateTotalPrice
  };
};
