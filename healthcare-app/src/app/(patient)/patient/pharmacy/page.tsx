"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart, Plus, Minus,
    ShieldCheck, ChevronRight,
    Search, Filter, X, ArrowRight, Zap, Info
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { useCartStore } from "@/stores";

const categories = ["All", "Pain Relief", "Cold & Flu", "Vitamins", "Diabetes", "Heart Care", "Skin Care", "Digestive"];

const medicines = [
    {
        id: "m1", name: "Dolo 650mg", generic: "Paracetamol", manufacturer: "Micro Labs",
        category: "Pain Relief", price: 30, mrp: 35, prescription: false,
        stock: 150, image: "💊", rating: 4.5,
    },
    {
        id: "m2", name: "Azithral 500mg", generic: "Azithromycin", manufacturer: "Alembic",
        category: "Antibiotics", price: 95, mrp: 120, prescription: true,
        stock: 45, image: "💊", rating: 4.3,
    },
    {
        id: "m3", name: "Crocin Cold & Flu", generic: "Paracetamol + Phenylephrine", manufacturer: "GSK",
        category: "Cold & Flu", price: 45, mrp: 55, prescription: false,
        stock: 200, image: "💊", rating: 4.6,
    },
    {
        id: "m4", name: "Vitamin D3 60K", generic: "Cholecalciferol", manufacturer: "USV",
        category: "Vitamins", price: 120, mrp: 150, prescription: false,
        stock: 80, image: "💊", rating: 4.7,
    },
    {
        id: "m5", name: "Metformin 500mg", generic: "Metformin HCl", manufacturer: "Sun Pharma",
        category: "Diabetes", price: 25, mrp: 32, prescription: true,
        stock: 100, image: "💊", rating: 4.4,
    },
    {
        id: "m6", name: "Atorvastatin 10mg", generic: "Atorvastatin", manufacturer: "Cipla",
        category: "Heart Care", price: 65, mrp: 80, prescription: true,
        stock: 75, image: "💊", rating: 4.5,
    },
];


