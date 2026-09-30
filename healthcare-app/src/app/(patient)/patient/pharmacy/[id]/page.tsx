"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    Plus, Minus, ShoppingCart, ChevronLeft, ShieldCheck, 
    AlertCircle, Clock, Info, Heart, Share2, Star, Truck
} from "lucide-react";
import { Card, Button, Badge, StatusBadge } from "@/components/ui";
import { useCartStore } from "@/stores";

// Mock data for individual medicine (In a real app, this would come from an API)
const medicines = [
    {
        id: "m1", name: "Dolo 650mg", generic: "Paracetamol", manufacturer: "Micro Labs",
        category: "Pain Relief", price: 30, mrp: 35, prescription: false,
        stock: 150, rating: 4.5, reviews: 1240, 
        composition: "Each tablet contains Paracetamol IP 650mg.",
        uses: ["Fever", "Headache", "Muscle Pain", "Joint Pain"],
        sideEffects: ["Nausea", "Stomach Pain", "Loss of appetite"],
        description: "Dolo 650 Tablet helps relieve pain and fever by blocking the release of certain chemical messengers that cause pain and fever. It is used to treat headaches, migraine, nerve pain, toothache, sore throat, period (menstrual) pains, arthritis, and muscle aches.",
        dosage: "Take 1 tablet every 6 hours as needed or as directed by your physician. Do not exceed 4g (6 tablets) in 24 hours.",
        storage: "Store in a cool and dry place away from sunlight. Keep out of reach of children."
    }
];

export default function MedicineDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { items, addItem, updateQty } = useCartStore();
    const [activeTab, setActiveTab] = useState("info");

    const med = medicines.find(m => m.id === params.id) || medicines[0]; // Default to m1 for demo
    const cartQty = items.find(i => i.id === med.id)?.qty || 0;
    const discount = Math.round(((med.mrp - med.price) / med.mrp) * 100);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Back Button */}
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-content-secondary hover:text-primary-500 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:border-primary-500 shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-body-sm font-medium">Back to Pharmacy</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Product Image & Badges */}
                <div className="space-y-6">
                    <Card padding="none" className="aspect-square bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-40 h-40 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl flex items-center justify-center border-4 border-white/50"
                        >
                            <span className="text-5xl">💊</span>
                        </motion.div>
                        
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {discount > 0 && <Badge variant="success" size="md" className="shadow-sm">{discount}% OFF</Badge>}
                            {med.prescription && <Badge variant="warning" size="md" className="shadow-sm">℞ Prescription Required</Badge>}
                        </div>

                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm"><Heart className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm"><Share2 className="w-4 h-4" /></Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-white dark:bg-surface-dark-card border border-gray-100 dark:border-gray-800 text-center">
                            <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                            <p className="text-[10px] uppercase font-bold text-content-tertiary">Authentic</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white dark:bg-surface-dark-card border border-gray-100 dark:border-gray-800 text-center">
                            <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                            <p className="text-[10px] uppercase font-bold text-content-tertiary">2hr Delivery</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white dark:bg-surface-dark-card border border-gray-100 dark:border-gray-800 text-center">
                            <Truck className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                            <p className="text-[10px] uppercase font-bold text-content-tertiary">Free Shipping</p>
                        </div>
                    </div>
                </div>

                {/* Right: Product Details & Purchase */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="info">{med.category}</Badge>
                            <div className="flex items-center gap-1 text-amber-500 text-body-sm font-bold ml-auto">
                                <Star className="w-4 h-4 fill-current" /> {med.rating}
                                <span className="text-content-tertiary font-normal">({med.reviews} reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-display-sm font-bold text-content-primary dark:text-content-dark-primary">{med.name}</h1>
                        <p className="text-body-lg text-content-secondary mt-1">{med.generic}</p>
                        <p className="text-body-sm text-content-tertiary mt-1">Manufacturer: <span className="text-primary-600 font-medium">{med.manufacturer}</span></p>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary-500 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-0" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80 mb-1">Our Best Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">₹{med.price}</span>
                                    <span className="text-lg opacity-60 line-through">₹{med.mrp}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={med.stock > 0 ? "active" : "rejected"} label={med.stock > 0 ? "In Stock" : "Out of Stock"} pulse={med.stock > 0} className="bg-white/20 text-white" />
                                <p className="text-[10px] mt-2 opacity-80 font-medium">Incl. all taxes</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {cartQty > 0 ? (
                                <div className="flex items-center gap-4 p-1 rounded-2xl border-2 border-primary-100 dark:border-primary-900/30">
                                    <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12" onClick={() => updateQty(med.id, cartQty - 1)}><Minus /></Button>
                                    <span className="text-lg font-bold w-8 text-center">{cartQty}</span>
                                    <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12" onClick={() => updateQty(med.id, cartQty + 1)}><Plus /></Button>
                                </div>
                            ) : (
                                <Button 
                                    className="h-14 px-8 rounded-2xl flex-1 text-lg shadow-lg shadow-primary-500/20" 
                                    leftIcon={<ShoppingCart className="w-5 h-5" />}
                                    onClick={() => addItem({ id: med.id, name: med.name, price: med.price, mrp: med.mrp, image_url: null, requires_prescription: med.prescription })}
                                >
                                    Add to Basket
                                </Button>
                            )}
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2"><AlertCircle className="w-5 h-5" /></Button>
                        </div>
                        {med.prescription && (
                            <p className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-body-sm font-medium p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                A scanned copy of valid prescription is required for this medicine.
                            </p>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-100 dark:border-gray-800">
                        <div className="flex gap-8">
                            {["info", "dosage", "side effects"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-body-sm font-semibold capitalize relative transition-colors ${activeTab === tab ? "text-primary-500" : "text-content-tertiary hover:text-content-primary"}`}
                                >
                                    {tab}
                                    {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-full" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-body-sm text-content-secondary leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                        {activeTab === "info" && (
                            <div className="space-y-4">
                                <p>{med.description}</p>
                                <div>
                                    <h4 className="font-bold text-content-primary dark:text-content-dark-primary flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-primary-500" /> Key Benefits</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {med.uses.map(u => <li key={u} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {u}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {activeTab === "dosage" && <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 font-medium">{med.dosage}</div>}
                        {activeTab === "side effects" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {med.sideEffects.map(se => (
                                    <div key={se} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500"><AlertCircle className="w-4 h-4" /></div>
                                        <span>{se}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Safety & Storage Section */}
            <Card padding="md" className="bg-gray-50/50 dark:bg-gray-900/30 border-dashed border-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-body-md font-bold mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Storage Info</h4>
                        <p className="text-body-sm text-content-secondary">{med.storage}</p>
                    </div>
                    <div>
                        <h4 className="text-body-md font-bold mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /> Important Safety Advice</h4>
                        <p className="text-body-sm text-content-secondary">Alcohol consumption is generally unsafe with this medicine. Please consult your doctor for detailed advice regarding kidney or liver conditions.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
