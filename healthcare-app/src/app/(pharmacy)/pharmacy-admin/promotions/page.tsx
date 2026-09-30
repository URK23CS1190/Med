"use client";

import { useState } from "react";
import { Plus, Tag, Calendar, Edit2, Trash2, Megaphone, Target, Clock } from "lucide-react";
import { Card, Button, Badge, StatusBadge, DataTable } from "@/components/ui";

type Promotion = {
    id: string;
    title: string;
    description: string;
    discount: string;
    code: string;
    target: "All Customers" | "First Time" | "Insurance Holders" | "Chronic Patients";
    validity: string;
    status: "active" | "pending" | "expired";
    usage: number;
};

const initialPromotions: Promotion[] = [
    { id: "PROM-001", title: "Monsoon Health Sale", description: "Flat 15% off on all multivitamin supplements.", discount: "15%", code: "MONSOON15", target: "All Customers", validity: "30 Sep 2025", status: "active", usage: 452 },
    { id: "PROM-002", title: "Diabetes Care Month", description: "Extra 10% off on all cardiac and diabetic medicines.", discount: "10%", code: "SUGARFREE", target: "Chronic Patients", validity: "15 Oct 2025", status: "active", usage: 890 },
    { id: "PROM-003", title: "New User Offer", description: "Get ₹100 off on your first order above ₹500.", discount: "₹100 Off", code: "WELCOME100", target: "First Time", validity: "31 Dec 2025", status: "active", usage: 124 },
    { id: "PROM-004", title: "Star Assurance Bonus", description: "Free delivery for Star Health insurance holders.", discount: "Free Delivery", code: "STARFREE", target: "Insurance Holders", validity: "Expired", status: "expired", usage: 331 },
];

export default function PharmacyPromotions() {
    const [promos] = useState<Promotion[]>(initialPromotions);

    const columns = [
        { 
            key: "info",
            label: "Campaign Details", 
            render: (row: Promotion) => (
                <div>
                    <div className="font-semibold text-content-primary">{row.title}</div>
                    <div className="text-caption text-content-tertiary truncate max-w-[250px]">{row.description}</div>
                </div>
            ) 
        },
        { 
            key: "discount",
            label: "Offer", 
            render: (row: Promotion) => (
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-emerald-600">{row.discount}</span>
                    <Badge variant="secondary" className="text-[10px]">{row.code}</Badge>
                </div>
            ) 
        },
        { key: "target", label: "Target Segment", render: (row: Promotion) => <span className="text-body-sm font-medium">{row.target}</span> },
        { 
            key: "validity", 
            label: "Validity", 
            render: (row: Promotion) => (
                <div className="flex items-center gap-1.5 text-caption">
                    <Calendar className="w-3.5 h-3.5 text-content-tertiary" />
                    {row.validity}
                </div>
            ) 
        },
        { key: "usage", label: "Redemptions", render: (row: Promotion) => <span className="font-mono font-bold text-primary-600">{row.usage}</span> },
        { key: "status", label: "Status", render: (row: Promotion) => <StatusBadge status={row.status} size="sm" /> },
        {
            key: "actions",
            label: "Actions",
            render: () => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8"><Edit2 className="w-4 h-4 text-primary-500" /></Button>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Campaigns & Promotions</h1>
                    <p className="text-body-sm text-content-secondary mt-1">Manage discounts, codes, and target marketing segments.</p>
                </div>
                <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Create Campaign</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card padding="md" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-caption text-content-tertiary">Active Campaigns</p>
                        <p className="text-heading-sm font-bold">12</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-caption text-content-tertiary">Total Redemptions</p>
                        <p className="text-heading-sm font-bold">8.4k</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-caption text-content-tertiary">Expiring Soon</p>
                        <p className="text-heading-sm font-bold">3</p>
                    </div>
                </Card>
            </div>

            <Card padding="md">
                <DataTable columns={columns} data={promos} />
            </Card>
        </div>
    );
}
