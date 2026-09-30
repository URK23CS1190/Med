"use client";


import { Store, ShieldCheck, Mail, Phone, Award } from "lucide-react";
import { Card, Button, Input, StatusBadge, Badge } from "@/components/ui";

export default function PharmacyProfile() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Store & Profile Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pharmacist Profile */}
                <Card padding="md" className="lg:col-span-1 space-y-6">
                    <div className="flex flex-col items-centertext-center border-b border-gray-100 dark:border-gray-800 pb-6">
                        <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-3xl font-bold mb-4">
                            PR
                        </div>
                        <h2 className="text-heading-sm font-semibold">Priya Reddy</h2>
                        <p className="text-body-sm text-content-secondary mt-1">Chief Pharmacist</p>
                        <div className="mt-3">
                            <StatusBadge status="verified" label="License Verified" size="sm" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-body-sm">
                            <Mail className="w-4 h-4 text-content-tertiary" /> <span className="text-content-secondary">priya.reddy@medplus.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-body-sm">
                            <Phone className="w-4 h-4 text-content-tertiary" /> <span className="text-content-secondary">+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-3 text-body-sm">
                            <Award className="w-4 h-4 text-content-tertiary" /> <span className="text-content-secondary">PCI/TN/2018/12345</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full">Edit Profile</Button>
                </Card>

                {/* Pharmacy Store Info */}
                <Card padding="md" className="lg:col-span-2 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-full -z-10" />
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-heading-md font-semibold flex items-center gap-2"><Store className="w-5 h-5 text-primary-500" /> MedPlus Pharmacy — BKC</h2>
                            <p className="text-body-sm text-content-secondary mt-1">Manage public-facing store details and operations.</p>
                        </div>
                        <StatusBadge status="active" label="Open Now" size="sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="space-y-4">
                            <div>
                                <label className="text-body-sm font-medium text-content-secondary mb-1 block">Store Registration #</label>
                                <Input defaultValue="DL/20/21/MH/8839" readOnly />
                            </div>
                            <div>
                                <label className="text-body-sm font-medium text-content-secondary mb-1 block">GSTIN</label>
                                <Input defaultValue="27AADCM8839R1Z5" readOnly />
                            </div>
                            <div>
                                <label className="text-body-sm font-medium text-content-secondary mb-1 block">Contact Email (Public)</label>
                                <Input defaultValue="bkc@medplus.com" />
                            </div>
                            <div>
                                <label className="text-body-sm font-medium text-content-secondary mb-1 block">Operational Hours</label>
                                <div className="flex gap-2">
                                    <Input defaultValue="08:00 AM" />
                                    <span className="flex items-center text-content-tertiary">-</span>
                                    <Input defaultValue="11:00 PM" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-body-sm font-medium text-content-secondary mb-1 block">Store Address</label>
                                <textarea 
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:ring-2 focus:ring-primary-500 p-3 h-24 transition-colors"
                                    defaultValue="Shop No. 4, Ground Floor, Inspire Hub, BKC, Bandra East, Mumbai, Maharashtra 400051"
                                />
                            </div>
                            <div>
                                <label className="text-body-sm font-medium text-content-secondary mb-1 block">Delivery Radius (km)</label>
                                <Input type="number" defaultValue={5} />
                            </div>
                            <div>
                                <label className="text-body-sm font-medium text-content-secondary mb-2 block">Accepted Payment Methods</label>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="success">UPI</Badge>
                                    <Badge variant="success">Credit/Debit Card</Badge>
                                    <Badge variant="success">Cash on Delivery</Badge>
                                    <Badge>Insurance</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                        <Button variant="outline">Cancel Changes</Button>
                        <Button>Save Store Details</Button>
                    </div>
                </Card>
            </div>
            
            {/* Store Certifications */}
            <Card padding="md" className="space-y-4">
                <h3 className="text-heading-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500"/> Compliance & Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
                        <div>
                            <p className="font-medium text-sm">FDA Drug License</p>
                            <p className="text-xs text-content-tertiary">Valid till Jan 2028</p>
                        </div>
                        <Badge variant="success">Active</Badge>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
                        <div>
                            <p className="font-medium text-sm">FSSAI Registration</p>
                            <p className="text-xs text-content-tertiary">Valid till Aug 2026</p>
                        </div>
                        <Badge variant="success">Active</Badge>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
                        <div>
                            <p className="font-medium text-sm">Fire Safety Audit</p>
                            <p className="text-xs text-red-500">Expiring in 2 days</p>
                        </div>
                        <Badge variant="danger">Renew Now</Badge>
                    </div>
                </div>
            </Card>
        </div>
    );
}
