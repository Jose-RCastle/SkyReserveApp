import enhancedFlightsData from "../data/enhancedFlights.json";
import BinarySearchTree from "../dataStructures/BinarySearchTree";
import type { RouteConnection, RouteSearchResult } from "./routeService";

export type EnhancedFlight = {
  id: string;
  origin: string;
  destination: string;
  price: number;
  availableSeats: number;
  capacity: number;
  durationMinutes: number;
  airline: string;
};

export type FlightSearchResult = {
  flights: EnhancedFlight[];
  inOrder: EnhancedFlight[];
  preOrder: EnhancedFlight[];
  postOrder: EnhancedFlight[];
  cheapestFlight: EnhancedFlight | null;
  mostExpensiveFlight: EnhancedFlight | null;
  message: string;
};

export type ReservationOption = {
  origin: string;
  destination: string;
  routePath: string[];
  routeSegments: RouteConnection[];
  selectedFlights: EnhancedFlight[];
  unavailableSegments: string[];
  stops: number;
  totalPassengers: number;
  recommendedFlight: EnhancedFlight | null;
  basePrice: number;
  priceSource: "direct-flight" | "estimated-route" | "unavailable";
  canReserve: boolean;
  message: string;
};

const enhancedFlights = enhancedFlightsData as EnhancedFlight[];
const insufficientSeatsMessage = "No hay cupos suficientes para este grupo. Puedes intentar con menos pasajeros o revisar la lista de espera.";

// Compara vuelos únicamente por precio para demostrar duplicados en el árbol binario.
function compareFlightsByPrice(a: EnhancedFlight, b: EnhancedFlight): number {
  return a.price - b.price;
}

// Crea un árbol binario de búsqueda con los vuelos recibidos.
export function buildFlightPriceTree(flights: EnhancedFlight[]): BinarySearchTree<EnhancedFlight> {
  const tree = new BinarySearchTree<EnhancedFlight>(compareFlightsByPrice);
  flights.forEach((flight) => tree.insert(flight));
  return tree;
}

// Devuelve todos los vuelos enriquecidos desde el archivo local enhancedFlights.json.
export function getAllEnhancedFlights(): EnhancedFlight[] {
  return [...enhancedFlights];
}

// Filtra vuelos por origen y destino.
export function filterFlightsByRoute(origin: string, destination: string): EnhancedFlight[] {
  if (!origin || !destination) return [];

  return enhancedFlights.filter(
    (flight) => flight.origin === origin && flight.destination === destination
  );
}

// Filtra vuelos que tienen cupos suficientes para todo el grupo.
export function filterFlightsWithSeats(
  flights: EnhancedFlight[],
  totalPassengers: number
): EnhancedFlight[] {
  if (totalPassengers <= 0) return [];

  return flights.filter((flight) => flight.availableSeats >= totalPassengers);
}

// Elige el vuelo más barato con cupos suficientes usando el árbol binario.
export function findCheapestAvailableFlight(
  flights: EnhancedFlight[],
  totalPassengers: number
): EnhancedFlight | null {
  const availableFlights = filterFlightsWithSeats(flights, totalPassengers);

  if (availableFlights.length === 0) return null;

  return buildFlightPriceTree(availableFlights).findMin();
}

// Busca vuelos por ruta, los inserta en un árbol por precio y devuelve recorridos para SkyRoute DS.
export function searchFlightsByRoute(origin: string, destination: string): FlightSearchResult {
  const flights = filterFlightsByRoute(origin, destination);
  const tree = buildFlightPriceTree(flights);
  const inOrder = tree.inOrder();

  return {
    flights,
    inOrder,
    preOrder: tree.preOrder(),
    postOrder: tree.postOrder(),
    cheapestFlight: tree.findMin(),
    mostExpensiveFlight: tree.findMax(),
    message: flights.length === 0
      ? `Sin vuelos directos disponibles de ${origin} a ${destination}.`
      : `Vuelos disponibles de ${origin} a ${destination}: ${flights.length}.`,
  };
}

