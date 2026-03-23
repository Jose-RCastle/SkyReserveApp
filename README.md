# SkyReserve

Aplicación móvil desarrollada con **React Native y TypeScript** como proyecto **Programación Móvil**.

La aplicación simula un sistema de reservación de vuelos donde el usuario puede buscar destinos, seleccionar fechas y pasajeros, y guardar reservas.

## Funcionalidades

- Inicio de sesión con validación de correo y contraseña
- Búsqueda de vuelos seleccionando:
  - Origen
  - Destino
  - Fecha de salida y regreso
  - Cantidad de pasajeros
- Resumen del vuelo antes de confirmar la reserva
- Registro de reservas realizadas
- Visualización de reservas en una pantalla dedicada
- Perfil de usuario con opción de cerrar sesión

## Tecnologías utilizadas

- React Native
- TypeScript
- Expo
- React Navigation (Stack + Tabs)
- Context API para manejo de estado global

## Estructura del proyecto

SkyReserve/
src/
   - components/
     - CustomButton.tsx
     - CustomInput.tsx
     - FlightCard.tsx
     - FlightTypeSelector.tsx
     - InputField.tsx
     - PassengerSelector.tsx
   - data/ # Datos locales
     - flights.json
   - hooks/ # Custom hooks
     - useFlightSearch.ts
     - useModals.ts
     - usePassengers.ts
   - lib/
      supabase.ts
   - navigation/
     - StackNavigator.tsx
     - TabsNavigator.tsx
   - redux/
     - slices/
       - authSlice.ts
       - reservationSlice.ts
     - hooks.ts
     - store.ts     
   - screens/
     - ConfirmationModal.tsx
     - DestinationModal.tsx
     - HomeScreen.tsx
     - LoginScreen.tsx
     - MyReservationsScreen.tsx
     - OriginModal.tsx
     - ProfileScreen.tsx
   - types/
   - flight.types.ts

