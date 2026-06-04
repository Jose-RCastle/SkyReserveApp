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
  stops: number;
  recommendedFlight: EnhancedFlight | null;
  basePrice: number;
  priceSource: "direct-flight" | "estimated-route" | "unavailable";
  canReserve: boolean;
  message: string;
};

const enhancedFlights = enhancedFlightsData as EnhancedFlight[];

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


// Calcula la opción de reserva coherente entre vuelos directos y ruta por escalas.
export function getReservationOption(
  origin: string,
  destination: string,
  routeResult: RouteSearchResult | null,
  flightResult: FlightSearchResult | null
): ReservationOption {
  const directFlight = flightResult?.cheapestFlight ?? null;
  const routePath = routeResult?.route ?? [];
  const routeSegments = routeResult?.segments ?? [];
  const hasRoute = routePath.length > 0;

  if (directFlight) {
    return {
      origin,
      destination,
      routePath: hasRoute ? routePath : [origin, destination],
      routeSegments: hasRoute ? routeSegments : [],
      stops: 0,
      recommendedFlight: directFlight,
      basePrice: directFlight.price,
      priceSource: "direct-flight",
      canReserve: true,
      message: `Vuelo directo recomendado: ${directFlight.id} por $${directFlight.price}.`,
    };
  }

  if (hasRoute && routeSegments.length > 0) {
    const estimatedPrice = routeSegments.reduce(
      (total, segment) => total + segment.basePrice,
      0
    );

    return {
      origin,
      destination,
      routePath,
      routeSegments,
      stops: routeResult?.stops ?? Math.max(routePath.length - 2, 0),
      recommendedFlight: null,
      basePrice: estimatedPrice,
      priceSource: "estimated-route",
      canReserve: estimatedPrice > 0,
      message: `Ruta disponible por escalas. Precio estimado: $${estimatedPrice}.`,
    };
  }

  return {
    origin,
    destination,
    routePath: [],
    routeSegments: [],
    stops: 0,
    recommendedFlight: null,
    basePrice: 0,
    priceSource: "unavailable",
    canReserve: false,
    message: `No hay ruta disponible de ${origin} a ${destination}.`,
  };
}

// Ordena todos los vuelos por precio usando recorrido inorden del árbol binario.
export function getAllFlightsOrderedByPrice(): EnhancedFlight[] {
  return buildFlightPriceTree(enhancedFlights).inOrder();
}