export default function PharmacyPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { items, addItem, updateQty, removeItem, total, itemCount } = useCartStore();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const filtered = medicines.filter(
        (m) =>
            (selectedCategory === "All" || m.category === selectedCategory) &&
            (searchQuery === "" ||
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.generic.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getCartQty = (id: string) => items.find((i) => i.id === id)?.qty || 0;

    return (
        <div className="space-y-8 relative">
            {/* Header section with Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary-600 -mx-6 -mt-6 p-10 rounded-b-[3rem] text-white shadow-xl mb-10">
                <div className="max-w-xl">
                    <h1 className="text-display-md font-bold text-white mb-2">Pharmacy Store</h1>
                    <p className="text-body-lg opacity-90 leading-relaxed">
                        Authentic medicines delivered to your doorstep. Upload prescriptions for scheduled drugs.
                    </p>
                    <div className="mt-8 relative group">
                        <div className="absolute inset-0 bg-white/20 blur-xl group-focus-within:bg-white/40 transition-all rounded-full" />
                        <div className="relative flex items-center bg-white rounded-full p-2 shadow-lg">
                            <Search className="w-5 h-5 text-content-tertiary ml-4" />
                            <input 
                                type="text"
                                placeholder="Search medicines, generics, health concerns..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-content-primary px-4 py-2 placeholder:text-content-tertiary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button size="sm" className="rounded-full px-6 h-10">Search</Button>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <Card padding="md" className="bg-white/10 backdrop-blur-md border-white/20 text-white min-w-[160px] text-center">
                        <Zap className="w-6 h-6 mx-auto mb-2 text-amber-400 fill-current" />
                        <p className="text-display-xs font-bold font-mono">2 HR</p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Lightning Delivery</p>
                    </Card>
                    <Card padding="md" className="bg-white/10 backdrop-blur-md border-white/20 text-white min-w-[160px] text-center">
                        <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                        <p className="text-display-xs font-bold">100%</p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Verified Stock</p>
                    </Card>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Sidebar: Categories & Filters */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <Card padding="md">
                            <h3 className="text-body-md font-bold mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-primary-500" /> Categories</h3>
                            <div className="flex flex-col gap-1">
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCategory(c)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${selectedCategory === c ? "bg-primary-50 text-primary-600 font-bold" : "hover:bg-gray-50 text-content-secondary"}`}
                                    >
                                        <span className="text-body-sm">{c}</span>
                                        {selectedCategory === c ? <ChevronRight className="w-4 h-4" /> : <div className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card padding="md" className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800">
                            <h4 className="text-body-sm font-bold text-indigo-700 dark:text-indigo-400 mb-2">Need Help?</h4>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-300 leading-relaxed mb-4">Chat with our registered pharmacist for medication guidance.</p>
                            <Button size="sm" fullWidth className="bg-indigo-600 hover:bg-indigo-700">Chat with Expert</Button>
                        </Card>
                    </div>
                </div>

                {/* Center: Medicine Grid */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-heading-md font-bold">{selectedCategory} Medicines</h2>
                        <p className="text-body-sm text-content-tertiary">{filtered.length} products found</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((med, i) => {
                            const cartQty = getCartQty(med.id);
                            const discount = Math.round(((med.mrp - med.price) / med.mrp) * 100);

                            return (
                                <motion.div
                                    key={med.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card variant="interactive" padding="none" className="group h-full flex flex-col">
                                        {/* Image Section */}
                                        <div className="h-44 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent" />
                                            <span 
                                                className="text-5xl group-hover:scale-110 transition-transform cursor-pointer" 
                                                onClick={() => router.push(`/patient/pharmacy/${med.id}`)}
                                            >
                                                {med.image}
                                            </span>
                                            
                                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                                {discount > 0 && <Badge variant="success" size="sm" className="shadow-sm">-{discount}%</Badge>}
                                                {med.prescription && <Badge variant="warning" size="sm" className="shadow-sm">℞ Required</Badge>}
                                            </div>

                                            <button 
                                                onClick={() => router.push(`/patient/pharmacy/${med.id}`)}
                                                className="absolute bottom-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-500 hover:text-white"
                                            >
                                                <Info className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <h3 
                                                    className="text-body-md font-bold text-content-primary dark:text-content-dark-primary hover:text-primary-500 cursor-pointer transition-colors"
                                                    onClick={() => router.push(`/patient/pharmacy/${med.id}`)}
                                                >
                                                    {med.name}
                                                </h3>
                                                <p className="text-[11px] font-medium text-content-tertiary mb-2 uppercase tracking-tighter">{med.generic}</p>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-heading-sm font-bold text-content-primary">₹{med.price}</span>
                                                    <span className="text-caption text-content-tertiary line-through">₹{med.mrp}</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-gray-50 dark:border-gray-800">
                                                {cartQty > 0 ? (
                                                    <div className="flex items-center justify-between p-1 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateQty(med.id, cartQty - 1)}><Minus className="w-3 h-3" /></Button>
                                                        <span className="text-body-sm font-bold text-primary-700 dark:text-primary-400">{cartQty}</span>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateQty(med.id, cartQty + 1)}><Plus className="w-3 h-3" /></Button>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        fullWidth 
                                                        size="sm" 
                                                        variant="primary" 
                                                        leftIcon={<Plus className="w-4 h-4" />}
                                                        className="rounded-xl shadow-sm"
                                                        onClick={() => addItem({ id: med.id, name: med.name, price: med.price, mrp: med.mrp, image_url: null, requires_prescription: med.prescription })}
                                                    >
                                                        Add to Basket
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Cart Button (Always visible on bottom right if items) */}
            {itemCount() > 0 && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="fixed bottom-6 right-6 z-40"
                >
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="w-16 h-16 rounded-2xl bg-primary-600 text-white shadow-2xl flex items-center justify-center relative hover:scale-105 transition-transform"
                    >
                        <ShoppingCart className="w-7 h-7" />
                        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 border-4 border-white dark:border-gray-900 text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                            {itemCount()}
                        </span>
                    </button>
                </motion.div>
            )}

            {/* Cart Drawer Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white dark:bg-surface-dark-card z-50 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="text-display-xs font-bold flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-primary-500" /> My Basket</h3>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center"><ShoppingCart className="w-10 h-10 text-gray-300" /></div>
                                        <p className="text-body-md text-content-tertiary">Your basket is empty.<br/>Start adding medicines!</p>
                                        <Button onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
                                    </div>
                                ) : (
                                    items.map(item => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 group">
                                            <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-2xl border border-gray-200 shadow-sm transition-transform group-hover:scale-105">💊</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-body-sm font-bold truncate pr-6">{item.name}</h4>
                                                    <button onClick={() => removeItem(item.id)} className="text-content-tertiary hover:text-red-500"><X className="w-4 h-4" /></button>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2 scale-75 origin-left">
                                                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQty(item.id, item.qty - 1)}><Minus/></Button>
                                                        <span className="text-body-md font-bold w-4 text-center">{item.qty}</span>
                                                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQty(item.id, item.qty + 1)}><Plus/></Button>
                                                    </div>
                                                    <p className="text-body-sm font-bold text-primary-600">₹{item.price * item.qty}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                    <div className="flex justify-between text-body-md">
                                        <span className="text-content-secondary">Subtotal</span>
                                        <span className="font-bold">₹{total()}</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-content-tertiary">Delivery Fee</span>
                                        <span className="text-emerald-500 font-bold">FREE</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-content-tertiary">Total Amount</p>
                                            <p className="text-display-xs font-bold text-primary-600">₹{total()}</p>
                                        </div>
                                        <Button 
                                            size="lg" 
                                            className="px-8 rounded-2xl shadow-lg shadow-primary-500/20"
                                            rightIcon={<ArrowRight className="w-4 h-4" />}
                                            onClick={() => { setIsCartOpen(false); router.push("/patient/pharmacy/checkout"); }}
                                        >
                                            Checkout
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
