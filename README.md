# SkyRoute DS

SkyRoute DS es una aplicación móvil desarrollada con React Native, Expo y TypeScript. La app simula un sistema inteligente de reservación de vuelos, permitiendo buscar rutas, validar disponibilidad, calcular precios, gestionar reservas, unirse a lista de espera y consultar historial reciente de acciones.

El proyecto fue adaptado para la clase de Estructuras de Datos, integrando estructuras manuales dentro del flujo real de la aplicación.

## Funcionalidades principales

* Registro e inicio de sesión de usuarios mediante Supabase.
* Búsqueda de vuelos por origen, destino, fechas y pasajeros.
* Cálculo de rutas sugeridas entre aeropuertos.
* Validación de cupos disponibles antes de reservar.
* Selección del vuelo disponible más económico.
* Confirmación de reserva con resumen de ruta, pasajeros y precio.
* Registro de reservas en Supabase.
* Visualización de reservas activas.
* Búsqueda rápida de reservas por código.
* Validación de conflictos de fechas para evitar reservas cruzadas.
* Lista de espera cuando no hay cupos suficientes.
* Historial reciente de acciones desde el perfil.
* Perfil de usuario con información personal, cambio de idioma y cierre de sesión.

## Estructuras de datos utilizadas

El proyecto implementa manualmente las siguientes estructuras de datos:

### Lista enlazada

Se utiliza para gestionar reservas en memoria. Permite recorrer, buscar y validar reservas activas, incluyendo la detección de conflictos de fechas antes de crear una nueva reserva.

Archivo principal:

```text
src/dataStructures/LinkedList.ts
```

Uso principal:

```text
src/services/reservationIndexService.ts
src/screens/MyReservationsScreen.tsx
```

### Pila

Se utiliza para manejar el historial reciente de acciones del usuario. Las acciones más recientes se muestran primero y pueden eliminarse siguiendo el comportamiento LIFO.

Archivo principal:

```text
src/dataStructures/Stack.ts
```

Uso principal:

```text
src/services/historyService.ts
src/screens/ProfileScreen.tsx
```

### Cola

Se utiliza para la lista de espera de vuelos cuando no hay cupos suficientes. Las solicitudes se organizan según el orden de llegada, siguiendo el comportamiento FIFO.

Archivo principal:

```text
src/dataStructures/Queue.ts
```

Uso principal:

```text
src/services/waitlistService.ts
src/screens/HomeScreen.tsx
src/screens/MyReservationsScreen.tsx
```

### Árbol binario de búsqueda

Se utiliza para ordenar vuelos por precio y seleccionar el vuelo disponible más económico. También permite recorridos inorden, preorden y postorden.

Archivo principal:

```text
src/dataStructures/BinarySearchTree.ts
```

Uso principal:

```text
src/services/flightSearchService.ts
src/screens/HomeScreen.tsx
```

### Tabla hash

Se utiliza para indexar reservas por código y permitir búsquedas rápidas desde la pantalla de reservas.

Archivo principal:

```text
src/dataStructures/HashTable.ts
```

Uso principal:

```text
src/services/reservationIndexService.ts
src/screens/MyReservationsScreen.tsx
```

### Grafo

Se utiliza para representar aeropuertos y rutas aéreas. Los aeropuertos son vértices y las rutas son aristas. Se aplica BFS para encontrar rutas entre origen y destino.

Archivo principal:

```text
src/dataStructures/Graph.ts
```

Uso principal:

```text
src/services/routeService.ts
src/screens/HomeScreen.tsx
```

## Tecnologías utilizadas

* React Native
* Expo
* TypeScript
* React Navigation
* Redux Toolkit
* Supabase
* AsyncStorage
* i18n
* Estructuras de datos implementadas manualmente

## Persistencia

La aplicación utiliza Supabase para:

* Autenticación de usuarios.
* Perfiles de usuario.
* Reservas realizadas.
* Lista de espera.

Las estructuras de datos se utilizan como lógica interna en memoria para procesar, organizar, buscar y validar la información antes de mostrarla o guardarla.

## Flujo general de la aplicación

```text
Login / Registro
        ↓
Inicio
        ↓
Selección de origen, destino, fecha y pasajeros
        ↓
Cálculo de ruta sugerida
        ↓
Validación de vuelos, cupos y precios
        ↓
Confirmación de reserva
        ↓
Guardado en Supabase
        ↓
Visualización en Reservas
```

Si no hay cupos suficientes, el usuario puede unirse a una lista de espera.

## Estructura del proyecto

```text
FlightBookingApp/
├── App.tsx
├── src/
│   ├── components/
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   ├── FlightCard.tsx
│   │   ├── FlightTypeSelector.tsx
│   │   ├── InputField.tsx
│   │   ├── LanguageInitializer.tsx
│   │   └── PassengerSelector.tsx
│   │
│   ├── data/
│   │   ├── airports.json
│   │   ├── routes.json
│   │   ├── enhancedFlights.json
│   │   └── flights.json
│   │
│   ├── dataStructures/
│   │   ├── LinkedList.ts
│   │   ├── Stack.ts
│   │   ├── Queue.ts
│   │   ├── BinarySearchTree.ts
│   │   ├── HashTable.ts
│   │   └── Graph.ts
│   │
│   ├── hooks/
│   │   ├── useFlightSearch.ts
│   │   ├── useModals.ts
│   │   └── usePassengers.ts
│   │
│   ├── lib/
│   │   └── supabase.ts
│   │
│   ├── navigation/
│   │   ├── StackNavigator.tsx
│   │   └── TabsNavigator.tsx
│   │
│   ├── redux/
│   │   ├── hooks.ts
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── languageSlice.ts
│   │       └── reservationSlice.ts
│   │
│   ├── screens/
│   │   ├── AccountInfoScreen.tsx
│   │   ├── ConfirmationModal.tsx
│   │   ├── DestinationModal.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MyReservationsScreen.tsx
│   │   ├── OriginModal.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── RegisterScreen.tsx
│   │
│   ├── services/
│   │   ├── flightSearchService.ts
│   │   ├── historyService.ts
│   │   ├── lookupService.ts
│   │   ├── reservationIndexService.ts
│   │   ├── reservationStructureService.ts
│   │   ├── routeService.ts
│   │   └── waitlistService.ts
│   │
│   └── types/
│       └── flight.types.ts
```

## Instalación y ejecución

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto:

```bash
npx expo start
```

Verificar TypeScript:

```bash
npx tsc --noEmit
```

## Notas del proyecto

* Redux se mantiene para estado global mínimo y compatibilidad interna.
* Supabase se utiliza como sistema de persistencia.
* Las estructuras de datos se implementan manualmente y se usan dentro del flujo funcional de la app.
* La pantalla técnica de demostración de estructuras se mantiene en el código como respaldo, pero ya no forma parte de la navegación principal.
