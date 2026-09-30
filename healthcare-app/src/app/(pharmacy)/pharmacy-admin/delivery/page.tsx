"use client";

import { useState } from "react";
import { Truck, MapPin, Phone, CheckCircle2, Navigation, Clock, User, Package, Search } from "lucide-react";
import { Card, Button, Input, Badge, DataTable } from "@/components/ui";

type DeliveryRecord = {
    id: string;
    orderId: string;
    customer: string;
    address: string;
    agent: string;
    status: "Out for Delivery" | "Delivered" | "Pending Dispatch" | "Delayed";
    eta: string;
};

const initialDeliveries: DeliveryRecord[] = [
    { id: "DEL-9901", orderId: "ORD-7721", customer: "Anjali Gupta", address: "Flat 402, Sea View, Worli", agent: "Rahul M.", status: "Out for Delivery", eta: "15 mins" },
    { id: "DEL-9902", orderId: "ORD-8921", customer: "Sanjay Shah", address: "12/A Baker St, Bandra", agent: "Amit K.", status: "Pending Dispatch", eta: "45 mins" },
    { id: "DEL-9903", orderId: "ORD-4421", customer: "Vikram Singh", address: "Laxmi Niwas, Dadar", agent: "Suresh P.", status: "Delivered", eta: "0 mins" },
    { id: "DEL-9904", orderId: "ORD-5532", customer: "Pooja Hegde", address: "Marol Metro, Andheri", agent: "Rahul M.", status: "Delayed", eta: "1.5 hours" },
];

export default function PharmacyDelivery() {
    const [deliveries] = useState<DeliveryRecord[]>(initialDeliveries);

    const columns = [
        { 
            key: "delivery", 
            label: "Delivery / Order", 
            render: (row: DeliveryRecord) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-content-primary">{row.id}</div>
                        <div className="text-caption text-content-tertiary">{row.orderId}</div>
                    </div>
                </div>
            ) 
        },
        { 
            key: "customer", 
            label: "Customer & Destination", 
            render: (row: DeliveryRecord) => (
                <div>
                    <div className="font-medium text-content-primary flex items-center gap-1"><User className="w-3 h-3" /> {row.customer}</div>
                    <div className="text-caption text-content-secondary flex items-center gap-1 max-w-[200px] truncate"><MapPin className="w-3 h-3" /> {row.address}</div>
                </div>
            ) 
        },
        { 
            key: "agent", 
            label: "Delivery Agent", 
            render: (row: DeliveryRecord) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold">A</div>
                    <span className="text-body-sm">{row.agent}</span>
                </div>
            ) 
        },
        { 
            key: "eta", 
            label: "ETA / Time", 
            render: (row: DeliveryRecord) => (
                <div className="flex items-center gap-1 text-body-sm font-medium">
                    <Clock className="w-3.5 h-3.5 text-content-tertiary" />
                    {row.eta}
                </div>
            ) 
        },
        { 
            key: "status", 
            label: "Status", 
            render: (row: DeliveryRecord) => (
                <Badge variant={row.status === "Delivered" ? "success" : row.status === "Delayed" ? "danger" : row.status === "Out for Delivery" ? "info" : "warning"} size="sm">
                    {row.status}
                </Badge>
            ) 
        },
        {
            key: "actions",
            label: "Track",
            render: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Live Map"><Navigation className="w-4 h-4 text-primary-500" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Contact Agent"><Phone className="w-4 h-4 text-content-tertiary" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Delivery Management</h1>
                    <p className="text-body-sm text-content-secondary mt-1">Track pharmacy shipments, delivery agents, and customer arrival times.</p>
                </div>
                <Button size="sm" leftIcon={<Package className="w-4 h-4" />}>Schedule Pickup</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Shipments", value: "142", icon: <Package className="w-5 h-5"/>, color: "text-primary-500" },
                    { label: "Out for Delivery", value: "18", icon: <Truck className="w-5 h-5"/>, color: "text-blue-500" },
                    { label: "Delivered Today", value: "84", icon: <CheckCircle2 className="w-5 h-5"/>, color: "text-emerald-500" },
                    { label: "Agent On-field", value: "6", icon: <User className="w-5 h-5"/>, color: "text-amber-500" },
                ].map((s, i) => (
                    <Card key={i} padding="md" className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 ${s.color} flex items-center justify-center`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-caption text-content-tertiary">{s.label}</p>
                            <p className="text-heading-sm font-bold">{s.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card padding="md">
                <div className="flex items-center justify-between mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                        <Input placeholder="Search Delivery ID, Order or Agent..." className="pl-9" />
                    </div>
                </div>
                <DataTable columns={columns} data={deliveries} />
            </Card>

            {/* Live Map Placeholder UI */}
            <Card padding="md" className="h-64 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900/30 border-dashed">
                <Navigation className="w-12 h-12 text-content-tertiary mb-4 animate-bounce" />
                <h3 className="text-body-lg font-semibold">Live Tracking Feed</h3>
                <p className="text-body-sm text-content-secondary max-w-md">The real-time delivery map is showing 6 active agents across Mumbai BKC and Bandra West area.</p>
                <Button variant="outline" size="sm" className="mt-4">Expand Live Map</Button>
            </Card>
        </div>
    );
}
