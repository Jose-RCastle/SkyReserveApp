import { useState } from 'react';
import { Alert } from 'react-native';
import { Destination } from '../types/flight.types';

export const useFlightSearch = () => {
  const [flightType, setFlightType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  
  // Fecha de hoy a las 00:00 para comparaciones
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [departDate, setDepartDate] = useState(today);
  const [returnDate, setReturnDate] = useState(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  // Validar que la fecha de salida no sea anterior a hoy
  const handleSetDepartDate = (date: Date) => {
    if (date < today) {
      Alert.alert("Fecha inválida", "La fecha de salida no puede ser anterior a hoy");
      return false;
    }
    setDepartDate(date);
    
    // Si la fecha de regreso es anterior a la nueva fecha de salida, actualizarla
    if (flightType === 'roundtrip' && returnDate < date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnDate(nextDay);
    }
    return true;
  };

  // Validar que la fecha de regreso sea posterior a la de salida
  const handleSetReturnDate = (date: Date) => {
    if (date <= departDate) {
      Alert.alert("Fecha inválida", "La fecha de regreso debe ser posterior a la fecha de salida");
      return false;
    }
    setReturnDate(date);
    return true;
  };

  const handleSearch = (destination: Destination | null) => {
    if (!destination) {
      Alert.alert("Error", "Por favor selecciona un destino");
      return false;
    }
    return true;
  };

  // Actualizar fecha de regreso cuando cambia el tipo de vuelo
  const handleSetFlightType = (type: 'roundtrip' | 'oneway') => {
    setFlightType(type);
    if (type === 'oneway') {
      // No necesitamos hacer nada especial
    } else {
      // Asegurar que la fecha de regreso sea válida al cambiar a roundtrip
      if (returnDate <= departDate) {
        const nextDay = new Date(departDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setReturnDate(nextDay);
      }
    }
  };

  return {
    flightType,
    setFlightType: handleSetFlightType,
    selectedDestination,
    setSelectedDestination,
    departDate,
    setDepartDate: handleSetDepartDate,
    returnDate,
    setReturnDate: handleSetReturnDate,
    handleSearch,
    today // Exportamos today por si lo necesitamos en el componente
  };
};