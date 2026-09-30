"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, AlertTriangle, Eye, Upload, Filter, Download } from "lucide-react";
import { Card, Button, Input, Badge, DataTable, StatusBadge, Modal } from "@/components/ui";

type Medicine = {
    id: string;
    image: string;
    name: string;
    generic: string;
    category: string;
    dosage: string;
    strength: string;
    stock: number;
    price: number;
    expiry: string;
    rxRequired: boolean;
    status: "Active" | "Out of Stock" | "Disabled";
};

const initialMedicines: Medicine[] = [
    { id: "MED-001", image: "💊", name: "Dolo 650", generic: "Paracetamol", category: "Pain Relief", dosage: "Tablet", strength: "650mg", stock: 120, price: 30, expiry: "2026-12-01", rxRequired: false, status: "Active" },
    { id: "MED-002", image: "💉", name: "Augmentin", generic: "Amoxicillin/Clavulanate", category: "Antibiotic", dosage: "Tablet", strength: "625mg", stock: 45, price: 200, expiry: "2025-08-15", rxRequired: true, status: "Active" },
    { id: "MED-003", image: "💧", name: "Refresh Tears", generic: "Carboxymethylcellulose", category: "Eye Drops", dosage: "Drops", strength: "0.5%", stock: 8, price: 145, expiry: "2024-11-20", rxRequired: false, status: "Out of Stock" },
    { id: "MED-004", image: "💊", name: "Telma 40", generic: "Telmisartan", category: "Cardiac", dosage: "Tablet", strength: "40mg", stock: 250, price: 110, expiry: "2027-01-10", rxRequired: true, status: "Active" },
    { id: "MED-005", image: "🧴", name: "Betadine", generic: "Povidone-Iodine", category: "Antiseptic", dosage: "Cream", strength: "5%", stock: 30, price: 85, expiry: "2026-05-01", rxRequired: false, status: "Active" },
];

export default function PharmacyInventory() {
    const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
    const [search, setSearch] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingMed, setEditingMed] = useState<Medicine | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<Medicine>>({
        name: "", generic: "", category: "Pain Relief", dosage: "Tablet", strength: "", stock: 0, price: 0, expiry: "", rxRequired: false, status: "Active"
    });

    const handleSave = () => {
        if (editingMed) {
            setMedicines(prev => prev.map(m => m.id === editingMed.id ? { ...m, ...formData } as Medicine : m));
        } else {
            const newMed: Medicine = {
                id: `MED-${Math.floor(Math.random() * 1000)}`,
                image: "💊",
                ...(formData as Omit<Medicine, "id" | "image">)
            };
            setMedicines([newMed, ...medicines]);
        }
        setIsAddModalOpen(false);
        setEditingMed(null);
    };

    const handleDelete = (id: string) => {
        setMedicines(prev => prev.filter(m => m.id !== id));
    };

    const handleDisable = (id: string) => {
        setMedicines(prev => prev.map(m => m.id === id ? { ...m, status: "Disabled" } : m));
    };

    const filteredMeds = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.generic.toLowerCase().includes(search.toLowerCase()));

    const columns = [
        { key: "image", label: "Image", render: (row: Medicine) => <div className="text-2xl">{row.image}</div> },
        { 
            key: "medicine",
            label: "Medicine", 
            render: (row: Medicine) => (
                <div>
                    <div className="font-medium text-content-primary">{row.name}</div>
                    <div className="text-caption text-content-secondary">{row.generic}</div>
                </div>
            ) 
        },
        { key: "dosage", label: "Dosage & Strength", render: (row: Medicine) => `${row.dosage} • ${row.strength}` },
        { 
            key: "stock",
            label: "Stock", 
            render: (row: Medicine) => (
                <div className={`font-semibold flex items-center gap-1 ${row.stock < 20 ? "text-red-500" : "text-emerald-600"}`}>
                    {row.stock < 20 && <AlertTriangle className="w-3 h-3" />}
                    {row.stock} units
                </div>
            ) 
        },
        { key: "price", label: "Price", render: (row: Medicine) => `₹${row.price}` },
        { 
            key: "rx",
            label: "Rx", 
            render: (row: Medicine) => row.rxRequired ? <Badge variant="warning" size="sm">Required</Badge> : <Badge variant="success" size="sm">OTC</Badge> 
        },
        { 
            key: "status",
            label: "Status", 
            render: (row: Medicine) => <StatusBadge status={row.status === "Active" ? "active" : row.status === "Out of Stock" ? "needs_review" : "inactive"} label={row.status} size="sm" /> 
        },
        {
            key: "actions",
            label: "Actions",
            render: (row: Medicine) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => { setEditingMed(row); setFormData(row); setIsAddModalOpen(true); }}><Edit2 className="w-4 h-4 text-primary-500" /></Button>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50" onClick={() => handleDisable(row.id)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Inventory Management</h1>
                    <p className="text-body-sm text-content-secondary mt-1">Manage medicines, stock, alerts, and details.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>Import</Button>
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => { setEditingMed(null); setFormData({ name: "", generic: "", category: "Pain Relief", dosage: "Tablet", strength: "", stock: 0, price: 0, expiry: "", rxRequired: false, status: "Active" }); setIsAddModalOpen(true); }}>Add Medicine</Button>
                </div>
            </div>

            <Card padding="md">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-tertiary" />
                        <Input 
                            value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            placeholder="Search by medicine or generic name..." 
                            className="pl-10" 
                        />
                    </div>
                    <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
                    <Button variant="outline">Bulk Actions</Button>
                </div>

                <DataTable columns={columns} data={filteredMeds} />
            </Card>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={editingMed ? "Edit Medicine" : "Add New Medicine"} size="lg">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-body-sm font-medium">Medicine Name *</label><Input value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Paracetamol 500mg" /></div>
                        <div className="space-y-1"><label className="text-body-sm font-medium">Generic Name</label><Input value={formData.generic} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, generic: e.target.value})} placeholder="" /></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-body-sm font-medium">Category</label>
                            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm" value={formData.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, category: e.target.value})}>
                                <option>Pain Relief</option><option>Antibiotic</option><option>Cardiac</option><option>Diabetic</option><option>Eye Drops</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-body-sm font-medium">Dosage Form</label>
                            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm" value={formData.dosage} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, dosage: e.target.value})}>
                                <option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Injection</option><option>Drops</option><option>Cream</option>
                            </select>
                        </div>
                        <div className="space-y-1"><label className="text-body-sm font-medium">Strength</label><Input value={formData.strength} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, strength: e.target.value})} placeholder="e.g. 500mg" /></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1"><label className="text-body-sm font-medium">Stock Quantity</label><Input type="number" value={formData.stock || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, stock: parseInt(e.target.value)})} /></div>
                        <div className="space-y-1"><label className="text-body-sm font-medium">Price (₹)</label><Input type="number" value={formData.price || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, price: parseFloat(e.target.value)})} /></div>
                        <div className="space-y-1"><label className="text-body-sm font-medium">Expiry Date</label><Input type="date" value={formData.expiry} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, expiry: e.target.value})} /></div>
                    </div>

                    <div className="flex items-center gap-4 py-2 border-t border-gray-100 dark:border-gray-800 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.rxRequired} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, rxRequired: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                            <span className="text-body-sm font-medium">Prescription Required</span>
                        </label>
                        <div className="flex-1"></div>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>{editingMed ? "Save Changes" : "Add Medicine"}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
