"use client";

import React from "react";
import {
  X,
  ShieldAlert,
  CreditCard,
  FileScan,
  ShieldCheck,
  Radio,
  Bot,
  MessageSquare,
  Clock,
} from "lucide-react";

interface PlannedFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlannedFeaturesModal: React.FC<PlannedFeaturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const plannedItems = [
    {
      title: "Real-time Payments & Escrow Splits",
      desc: "UPI / Net Banking automated milestone disbursement & cost split escrow.",
      icon: CreditCard,
      status: "Marked as Planned (v2.0)",
    },
    {
      title: "Invoice Photo & PDF OCR Document Reading",
      desc: "Automatic weight & dimension extraction via camera scan / GST invoice parsing.",
      icon: FileScan,
      status: "Marked as Planned (v2.0)",
    },
    {
      title: "Consignment Liability & Marine Insurance Integration",
      desc: "Digital policy binding per parcel through national insurance APIs.",
      icon: ShieldCheck,
      status: "Marked as Planned (v2.0)",
    },
    {
      title: "Live Transporter & Telematics Integration",
      desc: "Direct integration with fleet operators, FASTag tolls, and GPS IoT tracking.",
      icon: Radio,
      status: "Marked as Planned (v2.0)",
    },
    {
      title: "Open-ended AI Conversational Agent",
      desc: "Full LLM free-form generative dialog beyond the 3 bounded prototype intents.",
      icon: Bot,
      status: "Marked as Planned (v2.0)",
    },
    {
      title: "WhatsApp & SMS Channel Bot",
      desc: "Direct WhatsApp Business API and vernacular interactive SMS flow.",
      icon: MessageSquare,
      status: "Marked as Planned (v2.0)",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Planned Scope (Do Not Build for Prototype)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          In strict accordance with the project brief guidelines, the following enterprise capabilities are architected in roadmap scope and excluded from this lightweight algorithmic prototype.
        </p>

        <div className="space-y-3">
          {plannedItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-800">{item.title}</span>
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200 flex items-center space-x-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{item.status}</span>
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
