"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  PackagePlus,
  IndianRupee,
  HelpCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import {
  ChatMessage,
  SupportedLanguage,
  MakerShipment,
  PoolingResult,
  MakerSavings,
} from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { CHAT_STRINGS, detectIntent } from "@/lib/chatBotLogic";

interface ChatbotWidgetProps {
  shipments: MakerShipment[];
  onAddShipment: (shipment: MakerShipment) => void;
  poolingResult: PoolingResult;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenForm: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  shipments: _shipments,
  onAddShipment,
  poolingResult,
  selectedLanguage,
  onLanguageChange,
  onOpenForm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveApiActive, setLiveApiActive] = useState<boolean | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Micro-form state for "Add a Shipment" conversational intent
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState("");
  const [addWeight, setAddWeight] = useState<number | "">("");
  const [addL, setAddL] = useState<number | "">("");
  const [addW, setAddW] = useState<number | "">("");
  const [addH, setAddH] = useState<number | "">("");
  const [addDest, setAddDest] = useState(
    "ICD Patparganj Freight Complex, Delhi NCR"
  );
  const [addDate, setAddDate] = useState("2026-10-25");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition support & Bhashini API health on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        const langMap: Record<SupportedLanguage, string> = {
          hi: "hi-IN",
          ta: "ta-IN",
          kn: "kn-IN",
          mr: "mr-IN",
          gu: "gu-IN",
          en: "en-IN",
        };
        recognition.lang = langMap[selectedLanguage] || "en-IN";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      // Check Bhashini status
      fetch("/api/bhashini")
        .then((res) => res.json())
        .then((data) => {
          setLiveApiActive(data.liveApiConfigured);
        })
        .catch(() => setLiveApiActive(false));
    }
  }, [selectedLanguage]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const strings = CHAT_STRINGS[selectedLanguage] || CHAT_STRINGS.en;
      setMessages([
        {
          id: "welcome-1",
          sender: "bot",
          text: strings.welcome,
          language: selectedLanguage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [selectedLanguage]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showAddForm]);

  const toggleVoiceRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type or use Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const langMap: Record<SupportedLanguage, string> = {
          hi: "hi-IN",
          ta: "ta-IN",
          kn: "kn-IN",
          mr: "mr-IN",
          gu: "gu-IN",
          en: "en-IN",
        };
        recognitionRef.current.lang = langMap[selectedLanguage] || "en-IN";
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<SupportedLanguage, string> = {
      hi: "hi-IN",
      ta: "ta-IN",
      kn: "kn-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      en: "en-US",
    };
    utterance.lang = langMap[selectedLanguage] || "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || inputValue).trim();
    if (!rawText) return;

    setInputValue("");

    // Add user message to chat
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: rawText,
      language: selectedLanguage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);

    const intent = detectIntent(rawText);
    const strings = CHAT_STRINGS[selectedLanguage] || CHAT_STRINGS.en;

    // Handle 3 bounded intents:
    if (intent === "what_is_pooling") {
      const explanation = strings.whatIsPooling;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: explanation,
          language: selectedLanguage,
          intent: "what_is_pooling",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else if (intent === "show_savings") {
      // Find latest maker's savings or top maker
      const makerSavingsList = poolingResult.makerSavings;
      const primarySavings =
        makerSavingsList[0] || {
          makerName: "Moradabad Brass Artwares",
          costSavedInr: 6160,
          percentageSaved: 44.0,
          costSavedPerKgInr: 4.4,
          co2AvoidedKg: 59.46,
        };

      const savingsSummary =
        selectedLanguage === "hi"
          ? `आपके शिपमेंट (${primarySavings.makerName}) के लिए बचत:
• लागत बचत: ₹${primarySavings.costSavedInr.toLocaleString()} (${primarySavings.percentageSaved}%)
• प्रति किलो बचत: ₹${primarySavings.costSavedPerKgInr}/kg
• CO₂ उत्सर्जन में कमी: ${primarySavings.co2AvoidedKg} kg CO₂
साझा ट्रक आवंटन से आपका माल बिना किसी देरी के समय पर पहुंचेगा!`
          : `Savings breakdown for ${primarySavings.makerName}:
• Total Cost Saved: ₹${primarySavings.costSavedInr.toLocaleString()} (${primarySavings.percentageSaved}%)
• Cost Saved per kg: ₹${primarySavings.costSavedPerKgInr}/kg
• Diesel CO₂ Avoided: ${primarySavings.co2AvoidedKg} kg CO₂
All goods guaranteed space in Shared Truck Alpha.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: savingsSummary,
          language: selectedLanguage,
          intent: "show_savings",
          data: primarySavings,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else if (intent === "add_shipment") {
      setShowAddForm(true);
      const promptText =
        selectedLanguage === "hi"
          ? "नया शिपमेंट जोड़ने के लिए कृपया नीचे दिए गए विवरण भरें या चैट में बताएं (नाम, वजन, आकार, गंतव्य, तारीख):"
          : "Please enter your shipment details below (Name, weight in kg, dimensions in cm, destination, and date):";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: promptText,
          language: selectedLanguage,
          intent: "add_shipment",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else {
      // Fallback response for unmapped query
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: strings.fallbackHelp,
          language: selectedLanguage,
          intent: "unknown",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  const handleMicroFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addWeight || !addL || !addW || !addH) {
      alert("Please fill in maker name, weight, and dimensions.");
      return;
    }

    const volM3 = Number(
      ((Number(addL) * Number(addW) * Number(addH)) / 1_000_000).toFixed(2)
    );

    const newShipment: MakerShipment = {
      id: `maker-chat-${Date.now()}`,
      makerName: addName.trim(),
      category: "Handicrafts & Decor",
      weightKg: Number(addWeight),
      dimensionsCm: {
        length: Number(addL),
        width: Number(addW),
        height: Number(addH),
      },
      volumeM3: volM3,
      origin: "Moradabad Artisan Cluster, Uttar Pradesh",
      destination: addDest,
      pickupDate: addDate || "2026-10-25",
      approved: true,
    };

    onAddShipment(newShipment);
    setShowAddForm(false);

    // Reset micro-form
    setAddName("");
    setAddWeight("");
    setAddL("");
    setAddW("");
    setAddH("");

    const strings = CHAT_STRINGS[selectedLanguage] || CHAT_STRINGS.en;
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: strings.successAdded,
        language: selectedLanguage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white p-4 rounded-full shadow-xl shadow-emerald-600/30 flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 group cursor-pointer"
          title="Open Vernacular Logistics Assistant (Bhashini AI)"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-emerald-600 rounded-full animate-ping"></span>
          </div>
          <span className="text-xs font-bold hidden sm:inline pr-1">
            Bhashini Assistant
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-bold leading-tight">
                    Bhashini Vernacular Chat
                  </span>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                    {liveApiActive ? "Bhashini Live" : "Smart Fallback"}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-100/80 flex items-center space-x-1">
                  <span>3 Scoped Intents</span>
                  <span>•</span>
                  <span>Hindi / Tamil / Kannada</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) =>
                  onLanguageChange(e.target.value as SupportedLanguage)
                }
                className="bg-emerald-900/60 text-emerald-100 text-xs font-medium rounded-lg px-2 py-1 border border-emerald-500/40 focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900">
                    {l.nativeName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="max-w-[82%]">
                  <div
                    className={`p-3 rounded-2xl relative shadow-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-200/80"
                    }`}
                  >
                    {msg.text}

                    {/* Savings Card Embed inside chat message if intent was show_savings */}
                    {msg.intent === "show_savings" && msg.data && (() => {
                      const savings = msg.data as MakerSavings;
                      return (
                        <div className="mt-2.5 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-slate-800 text-[11px] space-y-1">
                          <div className="font-bold text-emerald-950 flex items-center justify-between">
                            <span>{savings.makerName}</span>
                            <span className="text-emerald-700 font-black">
                              {savings.percentageSaved}% Saved
                            </span>
                          </div>
                          <div className="text-slate-600">
                            Cash Saved: <strong>₹{savings.costSavedInr?.toLocaleString()}</strong>
                          </div>
                          <div className="text-slate-600">
                            CO₂ Avoided: <strong>{savings.co2AvoidedKg} kg</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div
                    className={`mt-1 flex items-center space-x-2 text-[10px] text-slate-400 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === "bot" && (
                      <button
                        onClick={() => handleTextToSpeech(msg.text)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Listen to this message"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Embedded Micro-Form inside Chat when "Add a shipment" is triggered */}
            {showAddForm && (
              <form
                onSubmit={handleMicroFormSubmit}
                className="bg-white p-3.5 rounded-2xl border border-emerald-300 shadow-sm space-y-2.5 text-xs animate-in fade-in"
              >
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <PackagePlus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quick Shipment Entry</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Maker / Workshop Name *"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    min={10}
                    max={3500}
                    placeholder="Weight (kg) *"
                    value={addWeight}
                    onChange={(e) =>
                      setAddWeight(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="date"
                    required
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <input
                    type="number"
                    required
                    placeholder="L (cm)"
                    value={addL}
                    onChange={(e) =>
                      setAddL(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    required
                    placeholder="W (cm)"
                    value={addW}
                    onChange={(e) =>
                      setAddW(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    required
                    placeholder="H (cm)"
                    value={addH}
                    onChange={(e) =>
                      setAddH(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <select
                    value={addDest}
                    onChange={(e) => setAddDest(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ICD Patparganj Freight Complex, Delhi NCR">
                      ICD Patparganj, Delhi NCR
                    </option>
                    <option value="Okhla Industrial Area Phase-III, New Delhi">
                      Okhla Industrial Area, New Delhi
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Add to Corridor Pool</span>
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Intent Chips (3 intents only) */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200/80 flex items-center space-x-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSendMessage(CHAT_STRINGS[selectedLanguage]?.addShipmentPrompt || "Add a shipment")}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium rounded-full border border-slate-200 shrink-0 transition-colors flex items-center space-x-1"
            >
              <PackagePlus className="w-3 h-3 text-emerald-600" />
              <span>{CHAT_STRINGS[selectedLanguage]?.addShipmentPrompt || "Add a shipment"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage(CHAT_STRINGS[selectedLanguage]?.showSavingsPrompt || "Show my savings")}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium rounded-full border border-slate-200 shrink-0 transition-colors flex items-center space-x-1"
            >
              <IndianRupee className="w-3 h-3 text-emerald-600" />
              <span>{CHAT_STRINGS[selectedLanguage]?.showSavingsPrompt || "Show my savings"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage("What is pooling?")}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium rounded-full border border-slate-200 shrink-0 transition-colors flex items-center space-x-1"
            >
              <HelpCircle className="w-3 h-3 text-emerald-600" />
              <span>{selectedLanguage === "hi" ? "पूलिंग क्या है?" : "What is pooling?"}</span>
            </button>

            {/* Fallback to form button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenForm();
              }}
              className="px-2 py-1 bg-slate-200/70 hover:bg-slate-300 text-slate-600 font-medium rounded-full shrink-0 transition-colors flex items-center space-x-1"
              title="Fall back to standard form"
            >
              <FileText className="w-3 h-3" />
              <span>Form Fallback</span>
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
              title={isListening ? "Listening... click to stop" : "Speak in your language (ASR)"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={
                isListening
                  ? "Listening in your language..."
                  : selectedLanguage === "hi"
                  ? "संदेश टाइप करें या बोलें..."
                  : "Type or speak in your language..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
