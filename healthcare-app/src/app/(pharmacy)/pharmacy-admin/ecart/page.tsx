"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, ShoppingCart, Pill, ChevronRight, 
    Plus, Minus, Trash2, CreditCard, 
    Star, Clock 
} from "lucide-react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { useCartStore } from "@/stores";

const MEDICINES = [
    { id: "M1", name: "Paracetamol 500mg", type: "Tablet", price: 45, mrp: 60, image: null, category: "Pain Relief", rating: 4.8, prescription: false },
    { id: "M2", name: "Amoxicillin 250mg", type: "Capsule", price: 120, mrp: 150, image: null, category: "Antibiotics", rating: 4.5, prescription: true },
    { id: "M3", name: "Cetirizine 10mg", type: "Tablet", price: 35, mrp: 50, image: null, category: "Allergy", rating: 4.2, prescription: false },
    { id: "M4", name: "Metformin 500mg", type: "Tablet", price: 85, mrp: 110, image: null, category: "Diabetes", rating: 4.9, prescription: true },
    { id: "M5", name: "Pantoprazole 40mg", type: "Tablet", price: 65, mrp: 90, image: null, category: "Digestion", rating: 4.6, prescription: false },
    { id: "M6", name: "Atorvastatin 10mg", type: "Tablet", price: 110, mrp: 140, image: null, category: "Cholesterol", rating: 4.7, prescription: true },
];

const CATEGORIES = ["All", "Pain Relief", "Antibiotics", "Allergy", "Diabetes", "Digestion", "Cholesterol"];

export default function PharmacyECart() {
    const { items, addItem, removeItem, updateQty, total, itemCount } = useCartStore();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showCheckout, setShowCheckout] = useState(false);

    const filteredMedicines = MEDICINES.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Pharmacy E-Cart</h1>
                    <p className="text-body-md text-content-secondary">Order medicines and get health supplies delivered</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Button 
                            variant="outline" 
                            className="relative"
                            onClick={() => setShowCheckout(!showCheckout)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-surface-dark">
                                    {itemCount()}
                                </span>
                            )}
                        </Button>
                    </div>
                    <Button>Track Order</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Panel: Shop */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search & Categories */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-tertiary" />
                            <input 
                                type="text" 
                                placeholder="Search medicines, wellness products..."
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark-card focus:ring-2 focus:ring-primary-500/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        px-4 py-2 rounded-full whitespace-nowrap text-body-sm font-medium transition-all
                                        ${selectedCategory === cat 
                                            ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                                            : "bg-white dark:bg-surface-dark-card text-content-secondary hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800"
                                        }
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Medicine Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredMedicines.map(med => {
                            const inCart = items.find(i => i.id === med.id);
                            return (
                                <motion.div 
                                    key={med.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className="group hover:shadow-xl transition-all duration-300">
                                        <div className="relative aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 mb-4 overflow-hidden flex items-center justify-center">
                                            <Pill className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                                            {med.prescription && (
                                                <Badge variant="warning" size="sm" className="absolute top-2 left-2">Rx Needed</Badge>
                                            )}
                                            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                <span className="text-[10px] font-bold">{med.rating}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-caption text-primary-500 font-medium">{med.category}</p>
                                            <h3 className="text-body-md font-bold text-content-primary dark:text-content-dark-primary">{med.name}</h3>
                                            <p className="text-caption text-content-tertiary mb-3">{med.type}</p>
                                            
                                            <div className="flex items-center justify-between mt-auto">
                                                <div>
                                                    <span className="text-heading-sm font-bold">₹{med.price}</span>
                                                    <span className="ml-1.5 text-caption text-content-tertiary line-through">₹{med.mrp}</span>
                                                </div>
                                                {inCart ? (
                                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                                        <button 
                                                            onClick={() => updateQty(med.id, inCart.qty - 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-content-secondary"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-body-sm font-bold min-w-[20px] text-center">{inCart.qty}</span>
                                                        <button 
                                                            onClick={() => addItem({ ...med, image_url: null, requires_prescription: med.prescription })}
                                                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-content-secondary"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        size="sm" 
                                                        variant="primary"
                                                        onClick={() => addItem({ ...med, image_url: null, requires_prescription: med.prescription })}
                                                    >
                                                        Add to Cart
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

                {/* Right Panel: Cart Summary */}
                <div className="space-y-6">
                    <Card className="sticky top-20">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-heading-sm font-bold flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-primary-500" /> Cart
                            </h2>
                            <Badge variant="info" size="sm">{itemCount()} Items</Badge>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                            {items.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <ShoppingCart className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-body-sm text-content-tertiary">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                            <Pill className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-body-sm font-semibold truncate">{item.name}</h4>
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-md p-0.5">
                                                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 h-5 flex items-center justify-center"><Minus className="w-2.5 h-2.5" /></button>
                                                    <span className="text-[11px] font-bold">{item.qty}</span>
                                                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 h-5 flex items-center justify-center"><Plus className="w-2.5 h-2.5" /></button>
                                                </div>
                                                <span className="text-body-sm font-bold">₹{item.price * item.qty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                            <div className="flex justify-between text-body-sm">
                                <span className="text-content-secondary">Subtotal</span>
                                <span className="font-semibold font-mono">₹{total()}</span>
                            </div>
                            <div className="flex justify-between text-body-sm">
                                <span className="text-content-secondary">Delivery Fee</span>
                                <span className="text-emerald-500 font-semibold">FREE</span>
                            </div>
                            <div className="flex justify-between text-heading-sm font-bold pt-2">
                                <span>Total</span>
                                <span className="gradient-text">₹{total()}</span>
                            </div>
                            
                            <Button 
                                fullWidth 
                                className="mt-4" 
                                size="lg" 
                                disabled={items.length === 0}
                                onClick={() => setShowCheckout(true)}
                            >
                                Checkout <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-body-sm font-bold">Super Fast Delivery</h4>
                                <p className="text-[10px] text-white/80">Get within 30-45 minutes</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-white/70">Our express delivery service ensures your medicines reach you when you need them most.</p>
                    </Card>
                </div>
            </div>

            {/* Checkout Modal / Overlay */}
            <AnimatePresence>
                {showCheckout && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowCheckout(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-surface-dark-card rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="text-heading-sm font-bold">Secure Checkout</h2>
                                <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Simulated Payment Gateway */}
                                <div className="space-y-4">
                                    <h3 className="text-body-md font-semibold">Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl border-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 flex flex-col items-center gap-2 cursor-pointer">
                                            <CreditCard className="w-6 h-6 text-primary-500" />
                                            <span className="text-body-sm font-medium">Card/UPI</span>
                                        </div>
                                        <div className="p-4 rounded-xl border-2 border-transparent bg-gray-50 dark:bg-surface-dark-elevated flex flex-col items-center gap-2 cursor-pointer hover:border-gray-200">
                                            <ShoppingCart className="w-6 h-6 text-content-tertiary" />
                                            <span className="text-body-sm font-medium">Cash On Delivery</span>
                                        </div>
                                    </div>
                                    
                                    <Input label="Card Number" placeholder="**** **** **** 1234" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Expiry" placeholder="MM/YY" />
                                        <Input label="CVV" placeholder="***" type="password" />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-surface-dark-elevated rounded-xl space-y-2">
                                    <div className="flex justify-between text-body-md">
                                        <span>Order Total</span>
                                        <span className="font-bold">₹{total()}</span>
                                    </div>
                                    <p className="text-caption text-content-tertiary">All prices include GST where applicable.</p>
                                </div>

                                <Button fullWidth size="lg" className="h-14 text-lg">
                                    Pay ₹{total()} Now
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
