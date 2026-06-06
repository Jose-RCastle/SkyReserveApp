import airportsData from "../data/airports.json";
import routesData from "../data/routes.json";
import Graph from "../dataStructures/Graph";

export type Airport = {
  code: string;
  name: string;
  city: string;
  country: string;
};

export type RouteConnection = {
  origin: string;
  destination: string;
  basePrice: number;
  durationMinutes: number;
  distanceKm: number;
  airline: string;
};

export type RouteSearchResult = {
  route: string[];
  segments: RouteConnection[];
  stops: number;
  message: string;
};

const airports = airportsData as Airport[];
const routes = routesData as RouteConnection[];

// Construye un grafo dirigido usando todos los aeropuertos y rutas locales.
export function buildRouteGraph(): Graph<RouteConnection> {
  const graph = new Graph<RouteConnection>();

  airports.forEach((airport) => {
    graph.addVertex(airport.code);
  });

  routes.forEach((route) => {
    graph.addEdge(route.origin, route.destination, route);
  });

  return graph;
}

// Busca los metadatos de cada tramo de una ruta encontrada por BFS.
function getRouteSegments(path: string[]): RouteConnection[] {
  const segments: RouteConnection[] = [];

  for (let index = 0; index < path.length - 1; index += 1) {
    const origin = path[index];
    const destination = path[index + 1];
    const segment = routes.find(
      (route) => route.origin === origin && route.destination === destination
    );

    if (segment) {
      segments.push(segment);
    }
  }

  return segments;
}

// Encuentra la ruta con menos escalas entre dos aeropuertos usando BFS.
export function findRouteBFS(origin: string, destination: string): RouteSearchResult {
  if (!origin || !destination) {
    return {
      route: [],
      segments: [],
      stops: 0,
      message: "Debes indicar aeropuerto de origen y destino.",
    };
  }

  const graph = buildRouteGraph();
  const route = graph.bfs(origin, destination);

  if (route.length === 0) {
    return {
      route: [],
      segments: [],
      stops: 0,
      message: `No se encontró una ruta disponible de ${origin} a ${destination}.`,
    };
  }

  const stops = Math.max(route.length - 2, 0);

  return {
    route,
    segments: getRouteSegments(route),
    stops,
    message: stops === 0
      ? `Ruta directa encontrada de ${origin} a ${destination}.`
      : `Ruta encontrada de ${origin} a ${destination} con ${stops} escala${stops === 1 ? "" : "s"}.`,
  };
}

// Devuelve los aeropuertos locales disponibles para construir selectores o demos.
export function getAirports(): Airport[] {
  return [...airports];
}

// Devuelve las rutas locales disponibles para inspección o demostración del grafo.
export function getRoutes(): RouteConnection[] {
  return [...routes];
}

export type AirportCatalogItem = {
  id: string;
  code: string;
  name: string;
  airportName: string;
  city: string;
  country: string;
};

export type ReachableDestination = AirportCatalogItem & {
  stops: number;
  availabilityLabel: "Vuelo directo" | "Con escala";
};

// Convierte airports.json al formato compatible con los selectores existentes.
export function getAirportCatalog(): AirportCatalogItem[] {
  return airports.map((airport) => ({
    id: airport.code,
    code: airport.code,
    name: airport.city,
    airportName: airport.name,
    city: airport.city,
    country: airport.country,
  }));
}

// Devuelve solo destinos alcanzables desde el origen usando BFS sobre el grafo de rutas.
export function getReachableDestinations(origin: string): ReachableDestination[] {
  if (!origin) return [];

  return getAirportCatalog()
    .filter((airport) => airport.code !== origin)
    .map((airport) => {
      const routeResult = findRouteBFS(origin, airport.code);

      if (routeResult.route.length === 0) return null;

      return {
        ...airport,
        stops: routeResult.stops,
        availabilityLabel: routeResult.stops === 0 ? "Vuelo directo" : "Con escala",
      };
    })
    .filter((airport): airport is ReachableDestination => airport !== null);
}
