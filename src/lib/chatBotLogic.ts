import { ChatIntent, MakerShipment, SupportedLanguage } from "@/types";
import { POOLING_EXPLANATION } from "./constants";

export interface ChatFlowState {
  step: "idle" | "awaiting_name" | "awaiting_weight" | "awaiting_dims" | "awaiting_dest" | "awaiting_date";
  tempShipment: Partial<MakerShipment>;
}

export function detectIntent(text: string): ChatIntent {
  const t = text.toLowerCase().trim();

  if (
    t.includes("what is pooling") ||
    t.includes("pooling kya hai") ||
    t.includes("पूलिंग क्या है") ||
    t.includes("पूलिंग क्या") ||
    t.includes("पूलिंग") ||
    t.includes("பகிர்வு") ||
    t.includes("ಪೂಲಿಂಗ್") ||
    t.includes("what is truck pooling") ||
    t.includes("explain pooling") ||
    t.includes("how does pooling work")
  ) {
    return "what_is_pooling";
  }

  if (
    t.includes("show my savings") ||
    t.includes("savings") ||
    t.includes("बचत") ||
    t.includes("मेरी बचत") ||
    t.includes("சேமிப்பு") ||
    t.includes("ಉಳಿತಾಯ") ||
    t.includes("how much do i save") ||
    t.includes("check savings") ||
    t.includes("cost saved") ||
    t.includes("co2")
  ) {
    return "show_savings";
  }

  if (
    t.includes("add a shipment") ||
    t.includes("add shipment") ||
    t.includes("शिपमेंट जोड़ें") ||
    t.includes("माल जोड़ें") ||
    t.includes("புதிய சரக்கு") ||
    t.includes("ಹೊಸ ಸಾಗಣೆ") ||
    t.includes("book truck") ||
    t.includes("new shipment") ||
    t.includes("send cargo")
  ) {
    return "add_shipment";
  }

  return "unknown";
}

export const CHAT_STRINGS: Record<
  SupportedLanguage,
  {
    welcome: string;
    addShipmentPrompt: string;
    showSavingsPrompt: string;
    whatIsPooling: string;
    askName: string;
    askWeight: string;
    askDims: string;
    askDest: string;
    askDate: string;
    successAdded: string;
    fallbackHelp: string;
    formFallbackText: string;
  }
