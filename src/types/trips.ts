import type { Trip, TripDestination, ItineraryItem, BudgetEntry } from './supabase';

export type TripWithDetails = Trip & {
  destinations: TripDestination[];
  itinerary_items: ItineraryItem[];
};

export type TripWithBudget = Trip & {
  budget_entries: BudgetEntry[];
  total_spent: number;
};

export type DayGroup = {
  dayStart: number;
  dayEnd: number;
  city: string;
  country: string | null;
  weatherEmoji: string | null;
  tempF: number | null;
  items: ItineraryItem[];
};

export type BudgetCategory = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
};
