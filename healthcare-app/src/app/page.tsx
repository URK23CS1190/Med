"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import Link from "next/link";
import {
  Shield, Stethoscope, Pill, Building2, Activity, Phone, Video,
  Baby, ArrowRight, ChevronRight,
  CheckCircle, Heart, Users, Zap
} from "lucide-react";
import { Button } from "@/components/ui";

/* ─── Siri Dock Navbar ──────────────────────────────────────────── */
interface NavLink { label: string; href: string; }

const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
];

function SiriNavbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.nav
      ref={navRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      onMouseMove={(e) => {
        const rect = navRef.current?.getBoundingClientRect();
        if (rect) mouseX.set(e.clientX - rect.left);
      }}
      onMouseLeave={() => { mouseX.set(Infinity); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
    >
      <div
        className="flex items-center gap-1 px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(15, 15, 20, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo pill */}
        <DockItem mouseX={mouseX}>
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || "MedCare"}
            </span>
          </Link>
        </DockItem>

        <div className="w-px h-5 bg-white/15 mx-1" />

        {/* Nav links */}
        {navLinks.map((link) => (
          <DockItem key={link.label} mouseX={mouseX}>
            <Link
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-white/75 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </DockItem>
        ))}

        <div className="w-px h-5 bg-white/15 mx-1" />

        {/* CTA button */}
        <DockItem mouseX={mouseX}>
          <Link href="/register">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              Get Started
            </button>
          </Link>
        </DockItem>

        {/* Siri glow effect on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.08), rgba(139,92,246,0.08), rgba(6,182,212,0.08), transparent)",
                filter: "blur(2px)",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

function DockItem({
  children,
  mouseX,
}: {
  children: React.ReactNode;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const scaleX = useSpring(
    useTransform(distance, [-120, 0, 120], [1, 1.18, 1]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const scaleY = useSpring(
    useTransform(distance, [-120, 0, 120], [1, 1.12, 1]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  return (
    <motion.div ref={ref} style={{ scaleX, scaleY }} className="relative origin-bottom">
      {children}
    </motion.div>
  );
}

/* ─── Landing Page ──────────────────────────────────────────────── */
export default function LandingPage() {
  const features = [
    {
      icon: <Stethoscope className="w-7 h-7" />,
      title: "Doctor Consultations",
      description: "Book clinic, video, or audio consultations with verified doctors across 10+ specialties",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50/80",
      glow: "rgba(59,130,246,0.15)",
    },
    {
      icon: <Pill className="w-7 h-7" />,
      title: "Online Pharmacy",
      description: "Order medicines with prescription verification, doorstep delivery & real-time tracking",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50/80",
      glow: "rgba(16,185,129,0.15)",
    },
    {
      icon: <Building2 className="w-7 h-7" />,
      title: "Hospital Bed Finder",
      description: "Real-time ICU, ventilator & emergency bed availability across partner hospitals",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50/80",
      glow: "rgba(139,92,246,0.15)",
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: "Emergency SOS",
      description: "One-tap emergency — GPS location sharing, nearest ICU finder, ambulance dispatch",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50/80",
      glow: "rgba(239,68,68,0.15)",
    },
    {
      icon: <Video className="w-7 h-7" />,
      title: "Telemedicine",
      description: "HD video consultations with screen sharing, file sharing, and e-prescriptions",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50/80",
      glow: "rgba(99,102,241,0.15)",
    },
    {
      icon: <Baby className="w-7 h-7" />,
      title: "Pediatric Care",
      description: "Vaccination tracking, growth charts, and specialized pediatric emergency access",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50/80",
      glow: "rgba(236,72,153,0.15)",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Verified Doctors", icon: <Stethoscope className="w-5 h-5" /> },
    { value: "500+", label: "Partner Hospitals", icon: <Building2 className="w-5 h-5" /> },
    { value: "50,000+", label: "Medicines", icon: <Pill className="w-5 h-5" /> },
    { value: "24/7", label: "Emergency Support", icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Medical Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/medical-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Overlay to soften background so text reads well */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(160deg, rgba(219,234,254,0.55) 0%, rgba(186,230,255,0.45) 40%, rgba(224,242,254,0.50) 100%)",
        }}
      />

      {/* Floating Siri Navbar */}
      <SiriNavbar />

      {/* Content sits above bg */}
      <div className="relative z-10">

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(59,130,246,0.3)",
                boxShadow: "0 2px 12px rgba(59,130,246,0.15)",
              }}
            >
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Trusted by 1M+ patients across India</span>
            </motion.div>

            {/* Heading */}
            <h1
              className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
              style={{
                color: "#0f172a",
                textShadow: "0 2px 20px rgba(255,255,255,0.8)",
              }}
            >
              Care, Pharmacy,
              <br />
              and{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1a6fd4 0%, #0eada8 50%, #1a6fd4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Emergency
              </span>
              <br />
              — Unified
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "#334155", textShadow: "0 1px 8px rgba(255,255,255,0.9)" }}
            >
              Your complete healthcare companion. Consult doctors, order medicines,
              find hospital beds, and access emergency services — all from one trusted platform.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #1a6fd4 0%, #0eada8 100%)",
                    boxShadow: "0 8px 32px rgba(26,111,212,0.4), 0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  Start for Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1.5px solid rgba(26,111,212,0.35)",
                    color: "#1a6fd4",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <Phone className="w-5 h-5" />
                  Book Consultation
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="text-center p-4 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex justify-center mb-2 text-blue-500">{stat.icon}</div>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2
                className="text-4xl md:text-5xl font-black mb-4"
                style={{ color: "#0f172a", textShadow: "0 2px 12px rgba(255,255,255,0.7)" }}
              >
                Everything you need,{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #1a6fd4 0%, #0eada8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  in one place
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From routine check-ups to emergencies, we&apos;ve got every healthcare need covered.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, y: -6 }}
                  className="p-6 rounded-3xl cursor-pointer group"
                  style={{
                    background: "rgba(255,255,255,0.78)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 0 0 0 ${feature.glow}`,
                    transition: "box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 16px 48px rgba(0,0,0,0.12), 0 0 32px ${feature.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 8px 32px rgba(0,0,0,0.08), 0 0 0 0 ${feature.glow}`;
                  }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={`bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
              style={{
                background: "linear-gradient(135deg, #1a6fd4 0%, #0eada8 60%, #1a6fd4 100%)",
                boxShadow: "0 24px 80px rgba(26,111,212,0.4)",
              }}
            >
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -ml-32 -mb-32" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <Heart className="w-12 h-12 text-white/80 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Ready to take control of your health?
                </h2>
                <p className="text-lg text-white/80 mb-8">
                  Join thousands of patients who trust us for their healthcare needs.
                  Start your journey today — it&apos;s free.
                </p>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg bg-white text-blue-600 shadow-xl hover:bg-gray-50 transition-colors"
                  >
                    Create Free Account
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-8 px-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-800">
                {process.env.NEXT_PUBLIC_APP_NAME || "MedCare"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 {process.env.NEXT_PUBLIC_APP_NAME || "MedCare"}. All rights reserved. Built with ❤️ for healthcare.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