// Calcula vuelos disponibles por cada tramo de una ruta encontrada por BFS.
function getAvailableFlightsForRouteSegments(
  routePath: string[],
  totalPassengers: number
): {
  selectedFlights: EnhancedFlight[];
  unavailableSegments: string[];
} {
  const selectedFlights: EnhancedFlight[] = [];
  const unavailableSegments: string[] = [];

  for (let index = 0; index < routePath.length - 1; index += 1) {
    const segmentOrigin = routePath[index];
    const segmentDestination = routePath[index + 1];
    const segmentFlights = filterFlightsByRoute(segmentOrigin, segmentDestination);
    const cheapestAvailableFlight = findCheapestAvailableFlight(
      segmentFlights,
      totalPassengers
    );

    if (cheapestAvailableFlight) {
      selectedFlights.push(cheapestAvailableFlight);
    } else {
      unavailableSegments.push(`${segmentOrigin} → ${segmentDestination}`);
    }
  }

  return { selectedFlights, unavailableSegments };
}

// Calcula la opción de reserva coherente entre vuelos directos, cupos y ruta por escalas.
export function getReservationOption(
  origin: string,
  destination: string,
  routeResult: RouteSearchResult | null,
  flightResult: FlightSearchResult | null,
  totalPassengers: number
): ReservationOption {
  const directFlight = findCheapestAvailableFlight(
    flightResult?.flights ?? [],
    totalPassengers
  );
  const routePath = routeResult?.route ?? [];
  const routeSegments = routeResult?.segments ?? [];
  const hasRoute = routePath.length > 0;

  if (directFlight) {
    return {
      origin,
      destination,
      routePath: hasRoute ? routePath : [origin, destination],
      routeSegments: hasRoute ? routeSegments : [],
      selectedFlights: [directFlight],
      unavailableSegments: [],
      stops: 0,
      totalPassengers,
      recommendedFlight: directFlight,
      basePrice: directFlight.price,
      priceSource: "direct-flight",
      canReserve: true,
      message: `Vuelo directo recomendado: ${directFlight.id} por $${directFlight.price}.`,
    };
  }

  if (hasRoute && routePath.length > 1) {
    const { selectedFlights, unavailableSegments } = getAvailableFlightsForRouteSegments(
      routePath,
      totalPassengers
    );

    if (unavailableSegments.length > 0 || selectedFlights.length !== routePath.length - 1) {
      return {
        origin,
        destination,
        routePath,
        routeSegments,
        selectedFlights,
        unavailableSegments,
        stops: routeResult?.stops ?? Math.max(routePath.length - 2, 0),
        totalPassengers,
        recommendedFlight: null,
        basePrice: 0,
        priceSource: "unavailable",
        canReserve: false,
        message: insufficientSeatsMessage,
      };
    }

    const routePrice = selectedFlights.reduce((total, flight) => total + flight.price, 0);

    return {
      origin,
      destination,
      routePath,
      routeSegments,
      selectedFlights,
      unavailableSegments: [],
      stops: routeResult?.stops ?? Math.max(routePath.length - 2, 0),
      totalPassengers,
      recommendedFlight: null,
      basePrice: routePrice,
      priceSource: "estimated-route",
      canReserve: routePrice > 0,
      message: `Ruta disponible por escalas. Precio base: $${routePrice}.`,
    };
  }

  return {
    origin,
    destination,
    routePath: [],
    routeSegments: [],
    selectedFlights: [],
    unavailableSegments: [],
    stops: 0,
    totalPassengers,
    recommendedFlight: null,
    basePrice: 0,
    priceSource: "unavailable",
    canReserve: false,
    message: flightResult && flightResult.flights.length > 0
      ? insufficientSeatsMessage
      : `No hay ruta disponible de ${origin} a ${destination}.`,
  };
}

// Ordena todos los vuelos por precio usando recorrido inorden del árbol binario.
export function getAllFlightsOrderedByPrice(): EnhancedFlight[] {
  return buildFlightPriceTree(enhancedFlights).inOrder();
}
