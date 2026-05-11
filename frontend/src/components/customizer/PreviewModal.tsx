"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Move, RotateCw, Maximize2, Type, Image } from "lucide-react";
import TShirtPreview from "./TShirtPreview";

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

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  frontDesign: DesignSide;
  backDesign: DesignSide;
  tshirtColor: string;
  tshirtType: string;
  tshirtSize: string;
}

const CANVAS_SIZE = 420; // canvas reference size in px
const TSHIRT_PRINT_WIDTH_CM = 30; // actual t-shirt printable area width in cm
const TSHIRT_PRINT_HEIGHT_CM = 40; // actual t-shirt printable area height in cm
const PX_TO_CM = TSHIRT_PRINT_WIDTH_CM / CANVAS_SIZE;

// T-shirt printable zone (relative to canvas)
const PRINT_ZONE = { left: 95, top: 60, right: 325, bottom: 280 };
const PRINT_ZONE_W = PRINT_ZONE.right - PRINT_ZONE.left; // ~230px
const PRINT_ZONE_H = PRINT_ZONE.bottom - PRINT_ZONE.top; // ~220px

function pxToCm(px: number): string {
  return (px * PX_TO_CM).toFixed(1);
}

function getPositionFromEdges(pos: { x: number; y: number }) {
  const fromLeft = pos.x - PRINT_ZONE.left;
  const fromTop = pos.y - PRINT_ZONE.top;
  const fromRight = PRINT_ZONE.right - pos.x;
  const fromBottom = PRINT_ZONE.bottom - pos.y;
  return {
    fromLeft: pxToCm(Math.max(0, fromLeft)),
    fromTop: pxToCm(Math.max(0, fromTop)),
    fromRight: pxToCm(Math.max(0, fromRight)),
    fromBottom: pxToCm(Math.max(0, fromBottom)),
    centerX: pxToCm(Math.abs(fromLeft - PRINT_ZONE_W / 2)),
    centerY: pxToCm(Math.abs(fromTop - PRINT_ZONE_H / 2)),
  };
}

const colorNames: Record<string, string> = {
  "#FFFFFF": "White", "#000000": "Black", "#DC2626": "Red", "#2563EB": "Blue",
  "#16A34A": "Green", "#EAB308": "Yellow", "#1E3A5F": "Navy", "#6B7280": "Grey",
};

