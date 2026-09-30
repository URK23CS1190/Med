"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User, Mail, Phone, GraduationCap, Building2, Clock,
    Languages, Award, ChevronDown, ChevronUp, Upload, CheckCircle,
    XCircle, Eye, FileText, Shield, Camera
} from "lucide-react";
import { Card, Button, Badge, Avatar, StatusBadge, AIResultCard } from "@/components/ui";

const profileData = {
    name: "Dr. Arjun Mehta",
    specialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    registration: "MCI/2019/07342",
    council: "Medical Council of India",
    avatar: null,
    email: "arjun.mehta@hospital.com",
    phone: "+91 98765 43210",
    dob: "1988-05-15",
    gender: "Male",
    bloodGroup: "B+",
    qualification: "MBBS, MD (Cardiology)",
    university: "AIIMS New Delhi",
    passingYear: 2015,
    experience: 9,
    hospital: "Lilavati Hospital & Research Centre",
    designation: "Senior Consultant",
    consultationType: "Both",
    fee: 1500,
    languages: ["English", "Hindi", "Marathi"],
    clinicDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    clinicHours: "9:00 AM – 5:00 PM",
    teleAvailable: true,
    emergencyAvailable: true,
    bio: "Experienced cardiologist with expertise in interventional procedures, heart failure management, and preventive cardiology. Published researcher with 15+ papers in peer-reviewed journals.",
    awards: ["Best Cardiologist Award 2023 — IMA", "Young Researcher Fellowship — ACC"],
};

const documents = [
    { name: "Medical License Certificate", status: "verified" as const, uploadDate: "12 Jan 2025", aiScore: 96, admin: "Approved by Priya Sharma" },
    { name: "Government Photo ID (Aadhaar)", status: "verified" as const, uploadDate: "12 Jan 2025", aiScore: 98, admin: "Approved by Priya Sharma" },
    { name: "MBBS Degree Certificate", status: "verified" as const, uploadDate: "12 Jan 2025", aiScore: 94, admin: "Approved by Deepak M." },
    { name: "Hospital Affiliation Letter", status: "resubmit" as const, uploadDate: "12 Jan 2025", aiScore: 62, admin: "Letterhead not visible, doctor name partially cut off" },
    { name: "Profile Photo", status: "verified" as const, uploadDate: "12 Jan 2025", aiScore: 99, admin: "Auto-approved" },
    { name: "Specialization Certificate", status: "under_review" as const, uploadDate: "13 Jan 2025", aiScore: 84, admin: "" },
];

const completionItems = [
    { label: "Basic Info", done: true },
    { label: "Medical Registration", done: true },
    { label: "Profile Photo", done: true },
    { label: "Degree Certificate", status: "Under AI Review" },
    { label: "Affiliation Letter", status: "Resubmission Required" },
    { label: "Identity Proof", done: true },
];

