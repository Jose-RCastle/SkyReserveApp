import enhancedFlightsData from "../data/enhancedFlights.json";
import BinarySearchTree from "../dataStructures/BinarySearchTree";

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

// Devuelve todos los vuelos simulados desde el archivo local enhancedFlights.json.
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

// Busca vuelos por ruta, los inserta en un árbol por precio y devuelve recorridos para demo.
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
      ? `No hay vuelos simulados de ${origin} a ${destination}.`
      : `Se encontraron ${flights.length} vuelo${flights.length === 1 ? "" : "s"} de ${origin} a ${destination}.`,
  };
}

// Ordena todos los vuelos por precio usando recorrido inorden del árbol binario.
export function getAllFlightsOrderedByPrice(): EnhancedFlight[] {
  return buildFlightPriceTree(enhancedFlights).inOrder();
}