> = {
  en: {
    welcome: "Namaste! I am your Shared Truck Assistant. I can help you pool truck space to cut logistics costs and CO₂ emissions. How can I help you today?",
    addShipmentPrompt: "Add a shipment",
    showSavingsPrompt: "Show my savings",
    whatIsPooling: POOLING_EXPLANATION.en,
    askName: "What is your Maker or Workshop Name?",
    askWeight: "What is the total weight of your goods in kilograms (kg)?",
    askDims: "What are the dimensions (Length x Width x Height in cm)?",
    askDest: "What is the delivery destination in Delhi NCR?",
    askDate: "What is the expected pick-up date (YYYY-MM-DD)?",
    successAdded: "Great! Your shipment has been registered and included in the shared corridor pool. Click 'Pool Shipments' to see your new trucks and savings!",
    fallbackHelp: "I understand 3 intents: 'Add a shipment', 'Show my savings', or 'What is pooling?'. You can also use the form above anytime.",
    formFallbackText: "Switch to Form",
  },
  hi: {
    welcome: "नमस्ते! मैं आपका शेयर्ड ट्रक सहायक हूँ। मैं आपके लॉजिस्टिक्स खर्च और CO₂ उत्सर्जन को कम करने के लिए ट्रक स्पेस साझा करने में मदद कर सकता हूँ। मैं आपकी क्या मदद करूँ?",
    addShipmentPrompt: "शिपमेंट जोड़ें",
    showSavingsPrompt: "मेरी बचत दिखाएं",
    whatIsPooling: POOLING_EXPLANATION.hi,
    askName: "आपके कारखाने या निर्माता का नाम क्या है?",
    askWeight: "आपके माल का कुल वजन (किलोग्राम / kg में) कितना है?",
    askDims: "सामान के आयाम क्या हैं (लंबाई x चौड़ाई x ऊंचाई सेमी में)?",
    askDest: "दिल्ली एनसीआर में गंतव्य (डिलीवरी पता) क्या है?",
    askDate: "पिक-अप की तारीख क्या है (YYYY-MM-DD)?",
    successAdded: "बधाई! आपका शिपमेंट पंजीकृत हो गया है और क्लस्टर पूल में शामिल कर लिया गया है। साझा ट्रकों और बचत को देखने के लिए 'पूल शिपमेंट' पर क्लिक करें!",
    fallbackHelp: "मैं 3 बातें समझता हूँ: 'शिपमेंट जोड़ें', 'मेरी बचत दिखाएं', या 'पूलिंग क्या है?'। आप ऊपर दिए गए फॉर्म का भी उपयोग कर सकते हैं।",
    formFallbackText: "फॉर्म का उपयोग करें",
  },
  ta: {
    welcome: "வணக்கம்! நான் உங்கள் டிரக் பூலிங் உதவியாளர். உங்கள் சரக்குச் செலவு மற்றும் CO₂ உமிழ்வைக் குறைக்க டிரக் இடத்தை பகிர்ந்து கொள்ள நான் உதவுகிறேன்.",
    addShipmentPrompt: "புதிய சரக்கு சேர்க்க",
    showSavingsPrompt: "எனது சேமிப்பைக் காட்டு",
    whatIsPooling: POOLING_EXPLANATION.ta,
    askName: "உங்கள் பட்டறை அல்லது உற்பத்தியாளர் பெயர் என்ன?",
    askWeight: "மொத்த எடை (கிலோவில்) என்ன?",
    askDims: "பரிமாணங்கள் (நீளம் x அகலம் x உயரம் செ.மீ இல்)?",
    askDest: "சென்றடையும் இடம் என்ன?",
    askDate: "பிக்கப் தேதி என்ன (YYYY-MM-DD)?",
    successAdded: "அற்புதம்! உங்கள் சரக்கு வெற்றிகரமாக சேர்க்கப்பட்டது. சேமிப்பைக் காண 'Pool Shipments' கிளிக் செய்யவும்!",
    fallbackHelp: "நான் 3 கோரிக்கைகளை ஏற்றுக்கொள்கிறேன்: 'புதிய சரக்கு சேர்க்க', 'எனது சேமிப்பைக் காட்டு', அல்லது 'பகிர்வு என்றால் என்ன?'.",
    formFallbackText: "படிவத்திற்கு மாறவும்",
  },
  kn: {
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಟ್ರಕ್ ಪೂಲಿಂಗ್ ಸಹಾಯಕ. ಸಾರಿಗೆ ವೆಚ್ಚ ಮತ್ತು ಇಂಗಾಲದ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    addShipmentPrompt: "ಹೊಸ ಸಾಗಣೆ ಸೇರಿಸಿ",
    showSavingsPrompt: "ನನ್ನ ಉಳಿತಾಯ ತೋರಿಸಿ",
    whatIsPooling: POOLING_EXPLANATION.kn,
    askName: "ನಿಮ್ಮ ಕಾರ್ಯಾಗಾರದ ಹೆಸರು ಏನು?",
    askWeight: "ಸರಕಿನ ಒಟ್ಟು ತೂಕ ಎಷ್ಟು (ಕೆ.ಜಿ)?",
    askDims: "ಅಳತೆಗಳು (ಉದ್ದ x ಅಗಲ x ಎತ್ತರ ಸೆಂ.ಮೀ)?",
    askDest: "ತಲುಪಬೇಕಾದ ಸ್ಥಳ ಯಾವುದು?",
    askDate: "ಪಿಕಪ್ ದಿನಾಂಕ ಯಾವುದು (YYYY-MM-DD)?",
    successAdded: "ಉತ್ತಮ! ನಿಮ್ಮ ಸಾಗಣೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ. ಹೊಸ ಉಳಿತಾಯವನ್ನು ನೋಡಲು 'Pool Shipments' ಕ್ಲಿಕ್ ಮಾಡಿ!",
    fallbackHelp: "ನಾನು 3 ಅಂಶಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ: 'ಹೊಸ ಸಾಗಣೆ ಸೇರಿಸಿ', 'ನನ್ನ ಉಳಿತಾಯ ತೋರಿಸಿ', ಅಥವಾ 'ಪೂಲಿಂಗ್ ಎಂದರೇನು?'.",
    formFallbackText: "ಫಾರ್ಮ್ ಬಳಸಿ",
  },
  mr: {
    welcome: "नमस्कार! मी तुमचा शेअर्ड ट्रक सहाय्यक आहे. मी लॉजिस्टिक्स खर्च आणि CO₂ कमी करण्यासाठी ट्रक स्पेस सामायिक करण्यात मदत करतो.",
    addShipmentPrompt: "माल जोडा",
    showSavingsPrompt: "माझी बचत दाखवा",
    whatIsPooling: POOLING_EXPLANATION.mr,
    askName: "तुमच्या कारखान्याचे नाव काय आहे?",
    askWeight: "मालाचे एकूण वजन किती आहे (किलोमध्ये)?",
    askDims: "आकारमान (लांबी x रुंदी x उंची सेमी)?",
    askDest: "गंतव्य स्थान काय आहे?",
    askDate: "पिकअप तारीख काय आहे (YYYY-MM-DD)?",
    successAdded: "छान! तुमचा माल नोंदवला गेला आहे. बचत पाहण्यासाठी 'Pool Shipments' वर क्लिक करा!",
    fallbackHelp: "मी ३ गोष्टी समजतो: 'माल जोडा', 'माझी बचत दाखवा', किंवा 'पूलिंग काय आहे?'.",
    formFallbackText: "फॉर्म वापरा",
  },
  gu: {
    welcome: "નમસ્તે! હું તમારો શેર્ડ ટ્રક સહાયક છું. હું પરિવહન ખર્ચ અને CO₂ ઘટાડવા માટે ટ્રકની જગ્યા વહેંચવામાં મદદ કરું છું.",
    addShipmentPrompt: "શિપમેન્ટ ઉમેરો",
    showSavingsPrompt: "મારી બચત બતાવો",
    whatIsPooling: POOLING_EXPLANATION.gu,
    askName: "તમારા ઉત્પાદક કે વર્કશોપનું નામ શું છે?",
    askWeight: "માલનું કુલ વજન કેટલું છે (કિલોમાં)?",
    askDims: "પરિમાણ (લંબાઈ x પહોળાઈ x ઊંચાઈ સેમી)?",
    askDest: "ડિલિવરી સ્થળ કયું છે?",
    askDate: "પિકઅપ તારીખ કઈ છે (YYYY-MM-DD)?",
    successAdded: "સરસ! તમારું શિપમેન્ટ સફળતાપૂર્વક ઉમેરાઈ ગયું છે. બચત જોવા માટે 'Pool Shipments' પર ક્લિક કરો!",
    fallbackHelp: "હું 3 બાબતો સમજુ છું: 'શિપમેન્ટ ઉમેરો', 'મારી બચત બતાવો', અથવા 'પૂલિંગ શું છે?'.",
    formFallbackText: "ફોર્મ વાપરો",
  },
};
