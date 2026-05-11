"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Eye, Maximize2 } from "lucide-react";
import toast from "react-hot-toast";
import CustomizerSidebar from "@/components/customizer/CustomizerSidebar";
import CustomizerCanvas from "@/components/customizer/CustomizerCanvas";
import TShirtPreview from "@/components/customizer/TShirtPreview";
import PreviewModal from "@/components/customizer/PreviewModal";

const colorNames: Record<string, string> = {
  "#FFFFFF": "White", "#000000": "Black", "#DC2626": "Red", "#2563EB": "Blue",
  "#16A34A": "Green", "#EAB308": "Yellow", "#1E3A5F": "Navy", "#6B7280": "Grey",
};

export interface DesignSide {
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

const defaultSide: DesignSide = {
  image: null,
  imagePosition: { x: 140, y: 120 },
  imageRotation: 0,
  imageScale: 1,
  text: "",
  textPosition: { x: 150, y: 180 },
  fontFamily: "Inter, sans-serif",
  fontSize: 24,
  textColor: "#000000",
};

export default function CustomizePage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [view, setView] = useState<"front" | "back">("front");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Separate state for front and back designs
  const [frontDesign, setFrontDesign] = useState<DesignSide>({ ...defaultSide });
  const [backDesign, setBackDesign] = useState<DesignSide>({ ...defaultSide });

  // T-shirt options (shared)
  const [tshirtColor, setTshirtColor] = useState("#FFFFFF");
  const [tshirtType, setTshirtType] = useState("Round Neck");
  const [tshirtSize, setTshirtSize] = useState("M");

  // Get/set current side design based on view
  const current = view === "front" ? frontDesign : backDesign;
  const setCurrent = view === "front" ? setFrontDesign : setBackDesign;

  const updateField = useCallback(<K extends keyof DesignSide>(field: K, value: DesignSide[K]) => {
    setCurrent(prev => ({ ...prev, [field]: value }));
  }, [setCurrent]);

