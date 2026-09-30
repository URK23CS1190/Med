"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    FileText, Upload, Download,
    Eye, Calendar, Tag, File, Image as ImageIcon,
    Clipboard, Trash2, AlertCircle, Loader2
} from "lucide-react";
import { Card, Badge, Button, Input, Chip, Modal } from "@/components/ui";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";
import { format } from "date-fns";

type RecordType = "lab" | "scan" | "prescription" | "note" | "discharge";

interface MedicalRecord {
    id: string;
    patient_id: string;
    record_type: RecordType;
    title: string;
    file_url: string;
    uploaded_by: string;
    tags: string[];
    is_shared: boolean;
    created_at: string;
}

const recordTypes = ["All", "Lab", "Scan", "Prescription", "Note", "Discharge"];

const typeIcons: Record<RecordType, React.ReactNode> = {
    lab: <FileText className="w-5 h-5 text-blue-500" />,
    scan: <ImageIcon className="w-5 h-5 text-purple-500" />,
    prescription: <Clipboard className="w-5 h-5 text-green-500" />,
    note: <File className="w-5 h-5 text-amber-500" />,
    discharge: <FileText className="w-5 h-5 text-red-500" />,
};

const typeColors: Record<RecordType, string> = {
    lab: "bg-blue-50 dark:bg-blue-900/20",
    scan: "bg-purple-50 dark:bg-purple-900/20",
    prescription: "bg-green-50 dark:bg-green-900/20",
    note: "bg-amber-50 dark:bg-amber-900/20",
    discharge: "bg-red-50 dark:bg-red-900/20",
};

