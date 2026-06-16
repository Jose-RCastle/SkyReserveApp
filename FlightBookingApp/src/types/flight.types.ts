export interface Origin {
  id: string;
  name: string;
  code: string;
  city?: string;
  country?: string;
  airportName?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  basePrice?: number;
  code?: string;
  city?: string;
  airportName?: string;
  availabilityLabel?: string;
  stops?: number;
}

export interface FlightData {
  origins: Origin[];
  destinations: Destination[];
}
