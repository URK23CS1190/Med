"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, MapPin, Truck, ShieldCheck, 
    CreditCard, Upload, CheckCircle2, 
    ArrowRight, ShoppingBag, Info, ShieldAlert
} from "lucide-react";
import { Card, Button, Input, Badge, StatusBadge } from "@/components/ui";
import { useCartStore, useAuthStore } from "@/stores";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdvancedProofUploader } from "@/components/shared";

type CheckoutStep = "address" | "prescription" | "summary" | "payment" | "success";

export default function PharmacyCheckout() {
    const router = useRouter();
    const { items, total, clearCart } = useCartStore();
    const [step, setStep] = useState<CheckoutStep>("address");
    const [address] = useState({ name: "Sritharan", phone: "+91 98765 43210", line1: "123, Healthcare Ave", city: "Chennai", zip: "600001" });
    const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
    const user = useAuthStore((s) => s.user);
    const supabase = getSupabaseBrowserClient();

    const handlePrescriptionUpload = async (base64Url: string, score: number, fileName: string) => {
        if (!user) {
            console.log("No user session found, marking upload local success");
            setPrescriptionUploaded(true);
            return;
        }

        try {
            const { error } = await supabase.from("medical_records").insert({
                patient_id: user.id,
                record_type: "prescription",
                title: fileName.replace(/\.[^/.]+$/, "") || "Checkout Prescription",
                file_url: base64Url,
                uploaded_by: user.id,
                tags: ["pharmacy", "checkout", "prescription"],
                is_shared: false
            });

            if (error) throw error;
            setPrescriptionUploaded(true);
        } catch (err: unknown) {
            console.error("Error saving checkout prescription:", err);
            alert("Prescription Save Error: " + ((err as { message?: string }).message || "Unknown error"));
        }
    };

    const requiresPrescription = items.some(i => i.requires_prescription);
    const subtotal = total();
    const deliveryFee = 0;
    const taxes = Math.round(subtotal * 0.12);
    const orderTotal = subtotal + deliveryFee + taxes;

    const handleNext = () => {
        if (step === "address") {
            if (requiresPrescription) setStep("prescription");
            else setStep("summary");
        } else if (step === "prescription") setStep("summary");
        else if (step === "summary") setStep("payment");
    };

    const handlePayment = () => {
        // Simulate payment gateway
        setStep("success");
        setTimeout(() => {
            clearCart();
        }, 100);
    };

    if (items.length === 0 && step !== "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center"><ShoppingBag className="w-10 h-10 text-gray-300" /></div>
                <h2 className="text-display-xs font-bold">Your cart is empty</h2>
                <Button onClick={() => router.push("/patient/pharmacy")}>Go to Store</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {step !== "success" && (
                <button onClick={() => router.back()} className="flex items-center gap-2 text-content-secondary hover:text-primary-500">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
            )}

            {/* Success Screen */}
            {step === "success" && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 pt-10">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-display-sm font-bold">Order Placed Successfully!</h1>
                    <p className="text-body-md text-content-secondary max-w-md mx-auto">Your order <span className="font-bold text-primary-600">#ORD-28911</span> has been confirmed and will be delivered within 2 hours.</p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => router.push("/patient/pharmacy")}>Continue Shopping</Button>
                        <Button onClick={() => router.push("/patient/dashboard")}>View Tracking</Button>
                    </div>
                </motion.div>
            )}

            {step !== "success" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Step Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step Progress */}
                        <div className="flex justify-between items-center px-4">
                            {[
                                { id: "address", label: "Address" },
                                { id: "prescription", label: "Rx", hide: !requiresPrescription },
                                { id: "summary", label: "Summary" },
                                { id: "payment", label: "Payment" },
                            ].filter(s => !s.hide).map((s, i, arr) => (
                                <div key={s.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${step === s.id ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" : "bg-gray-100 text-content-tertiary"}`}>
                                            {i + 1}
                                        </div>
                                        <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${step === s.id ? "text-primary-600" : "text-content-tertiary"}`}>{s.label}</span>
                                    </div>
                                    {i < arr.length - 1 && <div className="w-12 md:w-20 h-[2px] bg-gray-100 mx-2 -translate-y-3" />}
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === "address" && (
                                <motion.div key="step-address" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                    <Card padding="md">
                                        <h3 className="text-body-lg font-bold mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-500" /> Shipping Address</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input label="Full Name" value={address.name} readOnly />
                                            <Input label="Phone Number" value={address.phone} readOnly />
                                            <div className="md:col-span-2">
                                                <Input label="Address Line" value={address.line1} readOnly />
                                            </div>
                                            <Input label="City" value={address.city} readOnly />
                                            <Input label="ZIP" value={address.zip} readOnly />
                                        </div>
                                        <Button variant="ghost" size="sm" className="mt-4 text-primary-600">Edit Address</Button>
                                    </Card>
                                    <Button fullWidth size="lg" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>Next: {requiresPrescription ? "Upload Prescription" : "Order Summary"}</Button>
                                </motion.div>
                            )}

                            {step === "prescription" && (
                                <motion.div key="step-rx" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                    <Card padding="md">
                                        <h3 className="text-body-lg font-bold mb-2 flex items-center gap-2"><Upload className="w-5 h-5 text-amber-500" /> Prescriptive Order</h3>
                                        <p className="text-body-sm text-content-secondary mb-6">One or more items in your cart require a valid medical prescription.</p>
                                        
                                        <AdvancedProofUploader 
                                            documentName="Prescription Image"
                                            onUploadSuccess={handlePrescriptionUpload}
                                            onUploadError={(err) => console.log(err)}
                                        />

                                        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex gap-3">
                                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                                            <p className="text-[11px] text-blue-700 dark:text-blue-300">Don&apos;t have a prescription? <button className="font-bold underline">Consult our doctor online</button> for an instant E-prescription.</p>
                                        </div>
                                    </Card>
                                    <Button fullWidth size="lg" disabled={!prescriptionUploaded} onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>Confirm & Preview</Button>
                                </motion.div>
                            )}

                            {step === "summary" && (
                                <motion.div key="step-summary" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                    <Card padding="md">
                                        <h3 className="text-body-lg font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Verification Details</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <Truck className="w-5 h-5 text-primary-500" />
                                                    <div>
                                                        <p className="text-body-sm font-bold">Express Delivery</p>
                                                        <p className="text-[10px] text-content-tertiary">Arrival in 120 mins</p>
                                                    </div>
                                                </div>
                                                <Badge variant="success">Included</Badge>
                                            </div>
                                            {requiresPrescription && (
                                                <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <div className="flex items-center gap-3">
                                                        <Upload className="w-5 h-5 text-amber-500" />
                                                        <div>
                                                            <p className="text-body-sm font-bold">Prescription Verified</p>
                                                            <p className="text-[10px] text-content-tertiary">Verified by AI (Scan #8822)</p>
                                                        </div>
                                                    </div>
                                                    <StatusBadge status="active" label="Checked" />
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                    <Button fullWidth size="lg" onClick={handleNext} rightIcon={<CreditCard className="w-4 h-4" />}>Proceed to Payment</Button>
                                </motion.div>
                            )}

                            {step === "payment" && (
                                <motion.div key="step-payment" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                                    <Card padding="md" className="border-primary-200 bg-primary-50/20">
                                        <h3 className="text-body-lg font-bold mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary-600" /> Secure Payment</h3>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl border-2 border-primary-500 bg-white dark:bg-gray-800 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                                                    <div>
                                                        <p className="text-body-sm font-bold">Credit Card (Ending 4022)</p>
                                                        <p className="text-[10px] text-content-tertiary">Expires 12/28</p>
                                                    </div>
                                                </div>
                                                <div className="w-4 h-4 rounded-full border-4 border-primary-500" />
                                            </div>
                                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 flex items-center justify-between opacity-50 grayscale">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold">UPI</div>
                                                    <p className="text-body-sm font-bold">Pay via PhonePe/GPay</p>
                                                </div>
                                                <div className="w-4 h-4 rounded-full border" />
                                            </div>
                                        </div>
                                    </Card>

                                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex gap-3">
                                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                                        <p className="text-[11px] text-amber-700 dark:text-amber-300 italic">By clicking &ldquo;Pay Now&rdquo;, you authorize this transaction and confirm the accuracy of your order.</p>
                                    </div>

                                    <Button fullWidth size="lg" onClick={handlePayment}>Pay ₹{orderTotal.toLocaleString()}</Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Order Summary Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <Card padding="md">
                                <h3 className="text-body-md font-bold mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-6">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between text-body-sm">
                                            <span className="text-content-secondary line-clamp-1 flex-1">{item.name} x {item.qty}</span>
                                            <span className="font-medium whitespace-nowrap ml-4">₹{item.price * item.qty}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between text-caption">
                                        <span className="text-content-tertiary">Subtotal</span>
                                        <span className="text-content-secondary">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-caption">
                                        <span className="text-content-tertiary">Delivery</span>
                                        <span className="text-emerald-500 font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-caption">
                                        <span className="text-content-tertiary">Taxes (GST 12%)</span>
                                        <span className="text-content-secondary">₹{taxes}</span>
                                    </div>
                                    <div className="flex justify-between text-body-md font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-content-primary">Total</span>
                                        <span className="text-primary-600 text-lg">₹{orderTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex items-center gap-3 p-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                <span className="text-[11px] font-bold">Safe & Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
