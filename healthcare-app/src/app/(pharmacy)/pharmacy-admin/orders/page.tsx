"use client";

import { useState } from "react";
import { Search, Filter, Eye, Printer, FileText, CheckCircle2, Truck, Box } from "lucide-react";
import { Card, Button, Input, Badge, DataTable } from "@/components/ui";

type OrderStatus = "Received" | "Prescription Pending" | "Prescription Verified" | "Packed" | "Out for Delivery" | "Delivered" | "Cancelled";

type Order = {
    id: string;
    patient: string;
    items: { name: string; qty: number }[];
    amount: number;
    hasRx: boolean;
    payment: "Paid" | "Pending" | "COD";
    address: string;
    phone: string;
    time: string;
    status: OrderStatus;
};

const initialOrders: Order[] = [
    { id: "ORD-9021", patient: "Kavitha Reddy", items: [{ name: "Dolo 650", qty: 2 }, { name: "Cough Syrup", qty: 1 }], amount: 240, hasRx: false, payment: "Paid", address: "12/4, MG Road, BLR", phone: "+91 9876543210", time: "10 min ago", status: "Received" },
    { id: "ORD-9022", patient: "Rahul Sharma", items: [{ name: "Augmentin 625", qty: 1 }], amount: 200, hasRx: true, payment: "Paid", address: "Apt 4B, Indiranagar", phone: "+91 9876500000", time: "30 min ago", status: "Prescription Pending" },
    { id: "ORD-9023", patient: "Deepa Iyer", items: [{ name: "Telma 40", qty: 3 }], amount: 330, hasRx: true, payment: "COD", address: "Villa 12, Koramangala", phone: "+91 9123456780", time: "1 hour ago", status: "Packed" },
    { id: "ORD-9024", patient: "Mohan Rao", items: [{ name: "Betadine", qty: 1 }], amount: 85, hasRx: false, payment: "Paid", address: "Shop 5, Jayanagar", phone: "+91 9988776655", time: "2 hours ago", status: "Out for Delivery" },
    { id: "ORD-9025", patient: "Sneha Patil", items: [{ name: "Vitamin C", qty: 2 }], amount: 150, hasRx: false, payment: "Paid", address: "HSR Layout Sec 2", phone: "+91 9000011111", time: "5 hours ago", status: "Delivered" },
];

export default function PharmacyOrders() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [search, setSearch] = useState("");

    const updateStatus = (id: string, newStatus: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case "Received": return <Badge variant="info">Received</Badge>;
            case "Prescription Pending": return <Badge variant="warning">Rx Pending</Badge>;
            case "Prescription Verified": return <Badge variant="success">Rx Verified</Badge>;
            case "Packed": return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Packed</Badge>;
            case "Out for Delivery": return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Out for Delivery</Badge>;
            case "Delivered": return <Badge variant="success">Delivered</Badge>;
            case "Cancelled": return <Badge variant="danger">Cancelled</Badge>;
        }
    };

    const StatusActionButtons = ({ order }: { order: Order }) => {
        switch (order.status) {
            case "Received":
            case "Prescription Verified":
                return <Button size="sm" onClick={() => updateStatus(order.id, "Packed")} leftIcon={<Box className="w-3.5 h-3.5" />}>Mark Packed</Button>;
            case "Prescription Pending":
                return <Button size="sm" variant="outline" className="border-amber-500 text-amber-600" onClick={() => updateStatus(order.id, "Prescription Verified")}>Verify Rx</Button>;
            case "Packed":
                return <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => updateStatus(order.id, "Out for Delivery")} leftIcon={<Truck className="w-3.5 h-3.5" />}>Dispatch</Button>;
            case "Out for Delivery":
                return <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600" onClick={() => updateStatus(order.id, "Delivered")} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>Delivered</Button>;
            default:
                return null;
        }
    };

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(search.toLowerCase()) || 
        o.patient.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { 
            key: "order",
            label: "Order / Time", 
            render: (row: Order) => (
                <div>
                    <div className="font-semibold text-content-primary">{row.id}</div>
                    <div className="text-caption text-content-tertiary">{row.time}</div>
                </div>
            ) 
        },
        { 
            key: "patient",
            label: "Patient Details", 
            render: (row: Order) => (
                <div>
                    <div className="font-medium text-content-primary">{row.patient}</div>
                    <div className="text-caption text-content-secondary">{row.phone}</div>
                </div>
            ) 
        },
        { 
            key: "items",
            label: "Items", 
            render: (row: Order) => (
                <div className="text-body-sm text-content-secondary max-w-[200px] truncate">
                    {row.items.map(i => `${i.qty}x ${i.name}`).join(", ")}
                </div>
            ) 
        },
        { key: "amount", label: "Amount", render: (row: Order) => `₹${row.amount} (${row.payment})` },
        { 
            key: "rx",
            label: "Prescription", 
            render: (row: Order) => row.hasRx ? <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" leftIcon={<FileText className="w-3 h-3" />}>View Rx</Button> : <span className="text-caption text-content-tertiary">Not req.</span> 
        },
        { key: "status", label: "Status", render: (row: Order) => getStatusBadge(row.status) },
        {
            key: "actions",
            label: "Actions",
            render: (row: Order) => (
                <div className="flex items-center gap-2">
                    <StatusActionButtons order={row} />
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8"><Printer className="w-4 h-4 text-content-tertiary" /></Button>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8"><Eye className="w-4 h-4 text-primary-500" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Order Management</h1>
                    <p className="text-body-sm text-content-secondary mt-1">Track and manage the lifecycle of all pharmacy orders.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>Print Manifest</Button>
                </div>
            </div>

            <Card padding="md">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-tertiary" />
                        <Input 
                            value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            placeholder="Search by Order ID or Patient Name..." 
                            className="pl-10" 
                        />
                    </div>
                    <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>All Statuses</Button>
                </div>

                <DataTable columns={columns} data={filteredOrders} />
            </Card>
        </div>
    );
}
