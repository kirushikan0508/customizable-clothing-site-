"use client";

import React, { useRef } from "react";
import { Upload, Type, Palette, RotateCw, Trash2 } from "lucide-react";

interface CustomizerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentView: "front" | "back";
  onImageUpload: (file: File) => void;
  uploadedImage: string | null;
  imageRotation: number;
  imageScale: number;
  setImageRotation: (r: number) => void;
  setImageScale: (s: number) => void;
  onRemoveImage: () => void;
  customText: string;
  setCustomText: (t: string) => void;
  fontFamily: string;
  setFontFamily: (f: string) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  textColor: string;
  setTextColor: (c: string) => void;
  onRemoveText: () => void;
  tshirtColor: string;
  setTshirtColor: (c: string) => void;
  tshirtType: string;
  setTshirtType: (t: string) => void;
  tshirtSize: string;
  setTshirtSize: (s: string) => void;
}

const tabs = [
  { id: "upload", label: "Upload Image", icon: Upload },
  { id: "text", label: "Add Text", icon: Type },
  { id: "options", label: "T-Shirt Options", icon: Palette },
];

const colorSwatches = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#DC2626" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#16A34A" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Grey", value: "#6B7280" },
];

const tshirtTypes = ["Round Neck", "V-Neck", "Polo", "Full Sleeve", "Sleeveless"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const fonts = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Playfair", value: "'Playfair Display', serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Courier", value: "'Courier New', monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Impact", value: "Impact, sans-serif" },
];

export default function CustomizerSidebar(props: CustomizerSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) props.onImageUpload(file);
    if (e.target) e.target.value = "";
  };

  const sideLabel = props.currentView === "front" ? "Front" : "Back";

  return (
    <div className="w-full lg:w-[320px] bg-white rounded-2xl shadow-lg border border-[#E7D7C9]/50 overflow-hidden flex-shrink-0">
      {/* Side indicator */}
      <div className="bg-[#F5F1EC] px-4 py-2 flex items-center justify-center gap-2 border-b border-[#E7D7C9]/50">
        <div className={`w-2 h-2 rounded-full ${props.currentView === "front" ? "bg-[#9C6B4F]" : "bg-[#C69C72]"}`} />
        <span className="text-[11px] font-bold text-[#5C4033] uppercase tracking-widest">
          Editing {sideLabel} Side
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7D7C9]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => props.setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3.5 px-2 text-xs font-medium transition-all duration-200 ${
              props.activeTab === tab.id
                ? "bg-[#9C6B4F] text-white"
                : "text-[#8B6B52] hover:bg-[#F5F1EC]"
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 max-h-[calc(100vh-380px)] overflow-y-auto custom-scrollbar">
        {/* Upload Image Tab */}
        {props.activeTab === "upload" && (
          <div className="space-y-5">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#C69C72] rounded-xl py-8 flex flex-col items-center gap-3 hover:bg-[#F5F1EC] transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-[#F5F1EC] group-hover:bg-[#E7D7C9] flex items-center justify-center transition-colors">
                <Upload size={24} className="text-[#9C6B4F]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#5C4033]">Upload image for {sideLabel}</p>
                <p className="text-xs text-[#8B6B52] mt-1">PNG, JPG up to 5MB</p>
              </div>
            </button>

            {props.uploadedImage && (
              <div className="space-y-4 p-4 bg-[#F5F1EC] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider">Image Controls</span>
                  <button onClick={props.onRemoveImage} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors flex items-center gap-1">
                    <Trash2 size={14} />
                    <span className="text-[10px] font-medium">Remove</span>
                  </button>
                </div>
                <div>
                  <label className="text-xs text-[#8B6B52] font-medium mb-2 block">
                    Rotation: {props.imageRotation}°
                  </label>
                  <input
                    type="range" min="0" max="360" value={props.imageRotation}
                    onChange={(e) => props.setImageRotation(Number(e.target.value))}
                    className="w-full accent-[#9C6B4F]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B6B52] font-medium mb-2 block">
                    Size: {Math.round(props.imageScale * 100)}%
                  </label>
                  <input
                    type="range" min="10" max="200" value={props.imageScale * 100}
                    onChange={(e) => props.setImageScale(Number(e.target.value) / 100)}
                    className="w-full accent-[#9C6B4F]"
                  />
                </div>
                <p className="text-[10px] text-[#8B6B52] flex items-center gap-1">
                  <RotateCw size={10} /> Drag image on the t-shirt to reposition
                </p>
              </div>
            )}

            {!props.uploadedImage && (
              <p className="text-xs text-[#8B6B52]/70 text-center">
                No image on {sideLabel.toLowerCase()} side yet
              </p>
            )}
          </div>
        )}

        {/* Text Tab */}
        {props.activeTab === "text" && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider">Your Text ({sideLabel})</label>
                {props.customText && (
                  <button onClick={props.onRemoveText} className="p-1 rounded-lg hover:bg-red-50 text-red-500 transition-colors flex items-center gap-1">
                    <Trash2 size={12} />
                    <span className="text-[10px] font-medium">Clear</span>
                  </button>
                )}
              </div>
              <textarea
                value={props.customText}
                onChange={(e) => props.setCustomText(e.target.value)}
                placeholder={`Type text for ${sideLabel.toLowerCase()} side...`}
                className="w-full px-4 py-3 border border-[#E7D7C9] rounded-xl text-sm bg-white focus:outline-none focus:border-[#9C6B4F] focus:ring-1 focus:ring-[#9C6B4F] resize-none h-20 text-[#5C4033] placeholder:text-[#C69C72]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-2 block">Font Style</label>
              <select
                value={props.fontFamily}
                onChange={(e) => props.setFontFamily(e.target.value)}
                className="w-full px-4 py-3 border border-[#E7D7C9] rounded-xl text-sm bg-white focus:outline-none focus:border-[#9C6B4F] text-[#5C4033]"
              >
                {fonts.map((f) => (
                  <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-2 block">
                Font Size: {props.fontSize}px
              </label>
              <input
                type="range" min="12" max="72" value={props.fontSize}
                onChange={(e) => props.setFontSize(Number(e.target.value))}
                className="w-full accent-[#9C6B4F]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-2 block">Text Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color" value={props.textColor}
                  onChange={(e) => props.setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#E7D7C9]"
                />
                <span className="text-xs text-[#8B6B52] font-mono">{props.textColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* T-Shirt Options Tab */}
        {props.activeTab === "options" && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-3 block">T-Shirt Color</label>
              <div className="grid grid-cols-4 gap-2.5">
                {colorSwatches.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => props.setTshirtColor(c.value)}
                    className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                      props.tshirtColor === c.value ? "bg-[#F5F1EC] ring-2 ring-[#9C6B4F]" : "hover:bg-[#F5F1EC]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full border-2 transition-transform group-hover:scale-110 ${
                        c.value === "#FFFFFF" ? "border-gray-300" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                    <span className="text-[10px] text-[#8B6B52]">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-3 block">T-Shirt Type</label>
              <div className="grid grid-cols-1 gap-2">
                {tshirtTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => props.setTshirtType(t)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      props.tshirtType === t
                        ? "bg-[#9C6B4F] text-white"
                        : "bg-[#F5F1EC] text-[#5C4033] hover:bg-[#E7D7C9]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider mb-3 block">Size</label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => props.setTshirtSize(s)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      props.tshirtSize === s
                        ? "bg-[#9C6B4F] text-white"
                        : "bg-[#F5F1EC] text-[#5C4033] hover:bg-[#E7D7C9]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
