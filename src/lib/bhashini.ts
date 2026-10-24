import { SupportedLanguage } from "@/types";
import { POOLING_EXPLANATION } from "./constants";

export interface BhashiniTranslateRequest {
  text: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
}

export interface BhashiniTranslateResponse {
  translatedText: string;
  isMock: boolean;
  serviceId?: string;
  error?: string;
}

// Built-in dictionary for key prototype phrases across Hindi, Tamil, Kannada, Marathi, Gujarati, English
const FALLBACK_DICTIONARY: Record<
  string,
  Partial<Record<SupportedLanguage, string>>
> = {
  "what is pooling?": {
    en: POOLING_EXPLANATION.en,
    hi: POOLING_EXPLANATION.hi,
    ta: POOLING_EXPLANATION.ta,
    kn: POOLING_EXPLANATION.kn,
    mr: POOLING_EXPLANATION.mr,
    gu: POOLING_EXPLANATION.gu,
  },
  "what is truck pooling": {
    en: POOLING_EXPLANATION.en,
    hi: POOLING_EXPLANATION.hi,
    ta: POOLING_EXPLANATION.ta,
    kn: POOLING_EXPLANATION.kn,
    mr: POOLING_EXPLANATION.mr,
    gu: POOLING_EXPLANATION.gu,
  },
  "पूलिंग क्या है?": {
    en: POOLING_EXPLANATION.en,
    hi: POOLING_EXPLANATION.hi,
    ta: POOLING_EXPLANATION.ta,
    kn: POOLING_EXPLANATION.kn,
    mr: POOLING_EXPLANATION.mr,
    gu: POOLING_EXPLANATION.gu,
  },
  "பகிர்வு என்றால் என்ன?": {
    en: POOLING_EXPLANATION.en,
    hi: POOLING_EXPLANATION.hi,
    ta: POOLING_EXPLANATION.ta,
    kn: POOLING_EXPLANATION.kn,
    mr: POOLING_EXPLANATION.mr,
    gu: POOLING_EXPLANATION.gu,
  },
  "പൂളിംഗ് എന്നാൽ എന്താണ്?": {
    en: POOLING_EXPLANATION.en,
    hi: POOLING_EXPLANATION.hi,
    ta: POOLING_EXPLANATION.ta,
    kn: POOLING_EXPLANATION.kn,
    mr: POOLING_EXPLANATION.mr,
    gu: POOLING_EXPLANATION.gu,
  },
};

/**
 * Server-side helper to translate text using the official Bhashini ULCA API
 * with automatic fallback to high-quality localized dictionaries.
 */
export async function translateTextWithBhashini(
  text: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage
): Promise<BhashiniTranslateResponse> {
  if (sourceLang === targetLang || !text.trim()) {
    return { translatedText: text, isMock: false };
  }

  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;
  const pipelineId =
    process.env.BHASHINI_PIPELINE_ID || "64392f96daac500b55c543d7";

  // Check if live Bhashini credentials are provided
  if (userId && apiKey) {
    try {
      // Step A: Request pipeline configuration from ULCA
      const configRes = await fetch(
        "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline",
        {
          method: "POST",
          headers: {
            userID: userId,
            ulcaApiKey: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pipelineTasks: [
              {
                taskType: "translation",
                config: {
                  language: {
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang,
                  },
                },
              },
            ],
            pipelineRequestConfig: {
              pipelineId: pipelineId,
            },
          }),
        }
      );

      if (configRes.ok) {
        const configData = await configRes.json();
        const callbackUrl =
          configData?.pipelineInferenceAPIEndPoint?.callbackUrl ||
          "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";
        const authKeyName =
          configData?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name ||
          "Authorization";
        const authKeyValue =
          configData?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;
        const serviceId =
          configData?.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;

        if (authKeyValue && serviceId) {
          // Step B: Inference compute request
          const computeRes = await fetch(callbackUrl, {
            method: "POST",
            headers: {
              [authKeyName]: authKeyValue,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pipelineTasks: [
                {
                  taskType: "translation",
                  config: {
                    language: {
                      sourceLanguage: sourceLang,
                      targetLanguage: targetLang,
                    },
                    serviceId: serviceId,
                  },
                },
              ],
              inputData: {
                input: [
                  {
                    source: text,
                  },
                ],
              },
            }),
          });

          if (computeRes.ok) {
            const computeData = await computeRes.json();
            const translated =
              computeData?.pipelineResponse?.[0]?.output?.[0]?.target;
            if (translated) {
              return {
                translatedText: translated,
                isMock: false,
                serviceId,
              };
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("Bhashini live call failed, falling back to local handler:", msg);
    }
  }

  // Graceful fallback: check local dictionary for key phrases
  const lower = text.trim().toLowerCase();
  for (const [key, translations] of Object.entries(FALLBACK_DICTIONARY)) {
    if (lower.includes(key.toLowerCase()) && translations[targetLang]) {
      return {
        translatedText: translations[targetLang]!,
        isMock: true,
      };
    }
  }

  // Common phrases fallback
  const commonFallbacks: Record<string, Record<SupportedLanguage, string>> = {
    "shipment added successfully": {
      en: "Shipment added successfully! Click 'Pool Shipments' to recalculate.",
      hi: "शिपमेंट सफलतापूर्वक जोड़ा गया! पुनर्गणना के लिए 'पूल शिपमेंट' पर क्लिक करें।",
      ta: "சரக்கு வெற்றிகரமாக சேர்க்கப்பட்டது! மீண்டும் கணக்கிட 'Pool Shipments' கிளிக் செய்யவும்.",
      kn: "ಸಾಗಣೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ! ಮರು ಲೆಕ್ಕಾಚಾರ ಮಾಡಲು 'Pool Shipments' ಕ್ಲಿಕ್ ಮಾಡಿ.",
      mr: "मालवाहतूक यशस्वीरित्या जोडली गेली! पुन्हा मोजण्यासाठी 'Pool Shipments' वर क्लिक करा.",
      gu: "શિપમેન્ટ સફળતાપૂર્વક ઉમેરાયું! ફરીથી ગણતરી કરવા 'Pool Shipments' પર ક્લિક કરો.",
    },
    "here is your savings card": {
      en: "Here is your calculated savings card for your shipment:",
      hi: "यहाँ आपके शिपमेंट के लिए बचत कार्ड है:",
      ta: "உங்கள் சரக்குக்கான சேமிப்பு அட்டை இதோ:",
      kn: "ನಿಮ್ಮ ಸಾಗಣೆಯ ಉಳಿತಾಯ ಕಾರ್ಡ್ ಇಲ್ಲಿದೆ:",
      mr: "येथे तुमच्या मालाचे बचत कार्ड आहे:",
      gu: "અહીં તમારા શિપમેન્ટ માટેનું બચત કાર્ડ છે:",
    },
  };

  for (const [key, mapping] of Object.entries(commonFallbacks)) {
    if (lower.includes(key) && mapping[targetLang]) {
      return {
        translatedText: mapping[targetLang],
        isMock: true,
      };
    }
  }

  // If no exact dictionary hit, return original text safely
  return {
    translatedText: text,
    isMock: true,
  };
}
