export type Airport = {
  skyId: string;
  entityId: string;
  name: string;
  city: string;
  country: string;
  iata: string;
};

export type FlightDeal = {
  id: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  price: number;
  previousPrice?: number;
  priceChange?: number;
  airline: string;
  stops: number;
  duration: string;
  dates: string;
  badge: 'hot' | 'good' | 'watch';
  departureDate: string;
  returnDate?: string;
};

export type PriceHistoryPoint = {
  date: string;
  price: number;
};

export type FlightSearchParams = {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  cabinClass?: string;
  adults?: number;
};

export type FlightSearchResult = {
  flights: FlightDeal[];
  cheapestPrice: number;
  averagePrice: number;
};
