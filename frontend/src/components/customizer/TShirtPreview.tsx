"use client";

import React from "react";
import TShirtSVG from "./TShirtSVG";

interface DesignSide {
  image: string | null;
  imagePosition: { x: number; y: number };
  imageRotation: number;
  imageScale: number;
  text: string;
  textPosition: { x: number; y: number };
  fontFamily: string;
  fontSize: number;
  textColor: string;
}

interface TShirtPreviewProps {
  design: DesignSide;
  tshirtColor: string;
  tshirtType: string;
  view: "front" | "back";
  size?: number; // rendered size in px (the container size)
  showPrintZone?: boolean;
}

const CANVAS_REF = 420; // reference canvas size that positions are based on

export default function TShirtPreview({
  design,
  tshirtColor,
  tshirtType,
  view,
  size = 120,
  showPrintZone = false,
}: TShirtPreviewProps) {
  const scale = size / CANVAS_REF;

  return (
    <div
      className="relative overflow-hidden bg-white rounded-xl shadow-inner"
      style={{ width: size, height: size }}
    >
      {/* Scaled inner container - renders at 420px then scales down */}
      <div
        style={{
          width: CANVAS_REF,
          height: CANVAS_REF,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] to-[#F0ECE6]" />

        {/* Print zone indicator */}
        {showPrintZone && (
          <div
            className="absolute border border-dashed border-[#9C6B4F]/20 rounded-sm z-[1]"
            style={{ left: 95, top: 60, width: 230, height: 220 }}
          />
        )}

        {/* T-Shirt SVG - same as canvas */}
        <div className="absolute" style={{ left: 16, top: 16, right: 16, bottom: 16 }}>
          <TShirtSVG color={tshirtColor} type={tshirtType} view={view} />
        </div>

        {/* Image overlay - exact same positioning as canvas */}
        {design.image && (
          <div
            style={{
              position: "absolute",
              left: design.imagePosition.x,
              top: design.imagePosition.y,
              transform: `rotate(${design.imageRotation}deg) scale(${design.imageScale})`,
              zIndex: 10,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={design.image}
              alt=""
              className="pointer-events-none rounded-sm"
              style={{ maxWidth: 120, maxHeight: 120 }}
              draggable={false}
            />
          </div>
        )}

        {/* Text overlay - exact same positioning as canvas */}
        {design.text && (
          <div
            style={{
              position: "absolute",
              left: design.textPosition.x,
              top: design.textPosition.y,
              fontFamily: design.fontFamily,
              fontSize: `${design.fontSize * 0.45}px`,
              color: design.textColor,
              whiteSpace: "pre-wrap",
              textAlign: "center",
              lineHeight: 1.3,
              zIndex: 11,
              textShadow:
                tshirtColor === "#000000" || tshirtColor === "#1E3A5F"
                  ? "0 0 2px rgba(255,255,255,0.3)"
                  : "0 0 2px rgba(0,0,0,0.1)",
            }}
          >
            {design.text}
          </div>
        )}
      </div>
    </div>
  );
}