export default function DoctorProfile() {
    const [expandedSection, setExpandedSection] = useState<string | null>("personal");
    const [showAICard, setShowAICard] = useState<number | null>(null);

    const completedCount = completionItems.filter(i => i.done).length;
    const completionPct = Math.round((completedCount / completionItems.length) * 100);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary">Profile & Verification</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Completion Ring */}
                <Card padding="md" className="flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
                            <motion.circle
                                cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
                                className="stroke-primary-500"
                                strokeDasharray={2 * Math.PI * 52}
                                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - completionPct / 100) }}
                                transition={{ duration: 1.5 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-display-sm font-bold text-primary-600">{completionPct}%</span>
                            <span className="text-caption text-content-tertiary">Complete</span>
                        </div>
                    </div>
                    <div className="w-full space-y-2 text-left">
                        {completionItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-body-sm">
                                {item.done ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                ) : item.status?.includes("Review") ? (
                                    <Eye className="w-4 h-4 text-blue-500 flex-shrink-0 animate-pulse" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                )}
                                <span className={item.done ? "text-content-secondary" : "text-content-primary dark:text-content-dark-primary font-medium"}>
                                    {item.label}
                                </span>
                                {item.status && (
                                    <Badge variant={item.status.includes("Review") ? "info" : "danger"} className="ml-auto text-[10px]">
                                        {item.status}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Profile Info Accordion */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Profile Header Card */}
                    <Card padding="md">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar fallback={profileData.name} size="lg" />
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-heading-md text-content-primary dark:text-content-dark-primary">{profileData.name}</h2>
                                <p className="text-body-sm text-content-secondary">{profileData.specialty} • {profileData.subSpecialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="info">{profileData.registration}</Badge>
                                    <StatusBadge status="verified" label="Verified Doctor" />
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Edit Profile</Button>
                        </div>
                    </Card>

                    {/* Accordion Sections */}
                    {[
                        {
                            key: "personal", title: "Personal Information", icon: <User className="w-5 h-5" />,
                            content: (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
                                    <div><span className="text-content-tertiary">Full Name</span><p className="font-medium">{profileData.name}</p></div>
                                    <div><span className="text-content-tertiary">Date of Birth</span><p className="font-medium">{profileData.dob}</p></div>
                                    <div><span className="text-content-tertiary">Gender</span><p className="font-medium">{profileData.gender}</p></div>
                                    <div><span className="text-content-tertiary">Blood Group</span><p className="font-medium">{profileData.bloodGroup}</p></div>
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-content-tertiary" /><div><span className="text-content-tertiary">Email</span><p className="font-medium">{profileData.email}</p></div></div>
                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-content-tertiary" /><div><span className="text-content-tertiary">Phone</span><p className="font-medium">{profileData.phone}</p></div></div>
                                </div>
                            )
                        },
                        {
                            key: "professional", title: "Professional Qualifications", icon: <GraduationCap className="w-5 h-5" />,
                            content: (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
                                    <div><span className="text-content-tertiary">Registration #</span><p className="font-medium">{profileData.registration}</p></div>
                                    <div><span className="text-content-tertiary">Council</span><p className="font-medium">{profileData.council}</p></div>
                                    <div><span className="text-content-tertiary">Qualification</span><p className="font-medium">{profileData.qualification}</p></div>
                                    <div><span className="text-content-tertiary">University</span><p className="font-medium">{profileData.university}</p></div>
                                    <div><span className="text-content-tertiary">Year of Passing</span><p className="font-medium">{profileData.passingYear}</p></div>
                                    <div><span className="text-content-tertiary">Experience</span><p className="font-medium">{profileData.experience} years</p></div>
                                </div>
                            )
                        },
                        {
                            key: "hospital", title: "Hospital Affiliations", icon: <Building2 className="w-5 h-5" />,
                            content: (
                                <div className="space-y-3 text-body-sm">
                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-dark-elevated">
                                        <p className="font-semibold">{profileData.hospital}</p>
                                        <p className="text-content-secondary">{profileData.designation}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="info">Primary</Badge>
                                            <Badge variant="success">Active</Badge>
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: "consultation", title: "Consultation Settings", icon: <Clock className="w-5 h-5" />,
                            content: (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
                                    <div><span className="text-content-tertiary">Consultation Type</span><p className="font-medium">{profileData.consultationType}</p></div>
                                    <div><span className="text-content-tertiary">Consultation Fee</span><p className="font-medium text-emerald-600">₹{profileData.fee}</p></div>
                                    <div><span className="text-content-tertiary">Clinic Days</span><p className="font-medium">{profileData.clinicDays.join(", ")}</p></div>
                                    <div><span className="text-content-tertiary">Clinic Hours</span><p className="font-medium">{profileData.clinicHours}</p></div>
                                    <div><span className="text-content-tertiary">Teleconsultation</span><p className="font-medium">{profileData.teleAvailable ? "✅ Available" : "Not available"}</p></div>
                                    <div><span className="text-content-tertiary">Emergency</span><p className="font-medium">{profileData.emergencyAvailable ? "✅ Available" : "Not available"}</p></div>
                                    <div className="sm:col-span-2 flex items-center gap-2"><Languages className="w-4 h-4 text-content-tertiary" /><span className="text-content-tertiary">Languages:</span><p className="font-medium">{profileData.languages.join(", ")}</p></div>
                                </div>
                            )
                        },
                        {
                            key: "bio", title: "Biography & Awards", icon: <Award className="w-5 h-5" />,
                            content: (
                                <div className="space-y-3 text-body-sm">
                                    <p className="text-content-secondary leading-relaxed">{profileData.bio}</p>
                                    <div className="space-y-2">
                                        {profileData.awards.map((a, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                                                <Award className="w-4 h-4 text-amber-500" />
                                                <span className="text-content-primary dark:text-content-dark-primary">{a}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        },
                    ].map(section => (
                        <Card key={section.key} padding="none">
                            <button
                                onClick={() => toggleSection(section.key)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-primary-500">{section.icon}</span>
                                    <span className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary">{section.title}</span>
                                </div>
                                {expandedSection === section.key ? <ChevronUp className="w-4 h-4 text-content-tertiary" /> : <ChevronDown className="w-4 h-4 text-content-tertiary" />}
                            </button>
                            {expandedSection === section.key && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4">
                                    {section.content}
                                </motion.div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            {/* Document Upload Section */}
            <h2 className="text-heading-md font-semibold flex items-center gap-2 mt-8">
                <Shield className="w-5 h-5 text-primary-500" /> Uploaded Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card padding="md" className={doc.status === "resubmit" ? "border-l-4 border-l-red-500" : doc.status === "under_review" ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-emerald-500"}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-body-md font-semibold flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-content-tertiary" /> {doc.name}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={doc.status === "resubmit" ? "resubmit" : doc.status === "under_review" ? "under_review" : "verified"} />
                                        </div>
                                        <p className="text-caption text-content-tertiary">Uploaded: {doc.uploadDate}</p>
                                        <p className="text-caption text-content-tertiary">AI Score: <span className={`font-bold ${doc.aiScore >= 80 ? "text-emerald-600" : doc.aiScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{doc.aiScore}/100</span></p>
                                        {doc.admin && <p className="text-caption text-content-tertiary">{doc.status === "resubmit" ? `Reason: "${doc.admin}"` : doc.admin}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => setShowAICard(showAICard === i ? null : i)}>
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    {doc.status === "resubmit" && (
                                        <Button size="sm" variant="outline" leftIcon={<Upload className="w-3 h-3" />}>Re-upload</Button>
                                    )}
                                </div>
                            </div>
                            {showAICard === i && (
                                <div className="mt-4">
                                    <AIResultCard
                                        documentName={doc.name}
                                        uploadedAt={doc.uploadDate}
                                        fileHash="a3f9b2c4d8e1f0a3"
                                        confidenceScore={doc.aiScore}
                                        recommendation={doc.aiScore >= 90 ? "likely_genuine" : doc.aiScore >= 70 ? "needs_review" : "resubmit"}
                                        extractedFields={[
                                            { label: "Name", value: "Dr. Arjun Mehta", match: "match", note: "Matches profile" },
                                            { label: "Registration #", value: "MCI/2019/07342", match: "match", note: "Matches entry" },
                                            { label: "Issuing Body", value: "Medical Council India", match: "match", note: "Recognized" },
                                        ]}
                                        detectedIssues={doc.aiScore < 90 ? [{ severity: "medium", description: "Document expiring within 60 days" }] : []}
                                        fraudRisk="low"
                                        fraudDetails={["ELA Analysis: No clone artifacts detected", "Font Consistency: Uniform"]}
                                    />
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