export default function RecordsPage() {
    const user = useAuthStore((s) => s.user);
    const supabase = getSupabaseBrowserClient();

    // Data State
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedType, setSelectedType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [activeRecord, setActiveRecord] = useState<MedicalRecord | null>(null);

    // Upload Form states
    const [uploading, setUploading] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formType, setFormType] = useState<RecordType>("lab");
    const [formTags, setFormTags] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    // Fetch records
    const fetchRecords = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase
                .from("medical_records")
                .select("*")
                .eq("patient_id", user.id)
                .order("created_at", { ascending: false });

            if (err) throw err;
            setRecords((data as MedicalRecord[]) ?? []);
        } catch (err: unknown) {
            setError((err as { message?: string }).message || "Failed to load medical records");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError(null);
        if (!file) return;

        // Validation (Max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setFileError("File size must be under 10MB");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        if (!formTitle) {
            // Remove file extension for default title
            setFormTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
    };

    // Helper to read file as data URL (base64)
    const readFileAsDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    };

    // Handle record upload submit
    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedFile || !formTitle) return;

        setUploading(true);
        setFileError(null);

        try {
            // Read file as base64 payload
            const dataUrl = await readFileAsDataUrl(selectedFile);

            // Ensure profile exists in database to satisfy foreign keys
            const { data: profileCheck } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", user.id)
                .maybeSingle();

            if (!profileCheck) {
                await supabase.from("profiles").insert({
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name || user.email?.split("@")[0] || "Patient",
                    role: "patient",
                });
            }

            // Insert details into Supabase
            const { error: insertErr } = await supabase.from("medical_records").insert({
                patient_id: user.id,
                record_type: formType,
                title: formTitle,
                file_url: dataUrl,
                uploaded_by: user.id,
                tags: formTags
                    ? formTags.split(",").map((t) => t.trim()).filter(Boolean)
                    : [],
                is_shared: false,
            });

            if (insertErr) throw insertErr;

            // Reset form
            setFormTitle("");
            setFormType("lab");
            setFormTags("");
            setSelectedFile(null);
            setIsUploadOpen(false);

            // Refresh entries
            fetchRecords();
        } catch (err: unknown) {
            console.error("Document upload error details:", err);
            const errMsg = (err as { message?: string }).message;
            setFileError(errMsg || "Failed to upload medical record");
            alert("Upload Error: " + (errMsg || "Unknown error"));
        } finally {
            setUploading(false);
        }
    };


    // Delete record
    const handleDeleteRecord = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (!confirmDelete) return;

        try {
            const { error: err } = await supabase
                .from("medical_records")
                .delete()
                .eq("id", id);
            if (err) throw err;
            setRecords((prev) => prev.filter((r) => r.id !== id));
        } catch (err: unknown) {
            alert((err as { message?: string }).message || "Failed to delete record");
        }
    };

    // Download record helper
    const handleDownload = (record: MedicalRecord) => {
        const link = document.createElement("a");
        link.href = record.file_url;
        link.download = record.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filtered entries
    const filtered = records.filter(
        (r) =>
            (selectedType === "All" || r.record_type === selectedType.toLowerCase()) &&
            (searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary font-display flex items-center gap-2">
                        <FileText className="w-8 h-8 text-primary-500" />
                        Health Records
                    </h1>
                    <p className="text-body-md text-content-secondary mt-1">
                        Upload and view your medical documents, lab results, and prescriptions safely in your secure vault.
                    </p>
                </div>
                <Button leftIcon={<Upload className="w-4 h-4" />} onClick={() => setIsUploadOpen(true)}>
                    Upload Document
                </Button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-button bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Search and Category Filter chips */}
            <div className="space-y-4">
                <Input
                    variant="search"
                    placeholder="Search records by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {recordTypes.map((t) => (
                        <Chip
                            key={t}
                            label={t}
                            selected={selectedType === t}
                            onClick={() => setSelectedType(t)}
                        />
                    ))}
                </div>
            </div>

            {/* List / Timeline */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        <p className="text-sm text-content-secondary">Decrypting secure files...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card-base p-16 text-center border-dashed border-2 border-gray-200 dark:border-gray-800">
                        <span className="text-5xl">📁</span>
                        <h3 className="mt-4 font-bold text-body-lg text-content-primary dark:text-content-dark-primary">No records found</h3>
                        <p className="text-body-sm text-content-secondary mt-1 max-w-sm mx-auto">
                            {searchQuery ? "No matches found for your search term." : "Your health record vault is empty. Click Upload to add your first document."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((record) => (
                            <motion.div
                                key={record.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <Card variant="interactive" padding="none">
                                    <div className="p-4 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${typeColors[record.record_type]} flex items-center justify-center flex-shrink-0`}>
                                            {typeIcons[record.record_type]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary truncate">
                                                {record.title}
                                            </h3>
                                            <p className="text-[11px] text-content-secondary uppercase font-bold tracking-wider">{record.record_type}</p>
                                            
                                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-content-tertiary">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {format(new Date(record.created_at), "MMM d, yyyy")}
                                                </span>
                                            </div>
                                            
                                            {record.tags && record.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {record.tags.map((tag) => (
                                                        <Badge key={tag} variant="inactive" size="sm" className="text-[10px]">
                                                            <Tag className="w-2.5 h-2.5 mr-0.5" />{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    setActiveRecord(record);
                                                    setIsViewOpen(true);
                                                }}
                                                aria-label="View Document"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDownload(record)}
                                                aria-label="Download Document"
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteRecord(record.id)}
                                                className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                aria-label="Delete Record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* 1. Upload Modal Dialog */}
            <Modal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                title="Upload Health Document"
                description="Save lab test results, prescriptions, scans, or general notes securely."
                size="md"
            >
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                    {fileError && (
                        <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-900/10 rounded-button flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {fileError}
                        </div>
                    )}

                    <Input
                        label="Document Title"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Blood Test Report Feb"
                    />

                    <div>
                        <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                            Document Category
                        </label>
                        <select
                            value={formType}
                            onChange={(e) => setFormType(e.target.value as RecordType)}
                            className="w-full px-3 py-2 rounded-input border border-gray-200 dark:border-gray-700
                                       bg-white dark:bg-surface-dark-card text-content-primary dark:text-content-dark-primary
                                       focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        >
                            <option value="lab">Lab Result</option>
                            <option value="scan">Medical Scan / X-Ray</option>
                            <option value="prescription">Prescription</option>
                            <option value="note">Clinical / Health Note</option>
                            <option value="discharge">Discharge Summary</option>
                        </select>
                    </div>

                    <Input
                        label="Tags (Comma separated)"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="e.g. cholesterol, routine"
                    />

                    <div>
                        <label className="block text-xs font-semibold text-content-secondary dark:text-content-dark-secondary mb-1">
                            Choose File (PDF, Image, Max 10MB) *
                        </label>
                        <input
                            type="file"
                            required
                            accept=".pdf,image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                       file:rounded-button file:border-0 file:text-xs file:font-semibold
                                       file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100
                                       dark:file:bg-primary-950/20 dark:file:text-primary-400
                                       border border-dashed border-gray-200 dark:border-gray-700 p-4 rounded-card"
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-3">
                        <Button variant="ghost" onClick={() => setIsUploadOpen(false)} type="button">
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={uploading} disabled={!selectedFile || !formTitle}>
                            Upload Document
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* 2. File Preview Modal */}
            <Modal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title={activeRecord?.title}
                size="xl"
            >
                {activeRecord && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-content-tertiary">
                            <span className="capitalize font-bold text-primary-500">Category: {activeRecord.record_type}</span>
                            <span>Uploaded on {format(new Date(activeRecord.created_at), "PPP")}</span>
                        </div>

                        {/* Embed Preview */}
                        <div className="border dark:border-gray-800 rounded-card overflow-hidden h-[50vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative">
                            {activeRecord.file_url.startsWith("data:image/") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={activeRecord.file_url}
                                    alt={activeRecord.title}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : activeRecord.file_url.startsWith("data:application/pdf") ? (
                                <iframe
                                    src={activeRecord.file_url}
                                    title={activeRecord.title}
                                    className="w-full h-full border-0"
                                />
                            ) : (
                                <div className="text-center p-6 space-y-3">
                                    <FileText className="w-16 h-16 text-primary-500 mx-auto" />
                                    <p className="font-semibold text-content-primary">Preview unavailable for this format</p>
                                    <Button onClick={() => handleDownload(activeRecord)} leftIcon={<Download className="w-4 h-4" />}>
                                        Download File
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => handleDownload(activeRecord)}>
                                Download
                            </Button>
                            <Button onClick={() => setIsViewOpen(false)}>
                                Close Preview
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
