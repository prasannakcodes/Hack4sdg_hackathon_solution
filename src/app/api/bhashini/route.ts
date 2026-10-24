import { NextRequest, NextResponse } from "next/server";
import { translateTextWithBhashini } from "@/lib/bhashini";
import { SupportedLanguage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    const src = (sourceLang || "en") as SupportedLanguage;
    const tgt = (targetLang || "en") as SupportedLanguage;

    const result = await translateTextWithBhashini(text, src, tgt);

    const hasLiveKeys = !!(
      process.env.BHASHINI_USER_ID && process.env.BHASHINI_API_KEY
    );

    return NextResponse.json({
      success: true,
      translatedText: result.translatedText,
      isMock: result.isMock,
      liveApiConfigured: hasLiveKeys,
      sourceLang: src,
      targetLang: tgt,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Translation error";
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        fallbackAvailable: true,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasLiveKeys = !!(
    process.env.BHASHINI_USER_ID && process.env.BHASHINI_API_KEY
  );

  return NextResponse.json({
    service: "Bhashini AI Language Gateway",
    pipelineInferenceEndpoint:
      "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
    configEndpoint:
      "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline",
    liveApiConfigured: hasLiveKeys,
    supportedLanguages: ["hi", "ta", "kn", "mr", "gu", "en"],
  });
}
