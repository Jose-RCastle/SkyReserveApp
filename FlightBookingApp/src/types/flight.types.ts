export interface Origin {
  id: string;
  name: string;
  code: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  basePrice: number;
}

export interface FlightData {
  origins: Origin[];
  destinations: Destination[];
}