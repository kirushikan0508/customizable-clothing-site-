"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ArrowRight, Sparkles, Zap, ShoppingBag } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const textReveal = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] },
  }),
};

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.8 + i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

export default function Hero() {
  const containerRef = useRef(null);
  const [count, setCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.4]);

  useEffect(() => {
    let current = 0;
    const target = 10;
    const step = () => {
      current += 0.3;
      if (current >= target) { setCount(target); return; }
      setCount(Math.floor(current));
      requestAnimationFrame(step);
    };
    const timer = setTimeout(step, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#3a2820]">
      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5C4033] via-[#4a3429] to-[#3a2820]" />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-[#aa7a64]/25 blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-[#aa7a64]/20 blur-[180px]"
        />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 container-custom min-h-screen flex flex-col justify-center pt-24 pb-8">

        {/* Top badge */}
        <motion.div
          initial="hidden" animate="visible" custom={0} variants={fadeUp}
          className="flex items-center gap-3 mb-10"
        >
          <div className="flex items-center gap-2 bg-[#aa7a64]/15 backdrop-blur-xl border border-[#aa7a64]/30 px-5 py-2.5 rounded-full">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Sparkles size={15} className="text-[#e2c7ba]" />
            </motion.div>
            <span className="text-[#e2c7ba] text-[11px] font-bold tracking-[0.2em] uppercase">Summer &apos;26 Collection</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-[#aa7a64]/40 to-transparent hidden md:block" />
        </motion.div>

        {/* ── Headline + Image Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-end lg:items-center">

          {/* Left: Typography */}
          <div className="lg:col-span-7">
            {/* Each line wrapped in an overflow container for the reveal */}
            <div className="space-y-1">
              {["WEAR", "YOUR", "STYLE."].map((word, i) => (
                <div key={word} className="overflow-hidden">
                  <motion.h1
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={textReveal}
                    className={`font-black tracking-[-0.04em] leading-[0.88] ${i === 2
                        ? "text-[4rem] md:text-[7rem] lg:text-[9rem] text-transparent bg-clip-text bg-gradient-to-r from-[#e2c7ba] via-[#aa7a64] to-[#e2c7ba]"
                        : "text-[4rem] md:text-[7rem] lg:text-[9rem] text-white"
                      }`}
                  >
                    {word}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Description + CTA */}
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mt-10 max-w-lg">
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
                Premium quality streetwear designed for those who dare to stand out.
                Every piece crafted with purpose, worn with confidence.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center gap-3 bg-white text-[#5C4033] pl-7 pr-5 py-4 rounded-full font-bold text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(170,122,100,0.3)] hover:scale-[1.03] active:scale-95"
                >
                  <span className="relative z-10">Shop Collection</span>
                  <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-[#5C4033] rounded-full group-hover:bg-[#aa7a64] transition-colors">
                    <ArrowRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-[#f4e6df] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </Link>

                <Link
                  href="/customize"
                  className="group inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-medium text-white/90 bg-white/5 border border-white/15 backdrop-blur-md hover:bg-white/10 hover:border-white/25 transition-all duration-300"
                >
                  <Zap size={15} className="text-[#aa7a64] group-hover:scale-110 transition-transform" />
                  Design Your Own
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right: Stacked image composition */}
          <motion.div
            initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="lg:col-span-5 relative h-[450px] md:h-[600px] hidden md:block"
          >
            {/* Main hero image */}
            <motion.div
              style={{ scale: imgScale }}
              className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 border border-white/10"
            >
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop"
                alt="Streetwear fashion"
                className="w-full h-full object-cover"
              />
              <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-[#5C4033]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2820]/90 via-transparent to-transparent" />

              {/* Image overlay text */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Featured</p>
                    <p className="text-white font-bold text-lg">Heavyweight Collection</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <ShoppingBag size={13} className="text-[#e2c7ba]" />
                    <span className="text-white/90 text-[11px] font-bold">New</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating stat card (top-left) */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-6 z-20 bg-[#3a2820]/80 backdrop-blur-2xl border border-[#aa7a64]/30 p-4 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-[#aa7a64] to-[#5C4033] rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="text-white fill-white" size={18} />
                </div>
                <div>
                  <p className="text-white font-extrabold text-xl leading-none">{count}K+</p>
                  <p className="text-white/60 text-[10px] font-medium tracking-wider uppercase mt-0.5">Happy Customers</p>
                </div>
              </div>
            </motion.div>

            {/* Floating review card (bottom-right) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-3 -right-4 z-20 bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl shadow-2xl max-w-[200px]"
            >
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-[#aa7a64] text-[#aa7a64]" />)}
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed italic">&quot;Best quality tees I&apos;ve ever owned. The fit is perfect.&quot;</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=32" alt="reviewer" className="w-full h-full object-cover" />
                </div>
                <span className="text-white/50 text-[10px] font-bold tracking-wider">VERIFIED BUYER</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Bottom Marquee Ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16 lg:mt-20 border-t border-white/10 pt-6"
        >
          <div className="overflow-hidden whitespace-nowrap">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-8 text-white/20 text-sm font-bold tracking-[0.2em] uppercase"
            >
              {[...Array(2)].map((_, set) => (
                <div key={set} className="flex items-center gap-8 shrink-0">
                  <span>Premium Cotton</span>
                  <span className="text-[#aa7a64]">◆</span>
                  <span>Custom Designs</span>
                  <span className="text-[#aa7a64]">◆</span>
                  <span>240 GSM Heavyweight</span>
                  <span className="text-[#aa7a64]">◆</span>
                  <span>Free Shipping</span>
                  <span className="text-[#aa7a64]">◆</span>
                  <span>Streetwear Culture</span>
                  <span className="text-[#aa7a64]">◆</span>
                  <span>Limited Drops</span>
                  <span className="text-[#aa7a64]">◆</span>
                  <span>Handcrafted Quality</span>
                  <span className="text-[#aa7a64]">◆</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Stats Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
            <div className="flex items-center gap-5">
              <div className="flex -space-x-2.5">
                {[11, 12, 13, 14].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#3a2820] overflow-hidden shadow-md">
                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-[#aa7a64] text-[#aa7a64]" />)}
                </div>
                <p className="text-white/40 text-[10px] font-bold tracking-[0.15em] uppercase mt-0.5">4.9/5 from 2,400+ reviews</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-white/30 text-[11px] font-bold tracking-[0.15em] uppercase">
              <span>Worldwide Delivery</span>
              <span className="w-1 h-1 rounded-full bg-[#aa7a64]" />
              <span>Secure Payment</span>
              <span className="w-1 h-1 rounded-full bg-[#aa7a64]" />
              <span>Easy Returns</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