export default function PreviewModal({ isOpen, onClose, frontDesign, backDesign, tshirtColor, tshirtType, tshirtSize }: PreviewModalProps) {

  const renderMeasurements = (design: DesignSide, side: string) => {
    const hasImage = !!design.image;
    const hasText = !!design.text;
    if (!hasImage && !hasText) {
      return (
        <div className="text-center py-4">
          <p className="text-xs text-[#8B6B52]/60 italic">No design on {side} side</p>
        </div>
      );
    }

    const imgPos = hasImage ? getPositionFromEdges(design.imagePosition) : null;
    const txtPos = hasText ? getPositionFromEdges(design.textPosition) : null;

    return (
      <div className="space-y-3">
        {/* Image measurements */}
        {hasImage && imgPos && (
          <div className="bg-[#F5F1EC] rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Image size={13} className="text-[#9C6B4F]" />
              <span className="text-[11px] font-bold text-[#5C4033] uppercase tracking-wider">Image Placement</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Top</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{imgPos.fromTop} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Left</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{imgPos.fromLeft} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Bottom</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{imgPos.fromBottom} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Right</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{imgPos.fromRight} cm</span>
              </div>
            </div>
            <div className="border-t border-[#E7D7C9]/60 pt-1.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52] flex items-center gap-1"><RotateCw size={9} /> Rotation</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{design.imageRotation}°</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52] flex items-center gap-1"><Maximize2 size={9} /> Scale</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{Math.round(design.imageScale * 100)}%</span>
              </div>
            </div>
            <div className="border-t border-[#E7D7C9]/60 pt-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52] flex items-center gap-1"><Move size={9} /> Off-Center</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{imgPos.centerX} cm × {imgPos.centerY} cm</span>
              </div>
            </div>
          </div>
        )}

        {/* Text measurements */}
        {hasText && txtPos && (
          <div className="bg-[#F5F1EC] rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Type size={13} className="text-[#9C6B4F]" />
              <span className="text-[11px] font-bold text-[#5C4033] uppercase tracking-wider">Text Placement</span>
            </div>
            <div className="bg-white/60 rounded-lg px-3 py-1.5 mb-1">
              <p className="text-[11px] text-[#5C4033] font-medium truncate" style={{ fontFamily: design.fontFamily }}>
                &ldquo;{design.text}&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Top</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{txtPos.fromTop} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Left</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{txtPos.fromLeft} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Bottom</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{txtPos.fromBottom} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">From Right</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{txtPos.fromRight} cm</span>
              </div>
            </div>
            <div className="border-t border-[#E7D7C9]/60 pt-1.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">Font</span>
                <span className="text-[10px] font-bold text-[#5C4033]">{design.fontFamily.split(",")[0].replace(/'/g, "")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52]">Size</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{design.fontSize}px</span>
              </div>
              <div className="flex items-center justify-between col-span-2">
                <span className="text-[10px] text-[#8B6B52]">Color</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-[#E7D7C9]" style={{ backgroundColor: design.textColor }} />
                  <span className="text-[10px] font-bold text-[#5C4033] font-mono">{design.textColor}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-[#E7D7C9]/60 pt-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B6B52] flex items-center gap-1"><Move size={9} /> Off-Center</span>
                <span className="text-[10px] font-bold text-[#5C4033] font-mono">{txtPos.centerX} cm × {txtPos.centerY} cm</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#5C4033] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler size={20} className="text-[#C69C72]" />
                <div>
                  <h2 className="font-serif text-lg font-bold">Design Preview & Measurements</h2>
                  <p className="text-[11px] text-[#C69C72]">Detailed placement information for your custom design</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-70px)] p-6">
              {/* T-shirt info bar */}
              <div className="flex flex-wrap items-center gap-4 mb-6 bg-[#F5F1EC] rounded-xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 ${tshirtColor === "#FFFFFF" ? "border-gray-300" : "border-transparent"}`} style={{ backgroundColor: tshirtColor }} />
                  <span className="text-xs font-medium text-[#5C4033]">{colorNames[tshirtColor] || tshirtColor}</span>
                </div>
                <span className="text-[#E7D7C9]">|</span>
                <span className="text-xs font-medium text-[#5C4033]">{tshirtType}</span>
                <span className="text-[#E7D7C9]">|</span>
                <span className="text-xs font-medium text-[#5C4033]">Size: {tshirtSize}</span>
                <span className="text-[#E7D7C9]">|</span>
                <span className="text-[10px] text-[#8B6B52]">Print Area: {TSHIRT_PRINT_WIDTH_CM}×{TSHIRT_PRINT_HEIGHT_CM} cm</span>
              </div>

              {/* Front & Back side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FRONT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#9C6B4F]" />
                    <h3 className="text-sm font-bold text-[#5C4033] uppercase tracking-wider font-serif">Front Side</h3>
                  </div>
                  <TShirtPreview design={frontDesign} tshirtColor={tshirtColor} tshirtType={tshirtType} view="front" size={320} showPrintZone />
                  {renderMeasurements(frontDesign, "front")}
                </div>

                {/* BACK */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C69C72]" />
                    <h3 className="text-sm font-bold text-[#5C4033] uppercase tracking-wider font-serif">Back Side</h3>
                  </div>
                  <TShirtPreview design={backDesign} tshirtColor={tshirtColor} tshirtType={tshirtType} view="back" size={320} showPrintZone />
                  {renderMeasurements(backDesign, "back")}
                </div>
              </div>

              {/* Measurement guide */}
              <div className="mt-6 bg-gradient-to-r from-[#F5F1EC] to-[#E7D7C9]/30 rounded-xl p-4 border border-[#E7D7C9]/50">
                <h4 className="text-[11px] font-bold text-[#5C4033] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Ruler size={12} className="text-[#9C6B4F]" />
                  Measurement Guide
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] text-[#8B6B52]">
                  <div className="flex items-start gap-2">
                    <Move size={11} className="text-[#9C6B4F] mt-0.5 flex-shrink-0" />
                    <span><strong className="text-[#5C4033]">Position</strong> — Distance from each edge of the printable area in centimeters</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Maximize2 size={11} className="text-[#9C6B4F] mt-0.5 flex-shrink-0" />
                    <span><strong className="text-[#5C4033]">Off-Center</strong> — How far the element is from the center of the t-shirt</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <RotateCw size={11} className="text-[#9C6B4F] mt-0.5 flex-shrink-0" />
                    <span><strong className="text-[#5C4033]">Rotation & Scale</strong> — Angle and size adjustments applied to the design</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
