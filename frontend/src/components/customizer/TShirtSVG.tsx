"use client";

import React from "react";

interface TShirtSVGProps {
  color: string;
  type: string;
  view: "front" | "back";
}

export default function TShirtSVG({ color, type, view }: TShirtSVGProps) {
  const renderNeckline = () => {
    if (view === "back") {
      return <path d="M145,45 Q160,55 175,45" fill="none" stroke={getDarkerColor(color)} strokeWidth="1.5" />;
    }
    switch (type) {
      case "V-Neck":
        return <path d="M145,45 L160,80 L175,45" fill={getDarkerColor(color)} stroke={getDarkerColor(color)} strokeWidth="1" />;
      case "Polo":
        return (
          <>
            <path d="M145,45 Q160,60 175,45" fill={getDarkerColor(color)} stroke={getDarkerColor(color)} strokeWidth="1" />
            <rect x="155" y="45" width="10" height="25" rx="2" fill={getDarkerColor(color)} stroke={getStrokeColor(color)} strokeWidth="0.5" />
            <circle cx="160" cy="55" r="1.5" fill={getStrokeColor(color)} />
            <circle cx="160" cy="63" r="1.5" fill={getStrokeColor(color)} />
          </>
        );
      default:
        return <path d="M145,45 Q160,58 175,45" fill={getDarkerColor(color)} stroke={getDarkerColor(color)} strokeWidth="1" />;
    }
  };

  const renderSleeves = () => {
    switch (type) {
      case "Full Sleeve":
        return (
          <>
            <path d="M95,55 L50,95 L55,170 L75,168 L90,105 L95,90" fill={color} stroke={getDarkerColor(color)} strokeWidth="1.5" />
            <path d="M225,55 L270,95 L265,170 L245,168 L230,105 L225,90" fill={color} stroke={getDarkerColor(color)} strokeWidth="1.5" />
            <path d="M55,165 Q62,172 75,168" fill="none" stroke={getDarkerColor(color)} strokeWidth="1" />
            <path d="M265,165 Q258,172 245,168" fill="none" stroke={getDarkerColor(color)} strokeWidth="1" />
          </>
        );
      case "Sleeveless":
        return (
          <>
            <path d="M100,55 Q95,70 98,90" fill="none" stroke={getDarkerColor(color)} strokeWidth="1.5" />
            <path d="M220,55 Q225,70 222,90" fill="none" stroke={getDarkerColor(color)} strokeWidth="1.5" />
          </>
        );
      default:
        return (
          <>
            <path d="M95,55 L55,85 L65,115 L95,100 L95,90" fill={color} stroke={getDarkerColor(color)} strokeWidth="1.5" />
            <path d="M225,55 L265,85 L255,115 L225,100 L225,90" fill={color} stroke={getDarkerColor(color)} strokeWidth="1.5" />
            <path d="M65,110 Q75,118 95,100" fill="none" stroke={getDarkerColor(color)} strokeWidth="0.8" />
            <path d="M255,110 Q245,118 225,100" fill="none" stroke={getDarkerColor(color)} strokeWidth="0.8" />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 320 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path
        d={type === "Sleeveless"
          ? "M100,55 L100,280 Q160,295 220,280 L220,55 Q200,40 175,45 Q160,58 145,45 Q120,40 100,55 Z"
          : "M95,55 L95,280 Q160,295 225,280 L225,55 Q200,40 175,45 Q160,58 145,45 Q120,40 95,55 Z"
        }
        fill={color}
        stroke={getDarkerColor(color)}
        strokeWidth="1.5"
      />
      {/* Sleeves */}
      {renderSleeves()}
      {/* Neckline */}
      {renderNeckline()}
      {/* Bottom hem */}
      <path
        d={type === "Sleeveless"
          ? "M100,278 Q160,293 220,278"
          : "M95,278 Q160,293 225,278"
        }
        fill="none"
        stroke={getDarkerColor(color)}
        strokeWidth="0.8"
      />
      {/* Side seams */}
      <line x1={type === "Sleeveless" ? "100" : "95"} y1="100" x2={type === "Sleeveless" ? "100" : "95"} y2="275" stroke={getDarkerColor(color)} strokeWidth="0.3" opacity="0.4" />
      <line x1={type === "Sleeveless" ? "220" : "225"} y1="100" x2={type === "Sleeveless" ? "220" : "225"} y2="275" stroke={getDarkerColor(color)} strokeWidth="0.3" opacity="0.4" />
    </svg>
  );
}

function getDarkerColor(hex: string): string {
  const darkenMap: Record<string, string> = {
    "#FFFFFF": "#E0E0E0", "#000000": "#1a1a1a", "#DC2626": "#991B1B",
    "#2563EB": "#1D4ED8", "#16A34A": "#15803D", "#EAB308": "#CA8A04",
    "#1E3A5F": "#0F2942", "#6B7280": "#4B5563",
  };
  return darkenMap[hex] || hex;
}

function getStrokeColor(hex: string): string {
  if (hex === "#000000" || hex === "#1E3A5F") return "#444";
  return "#00000022";
}
