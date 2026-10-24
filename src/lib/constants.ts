import { MakerShipment, TruckConfig, LanguageOption } from "@/types";

export const DEFAULT_TRUCK_CONFIG: TruckConfig = {
  maxWeightKg: 3500, // 3.5 Tonne MCV (e.g. Eicher Pro 2059 / Tata 709)
  maxVolumeM3: 14.0, // Standard 14ft container volume (~14 m3)
  costPerTripInr: 14000, // Fixed market freight rate per Moradabad-Delhi trip
  emissionFactorKgCo2PerKm: 0.65, // Standard medium rigid diesel commercial vehicle
  routeDistanceKm: 165, // Moradabad Brass Cluster -> Delhi NCR ICD Logistics Hub
  truckTypeName: "Medium Commercial Vehicle (MCV 14-ft Rigid Diesel)",
  citation:
    "India GHG Program (WRI India, CII, TERI) & CPCB (Central Pollution Control Board) Road Freight Emission Factor for Medium Commercial Vehicles (MCV 3.5T-7.5T)",
};

export const SEEDED_MAKERS: MakerShipment[] = [
  {
    id: "maker-1",
    makerName: "Moradabad Brass Artwares",
    category: "Brass Lanterns & Home Decor",
    weightKg: 1400,
    dimensionsCm: {
      length: 220,
      width: 160,
      height: 150,
    },
    volumeM3: 5.28,
    origin: "Peetal Nagri Industrial Area, Moradabad",
    destination: "ICD Patparganj Freight Complex, Delhi NCR",
    pickupDate: "2026-10-25",
    approved: true,
  },
  {
    id: "maker-2",
    makerName: "Royal Peetal Handicrafts",
    category: "Engraved Brass Utensils & Bowls",
    weightKg: 1100,
    dimensionsCm: {
      length: 200,
      width: 150,
      height: 150,
    },
    volumeM3: 4.5,
    origin: "Sambhal Road Craft Colony, Moradabad",
    destination: "ICD Patparganj Freight Complex, Delhi NCR",
    pickupDate: "2026-10-25",
    approved: true,
  },
  {
    id: "maker-3",
    makerName: "Sunrise Copper & Metal Works",
    category: "Hammered Copper Tableware & Jugs",
    weightKg: 1600,
    dimensionsCm: {
      length: 240,
      width: 160,
      height: 150,
    },
    volumeM3: 5.76,
    origin: "Pakbara Artisan Cluster, Moradabad",
    destination: "Okhla Industrial Area Phase-III, New Delhi",
    pickupDate: "2026-10-25",
    approved: true,
  },
  {
    id: "maker-4",
    makerName: "Heritage Bell Metal Castings",
    category: "Traditional Bell Metal & Hardware",
    weightKg: 950,
    dimensionsCm: {
      length: 180,
      width: 140,
      height: 140,
    },
    volumeM3: 3.53,
    origin: "Station Road Workshop Zone, Moradabad",
    destination: "Okhla Industrial Area Phase-III, New Delhi",
    pickupDate: "2026-10-25",
    approved: true,
  },
];

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", bhashiniCode: "hi" },
  { code: "en", name: "English", nativeName: "English", bhashiniCode: "en" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", bhashiniCode: "ta" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", bhashiniCode: "kn" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", bhashiniCode: "mr" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", bhashiniCode: "gu" },
];

export const POOLING_EXPLANATION: Record<string, string> = {
  en: "Shared Truck Pooling allows small artisans and makers in the same industrial cluster to combine their cargo into shared trucks travelling along the same corridor. Instead of each maker paying ₹14,000 for a mostly empty dedicated truck, 2 or more makers share the cargo bay. This cuts your logistics cost by up to 50% and slashes diesel CO₂ emissions directly in half, supporting SDG 12 & SDG 13.",
  hi: "शेयर्ड ट्रक पूलिंग एक ही औद्योगिक क्लस्टर (जैसे मुरादाबाद) के छोटे कारीगरों और निर्माताओं को एक ही रूट पर जाने वाले ट्रकों में माल साझा करने की सुविधा देता है। हर निर्माता को खाली ट्रक के लिए पूरे ₹14,000 देने के बजाय, 2 या अधिक निर्माता ट्रक स्पेस साझा करते हैं। इससे आपकी लॉजिस्टिक्स लागत 50% तक कम होती है और डीजल CO₂ प्रदूषण आधा हो जाता है (SDG 12 और SDG 13)।",
  ta: "பகிர்வு டிரக் பூலிங் (Shared Truck Pooling) ஒரே வழித்தடத்தில் செல்லும் சிறு உற்பத்தியாளர்கள் டிரக் இடத்தை பகிர்ந்துகொள்ள உதவுகிறது. தனித்தனியாக ₹14,000 செலவழிப்பதற்குப் பதிலாக, 2 அல்லது அதற்கு மேற்பட்ட உற்பத்தியாளர்கள் இணைந்து சரக்கை அனுப்புவதால் போக்குவரத்துச் செலவு 50% வரை குறைகிறது மற்றும் CO₂ உமிழ்வு பாதியாகக் குறைகிறது.",
  kn: "ಹಂಚಿಕೆಯ ಟ್ರಕ್ ಪೂಲಿಂಗ್ ಸಣ್ಣ ತಯಾರಕರಿಗೆ ಒಂದೇ ಮಾರ್ಗದಲ್ಲಿ ಟ್ರಕ್ ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಅನುಮತಿಸುತ್ತದೆ. ಪ್ರತಿಯೊಬ್ಬರೂ ಪೂರ್ಣ ₹14,000 ಪಾವತಿಸುವ ಬದಲು, ತಯಾರಕರು ಜಾಗವನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತಾರೆ. ಇದು ಸಾರಿಗೆ ವೆಚ್ಚವನ್ನು 50% ವರೆಗೆ ಉಳಿಸುತ್ತದೆ ಮತ್ತು CO₂ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಅರ್ಧದಷ್ಟು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
  mr: "शेअर केलेल्या ट्रक पूलिंगमुळे एकाच क्लस्टरमधील लहान उत्पादकांना एकाच मार्गावर ट्रक जागा सामायिक करता येते. प्रत्येकाने ₹14,000 भरण्याऐवजी उत्पादक जागा वाटून घेतात. यामुळे वाहतूक खर्चात 50% बचत होते आणि CO₂ उत्सर्जन निम्मे होते.",
  gu: "શેર્ડ ટ્રક પૂલિંગ નાના ઉત્પાદકોને એક જ રૂટ પર ટ્રકની જગ્યા શેર કરવાની મંજૂરી આપે છે. દરેક વ્યક્તિ પૂરા ₹14,000 ચૂકવવાને બદલે, 2 કે વધુ ઉત્પાદકો જગ્યા વહેંચે છે. આનાથી ખર્ચમાં 50% સુધીનો ઘટાડો થાય છે અને CO₂ ઉત્સર્જન અડધું થાય છે.",
};
