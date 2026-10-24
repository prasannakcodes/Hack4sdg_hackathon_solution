export interface MakerShipment {
  id: string;
  makerName: string;
  category: string;
  weightKg: number;
  dimensionsCm: {
    length: number;
    width: number;
    height: number;
  };
  volumeM3: number;
  origin: string;
  destination: string;
  pickupDate: string;
  approved?: boolean;
}

export interface TruckConfig {
  maxWeightKg: number;
  maxVolumeM3: number;
  costPerTripInr: number;
  emissionFactorKgCo2PerKm: number;
  routeDistanceKm: number;
  truckTypeName: string;
  citation: string;
}

export interface MakerSavings {
  makerId: string;
  makerName: string;
  weightKg: number;
  volumeM3: number;
  truckAssignedId: string;
  beforeCostInr: number;
  afterCostShareInr: number;
  costSavedInr: number;
  percentageSaved: number;
  costSavedPerKgInr: number;
  beforeCo2Kg: number;
  afterCo2Kg: number;
  co2AvoidedKg: number;
}

export interface PackedTruck {
  truckId: string;
  truckName: string;
  shipments: MakerShipment[];
  totalWeightKg: number;
  totalVolumeM3: number;
  weightUtilizationPercent: number;
  volumeUtilizationPercent: number;
  isOverloaded: boolean;
  costInr: number;
  co2Kg: number;
}

export interface PoolingResult {
  beforeTrucks: PackedTruck[];
  afterTrucks: PackedTruck[];
  makerSavings: MakerSavings[];
  summary: {
    totalMakers: number;
    beforeTrucksCount: number;
    afterTrucksCount: number;
    trucksReduced: number;
    beforeTotalCostInr: number;
    afterTotalCostInr: number;
    totalSavingsInr: number;
    totalCostSavingsPercent: number;
    beforeTotalCo2Kg: number;
    afterTotalCo2Kg: number;
    totalCo2AvoidedKg: number;
    totalCo2ReductionPercent: number;
    routeDistanceKm: number;
    totalWeightKg: number;
    totalVolumeM3: number;
  };
}

export type SupportedLanguage = "hi" | "ta" | "kn" | "mr" | "gu" | "en";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  bhashiniCode: string;
}

export type ChatIntent = "add_shipment" | "show_savings" | "what_is_pooling" | "unknown";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  originalText?: string;
  translatedText?: string;
  language: SupportedLanguage;
  timestamp: string;
  intent?: ChatIntent;
  data?: MakerSavings | Record<string, any>;
}