  const handleImageUpload = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrent(prev => ({
        ...prev,
        image: e.target?.result as string,
        imagePosition: { x: 140, y: 120 },
        imageRotation: 0,
        imageScale: 1,
      }));
      toast.success(`Image added to ${view} side!`);
    };
    reader.readAsDataURL(file);
  }, [setCurrent, view]);

  const handleRemoveImage = useCallback(() => {
    setCurrent(prev => ({ ...prev, image: null, imageRotation: 0, imageScale: 1 }));
    toast.success("Image removed");
  }, [setCurrent]);

  const handleRemoveText = useCallback(() => {
    setCurrent(prev => ({ ...prev, text: "" }));
    toast.success("Text removed");
  }, [setCurrent]);

  const handleAddToCart = () => {
    toast.success("Custom T-Shirt added to cart!", { icon: "🎉" });
  };

  const hasCustomization = frontDesign.image || frontDesign.text || backDesign.image || backDesign.text;
  const basePrice = 1999;
  const imgFee = (frontDesign.image ? 299 : 0) + (backDesign.image ? 299 : 0);
  const txtFee = (frontDesign.text ? 199 : 0) + (backDesign.text ? 199 : 0);
  const totalPrice = basePrice + imgFee + txtFee;



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1EC] via-[#FAFAF8] to-[#F0ECE6]">
      {/* Header */}
      <div className="bg-[#5C4033] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={20} className="text-[#C69C72]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#C69C72] font-medium">Design Studio</span>
              <Sparkles size={20} className="text-[#C69C72]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">Customize Your T-Shirt</h1>
            <p className="text-sm text-[#C69C72] mt-1">Create your own unique design — front &amp; back</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <CustomizerSidebar
              activeTab={activeTab} setActiveTab={setActiveTab}
              currentView={view}
              onImageUpload={handleImageUpload} uploadedImage={current.image}
              imageRotation={current.imageRotation} imageScale={current.imageScale}
              setImageRotation={(r) => updateField("imageRotation", r)}
              setImageScale={(s) => updateField("imageScale", s)}
              onRemoveImage={handleRemoveImage}
              customText={current.text}
              setCustomText={(t) => updateField("text", t)}
              fontFamily={current.fontFamily}
              setFontFamily={(f) => updateField("fontFamily", f)}
              fontSize={current.fontSize}
              setFontSize={(s) => updateField("fontSize", s)}
              textColor={current.textColor}
              setTextColor={(c) => updateField("textColor", c)}
              onRemoveText={handleRemoveText}
              tshirtColor={tshirtColor} setTshirtColor={setTshirtColor}
              tshirtType={tshirtType} setTshirtType={setTshirtType}
              tshirtSize={tshirtSize} setTshirtSize={setTshirtSize}
            />
          </motion.div>

          {/* Center Canvas */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
            <CustomizerCanvas
              tshirtColor={tshirtColor} tshirtType={tshirtType}
              view={view} setView={setView}
              uploadedImage={current.image}
              imagePosition={current.imagePosition}
              setImagePosition={(p) => updateField("imagePosition", p)}
              imageRotation={current.imageRotation} imageScale={current.imageScale}
              customText={current.text}
              textPosition={current.textPosition}
              setTextPosition={(p) => updateField("textPosition", p)}
              fontFamily={current.fontFamily} fontSize={current.fontSize} textColor={current.textColor}
              onRemoveImage={handleRemoveImage}
              onRemoveText={handleRemoveText}
            />
          </motion.div>

          {/* Right Summary Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="w-full lg:w-[280px] bg-white rounded-2xl shadow-lg border border-[#E7D7C9]/50 overflow-hidden flex-shrink-0">
              {/* Dual Mini Previews - Clickable */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="w-full p-4 bg-gradient-to-br from-[#F5F1EC] to-[#E7D7C9]/30 border-b border-[#E7D7C9]/50 hover:from-[#EDE7DF] hover:to-[#E7D7C9]/50 transition-all duration-200 group text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-[#9C6B4F]" />
                    <span className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider">Live Preview</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#9C6B4F] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={12} />
                    <span className="text-[9px] font-semibold uppercase tracking-wider">Details</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-bold text-[#8B6B52] uppercase tracking-wider mb-1.5 text-center">Front</p>
                    <TShirtPreview design={frontDesign} tshirtColor={tshirtColor} tshirtType={tshirtType} view="front" size={110} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#8B6B52] uppercase tracking-wider mb-1.5 text-center">Back</p>
                    <TShirtPreview design={backDesign} tshirtColor={tshirtColor} tshirtType={tshirtType} view="back" size={110} />
                  </div>
                </div>
                <p className="text-[9px] text-[#9C6B4F] text-center mt-2 font-medium group-hover:underline">Click for detailed measurements →</p>
              </button>

              {/* Details */}
              <div className="p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#5C4033] font-serif">Order Summary</h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#8B6B52]">Color</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border ${tshirtColor === "#FFFFFF" ? "border-gray-300" : "border-transparent"}`} style={{ backgroundColor: tshirtColor }} />
                      <span className="text-xs font-medium text-[#5C4033]">{colorNames[tshirtColor]}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#8B6B52]">Type</span>
                    <span className="text-xs font-medium text-[#5C4033]">{tshirtType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#8B6B52]">Size</span>
                    <span className="text-xs font-medium text-[#5C4033]">{tshirtSize}</span>
                  </div>

                  {/* Front customizations */}
                  {(frontDesign.image || frontDesign.text) && (
                    <div className="pt-1.5 border-t border-[#E7D7C9]/50">
                      <span className="text-[10px] font-bold text-[#9C6B4F] uppercase tracking-wider">Front Side</span>
                      {frontDesign.image && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#8B6B52]">Custom Image</span>
                          <span className="text-xs font-medium text-green-600">✓ Added</span>
                        </div>
                      )}
                      {frontDesign.text && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#8B6B52]">Custom Text</span>
                          <span className="text-xs font-medium text-green-600 truncate max-w-[100px]">&ldquo;{frontDesign.text}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Back customizations */}
                  {(backDesign.image || backDesign.text) && (
                    <div className="pt-1.5 border-t border-[#E7D7C9]/50">
                      <span className="text-[10px] font-bold text-[#9C6B4F] uppercase tracking-wider">Back Side</span>
                      {backDesign.image && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#8B6B52]">Custom Image</span>
                          <span className="text-xs font-medium text-green-600">✓ Added</span>
                        </div>
                      )}
                      {backDesign.text && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#8B6B52]">Custom Text</span>
                          <span className="text-xs font-medium text-green-600 truncate max-w-[100px]">&ldquo;{backDesign.text}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E7D7C9] pt-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#8B6B52]">Base Price</span>
                    <span className="text-xs text-[#5C4033]">Rs. {basePrice.toLocaleString()}</span>
                  </div>
                  {imgFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs text-[#8B6B52]">Image Print</span>
                      <span className="text-xs text-[#5C4033]">Rs. {imgFee}</span>
                    </div>
                  )}
                  {txtFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs text-[#8B6B52]">Text Print</span>
                      <span className="text-xs text-[#5C4033]">Rs. {txtFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[#E7D7C9]">
                    <span className="text-sm font-bold text-[#5C4033]">Total</span>
                    <span className="text-sm font-bold text-[#9C6B4F]">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#9C6B4F] hover:bg-[#6F4E37] text-white rounded-full py-3.5 font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        frontDesign={frontDesign}
        backDesign={backDesign}
        tshirtColor={tshirtColor}
        tshirtType={tshirtType}
        tshirtSize={tshirtSize}
      />
    </div>
  );
}
