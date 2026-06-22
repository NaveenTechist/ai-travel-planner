// src/types/index.ts

export interface Activity {
    _id?: string;
    title: string;
    description: string;
    estimatedCost: number;
}

export interface ItineraryDay {
    dayNumber: number;
    activities: Activity[];
}

export interface Budget {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    total: number;
}

export interface PackingItem {
    _id?: string;
    item: string;
    checked: boolean;
}

export interface PackingList {
    crucialDocuments: PackingItem[];
    activityEquipment: PackingItem[];
    climateWear: PackingItem[];
}

export interface Trip {
    _id: string;
    destination: string;
    durationDays: number;
    budgetTier: 'Low' | 'Medium' | 'High';
    interests: string[];
    itinerary: ItineraryDay[];
    estimatedBudget: Budget;
    hotels: string[];
    packingList?: {
        item: string;
        category: string;
        isPacked: boolean;
    }[];
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}