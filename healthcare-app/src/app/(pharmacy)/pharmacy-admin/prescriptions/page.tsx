"use client";

import { useState } from "react";
import { Search, ZoomIn, ZoomOut, Check, X, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { Card, Button, Input, Badge, AIResultCard } from "@/components/ui";

type PendingRx = {
    id: string;
    patient: string;
    doctor: string;
    time: string;
    imageUrl: string;
    confidence: number;
    extracted: { label: string; value: string; match: "match" | "mismatch" | "warning" | "neutral" }[];
    status: "Pending" | "Verified" | "Rejected";
};

const initialQueue: PendingRx[] = [
    {
        id: "RX-8823", patient: "Kavitha Reddy", doctor: "Dr. Sharma", time: "10 mins ago",
        imageUrl: "https://images.unsplash.com/photo-1587556610423-455b76cf68db?auto=format&fit=crop&q=80&w=400&h=500",
        confidence: 94,
        status: "Pending",
        extracted: [
            { label: "Patient Name", value: "Kavitha Reddy", match: "match" },
            { label: "Doctor Name", value: "Dr. Vivek Sharma", match: "match" },
            { label: "Medicine 1", value: "Augmentin 625 Tablet", match: "match" },
            { label: "Refills", value: "0", match: "match" }
        ]
    },
    {
        id: "RX-8824", patient: "Mohan Rao", doctor: "Dr. Patel", time: "45 mins ago",
        imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400&h=500",
        confidence: 65,
        status: "Pending",
        extracted: [
            { label: "Patient Name", value: "Mohan Rao", match: "match" },
            { label: "Medicine 1", value: "Telm???rtan 4?mg", match: "mismatch" },
            { label: "Medicine 2", value: "Unreadable", match: "warning" }
        ]
    }
];

export default function PrescriptionQueue() {
    const [queue, setQueue] = useState<PendingRx[]>(initialQueue);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string>(initialQueue[0].id);
    const [zoom, setZoom] = useState(1);

    const selectedRx = queue.find(q => q.id === selectedId);
    if (!selectedRx) return null;

    const handleAction = (status: "Verified" | "Rejected") => {
        setQueue(prev => prev.map(q => q.id === selectedId ? { ...q, status } : q));
        // Move to next pending if possible
        const nextPending = queue.find(q => q.id !== selectedId && q.status === "Pending");
        if (nextPending) setSelectedId(nextPending.id);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden">
            {/* Left Sidebar: Queue List */}
            <div className="w-80 flex-shrink-0 flex flex-col gap-4 border-r border-gray-200 dark:border-gray-800 pr-6 h-full">
                <div>
                    <h1 className="text-heading-sm font-semibold mb-1">Prescription Queue</h1>
                    <p className="text-body-sm text-content-secondary">Verify incoming Rx before fulfillment.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                    <Input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} placeholder="Search ID or Patient" className="pl-9 h-9" />
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {queue.filter(q => q.patient.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase())).map(rx => (
                        <Card 
                            key={rx.id} 
                            padding="sm" 
                            className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${selectedId === rx.id ? "ring-2 ring-primary-500 border-primary-500" : ""} ${rx.status === "Verified" ? "opacity-60" : ""}`}
                            onClick={() => setSelectedId(rx.id)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-body-sm font-semibold">{rx.id}</span>
                                {rx.status === "Pending" ? (
                                    <Badge variant={rx.confidence > 85 ? "success" : rx.confidence > 70 ? "warning" : "danger"} size="sm">{rx.confidence}% AI</Badge>
                                ) : (
                                    <Badge variant={rx.status === "Verified" ? "success" : "danger"} size="sm">{rx.status}</Badge>
                                )}
                            </div>
                            <div className="text-body-sm text-content-secondary">{rx.patient}</div>
                            <div className="text-caption text-content-tertiary flex justify-between mt-2">
                                <span>{rx.doctor}</span>
                                <span>{rx.time}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right Side: Verification Workspace */}
            <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div>
                        <h2 className="text-heading-md font-semibold font-display">Reviewing {selectedRx.id}</h2>
                        <p className="text-body-sm text-content-secondary">Uploaded by {selectedRx.patient} • {selectedRx.time}</p>
                    </div>
                    <div className="flex gap-2">
                        {selectedRx.status === "Pending" ? (
                            <>
                                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" leftIcon={<X className="w-4 h-4" />} onClick={() => handleAction("Rejected")}>Reject</Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600" leftIcon={<Check className="w-4 h-4" />} onClick={() => handleAction("Verified")}>Approve & Continue</Button>
                            </>
                        ) : (
                            <Badge variant={selectedRx.status === "Verified" ? "success" : "danger"} size="lg" className="px-4 py-2 text-sm leading-none flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {selectedRx.status}</Badge>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex gap-4 overflow-hidden">
                    {/* Document Viewer */}
                    <div className="flex-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl relative overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                        <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-content-secondary hover:text-primary-600" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}><ZoomOut className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-content-secondary hover:text-primary-600" onClick={() => setZoom(1)}>FIT</Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-content-secondary hover:text-primary-600" onClick={() => setZoom(z => Math.min(3, z + 0.25))}><ZoomIn className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar flex items-center justify-center p-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={selectedRx.imageUrl} 
                                alt="Prescription" 
                                className="transition-transform duration-200 origin-center max-w-none shadow-md"
                                style={{ transform: `scale(${zoom})`, maxHeight: zoom === 1 ? '100%' : 'none' }}
                            />
                        </div>
                    </div>

                    {/* AI OCR Validation Results */}
                    <div className="w-96 flex-shrink-0 overflow-y-auto custom-scrollbar pr-2">
                        <h3 className="text-body-md font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-primary-500" /> AI Extractions</h3>
                        
                        <AIResultCard 
                            documentName="Prescription Note"
                            uploadedAt={selectedRx.time}
                            confidenceScore={selectedRx.confidence}
                            recommendation={selectedRx.confidence > 85 ? "likely_genuine" : selectedRx.confidence > 70 ? "needs_review" : "resubmit"}
                            extractedFields={selectedRx.extracted}
                            detectedIssues={selectedRx.confidence < 85 ? [{ severity: "high", description: "Handwriting unclear for Medicine #2. Pharmacist manual review strongly required." }] : []}
                            fraudRisk={selectedRx.confidence > 85 ? "minimal" : "low"}
                            fraudDetails={selectedRx.confidence > 85 ? ["No anomalies detected"] : ["Manual review recommended due to low confidence"]}
                        />

                        {selectedRx.confidence < 85 && (
                            <Card padding="md" className="mt-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10">
                                <h4 className="text-body-sm font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-400 mb-2"><AlertTriangle className="w-4 h-4" /> Pharmacist Action Required</h4>
                                <p className="text-caption text-amber-700 dark:text-amber-500">The AI could not reliably extract some fields. Please review the highlighted regions manually before approving this order.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
