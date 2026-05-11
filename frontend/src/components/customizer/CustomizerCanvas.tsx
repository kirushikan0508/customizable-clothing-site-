"use client";

import React, { useRef, useState, useCallback } from "react";
import { RotateCcw, X } from "lucide-react";
import TShirtSVG from "./TShirtSVG";

interface CanvasProps {
  tshirtColor: string;
  tshirtType: string;
  view: "front" | "back";
  setView: (v: "front" | "back") => void;
  uploadedImage: string | null;
  imagePosition: { x: number; y: number };
  setImagePosition: (p: { x: number; y: number }) => void;
  imageRotation: number;
  imageScale: number;
  customText: string;
  textPosition: { x: number; y: number };
  setTextPosition: (p: { x: number; y: number }) => void;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  onRemoveImage: () => void;
  onRemoveText: () => void;
}

export default function CustomizerCanvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"image" | "text" | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<"image" | "text" | null>(null);

  const handleMouseDown = useCallback(
    (type: "image" | "text", e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pos = type === "image" ? props.imagePosition : props.textPosition;
      setDragOffset({ x: e.clientX - rect.left - pos.x, y: e.clientY - rect.top - pos.y });
      setDragging(type);
      setSelected(type);
    },
    [props.imagePosition, props.textPosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      if (dragging === "image") props.setImagePosition({ x, y });
      else props.setTextPosition({ x, y });
    },
    [dragging, dragOffset, props]
  );

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const handleTouchStart = useCallback(
    (type: "image" | "text", e: React.TouchEvent) => {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pos = type === "image" ? props.imagePosition : props.textPosition;
      setDragOffset({ x: touch.clientX - rect.left - pos.x, y: touch.clientY - rect.top - pos.y });
      setDragging(type);
      setSelected(type);
    },
    [props.imagePosition, props.textPosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragging || !canvasRef.current) return;
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left - dragOffset.x;
      const y = touch.clientY - rect.top - dragOffset.y;
      if (dragging === "image") props.setImagePosition({ x, y });
      else props.setTextPosition({ x, y });
    },
    [dragging, dragOffset, props]
  );

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest("[data-canvas-bg]")) {
      setSelected(null);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      {/* View Toggle */}
      <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-md border border-[#E7D7C9]/50">
        <button
          onClick={() => { props.setView("front"); setSelected(null); }}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            props.view === "front" ? "bg-[#9C6B4F] text-white shadow-sm" : "text-[#8B6B52] hover:bg-[#F5F1EC]"
          }`}
        >
          Front
        </button>
        <button
          onClick={() => { props.setView("back"); setSelected(null); }}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            props.view === "back" ? "bg-[#9C6B4F] text-white shadow-sm" : "text-[#8B6B52] hover:bg-[#F5F1EC]"
          }`}
        >
          Back
        </button>
        <button
          onClick={() => { props.setView(props.view === "front" ? "back" : "front"); setSelected(null); }}
          className="p-2 rounded-full text-[#8B6B52] hover:bg-[#F5F1EC] transition-colors"
          title="Flip view"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Editing indicator */}
      <p className="text-xs text-[#8B6B52] font-medium">
        Editing: <span className="text-[#9C6B4F] font-bold uppercase">{props.view}</span> side
      </p>

      {/* T-Shirt Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full max-w-[420px] aspect-square bg-gradient-to-br from-[#FAFAF8] to-[#F0ECE6] rounded-2xl shadow-xl border border-[#E7D7C9]/40 overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onClick={handleCanvasClick}
        style={{ cursor: dragging ? "grabbing" : "default" }}
      >
        {/* Grid pattern */}
        <div data-canvas-bg className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, #5C4033 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        {/* T-Shirt SVG */}
        <div data-canvas-bg className="absolute inset-4 pointer-events-none">
          <TShirtSVG color={props.tshirtColor} type={props.tshirtType} view={props.view} />
        </div>

        {/* Uploaded Image Overlay */}
        {props.uploadedImage && (
          <div
            style={{
              position: "absolute",
              left: props.imagePosition.x,
              top: props.imagePosition.y,
              transform: `rotate(${props.imageRotation}deg) scale(${props.imageScale})`,
              cursor: dragging === "image" ? "grabbing" : "grab",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleMouseDown("image", e)}
            onTouchStart={(e) => handleTouchStart("image", e)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={props.uploadedImage}
              alt="Custom design"
              className="max-w-[120px] max-h-[120px] pointer-events-none rounded-sm"
              draggable={false}
            />
            {/* Selection border */}
            <div className={`absolute inset-[-4px] border-2 rounded-sm pointer-events-none transition-colors ${
              selected === "image" ? "border-[#9C6B4F]" : "border-dashed border-[#9C6B4F]/40"
            }`} />
            {/* Delete button */}
            {selected === "image" && (
              <button
                onClick={(e) => { e.stopPropagation(); props.onRemoveImage(); setSelected(null); }}
                className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-20 transition-colors"
                title="Remove image"
              >
                <X size={14} strokeWidth={3} />
              </button>
            )}
          </div>
        )}

        {/* Custom Text Overlay */}
        {props.customText && (
          <div
            style={{
              position: "absolute",
              left: props.textPosition.x,
              top: props.textPosition.y,
              fontFamily: props.fontFamily,
              fontSize: `${props.fontSize * 0.45}px`,
              color: props.textColor,
              cursor: dragging === "text" ? "grabbing" : "grab",
              whiteSpace: "pre-wrap",
              textAlign: "center",
              lineHeight: 1.3,
              zIndex: 11,
              textShadow: props.tshirtColor === "#000000" || props.tshirtColor === "#1E3A5F"
                ? "0 0 2px rgba(255,255,255,0.3)" : "0 0 2px rgba(0,0,0,0.1)",
            }}
            onMouseDown={(e) => handleMouseDown("text", e)}
            onTouchStart={(e) => handleTouchStart("text", e)}
          >
            {props.customText}
            {/* Selection border */}
            <div className={`absolute inset-[-4px] border rounded-sm pointer-events-none transition-colors ${
              selected === "text" ? "border-2 border-[#9C6B4F]" : "border-dashed border-[#9C6B4F]/40"
            }`} />
            {/* Delete button */}
            {selected === "text" && (
              <button
                onClick={(e) => { e.stopPropagation(); props.onRemoveText(); setSelected(null); }}
                className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-20 transition-colors"
                title="Remove text"
              >
                <X size={14} strokeWidth={3} />
              </button>
            )}
          </div>
        )}

        {/* View label */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-semibold text-[#8B6B52] uppercase tracking-widest">
          {props.view} view
        </div>
      </div>

      {/* Tip */}
      <p className="text-[11px] text-[#8B6B52]/70 text-center max-w-xs">
        Click on an image or text to select it. Use the <span className="text-red-500 font-bold">✕</span> button to delete. Drag to reposition.
      </p>
    </div>
  );
}
