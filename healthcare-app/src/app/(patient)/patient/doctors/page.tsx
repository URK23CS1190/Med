"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Filter, Star, Clock,
    Globe
} from "lucide-react";
import { Card, Badge, Avatar, Button, Input, Chip } from "@/components/ui";

const specialties = [
    "All", "General Medicine", "Cardiology", "Pediatrics", "Dermatology",
    "Orthopedics", "ENT", "Neurology", "Psychiatry", "Gynecology", "Ophthalmology"
];

const doctors = [
    {
        id: "1", name: "Dr. Priya Sharma", specialty: "Cardiologist",
        experience: 15, rating: 4.8, reviews: 234, fee: 800,
        languages: ["English", "Hindi"], modes: ["video", "clinic"],
        available: true, nextSlot: "Today, 3:00 PM", hospital: "Apollo Hospital",
        avatar: null, verified: true,
    },
    {
        id: "2", name: "Dr. Rajesh Kumar", specialty: "General Physician",
        experience: 10, rating: 4.6, reviews: 189, fee: 500,
        languages: ["English", "Hindi", "Tamil"], modes: ["video", "audio", "clinic"],
        available: true, nextSlot: "Today, 5:30 PM", hospital: "Fortis Medical",
        avatar: null, verified: true,
    },
    {
        id: "3", name: "Dr. Ananya Patel", specialty: "Dermatologist",
        experience: 8, rating: 4.9, reviews: 312, fee: 1000,
        languages: ["English", "Gujarati"], modes: ["video", "clinic"],
        available: false, nextSlot: "Tomorrow, 11:00 AM", hospital: "Max Healthcare",
        avatar: null, verified: true,
    },
    {
        id: "4", name: "Dr. Mohammed Ashraf", specialty: "Pediatrician",
        experience: 20, rating: 4.7, reviews: 456, fee: 700,
        languages: ["English", "Hindi", "Urdu"], modes: ["clinic"],
        available: true, nextSlot: "Today, 4:00 PM", hospital: "AIIMS",
        avatar: null, verified: true,
    },
    {
        id: "5", name: "Dr. Sneha Reddy", specialty: "Neurologist",
        experience: 12, rating: 4.5, reviews: 167, fee: 1200,
        languages: ["English", "Telugu", "Hindi"], modes: ["video", "clinic"],
        available: true, nextSlot: "Tomorrow, 9:00 AM", hospital: "Yashoda Hospitals",
        avatar: null, verified: true,
    },
    {
        id: "6", name: "Dr. Arun Menon", specialty: "Orthopedic Surgeon",
        experience: 18, rating: 4.8, reviews: 289, fee: 1500,
        languages: ["English", "Malayalam", "Hindi"], modes: ["clinic"],
        available: false, nextSlot: "Wed, 2:00 PM", hospital: "Aster Medcity",
        avatar: null, verified: true,
    },
];

export default function DoctorsPage() {
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filteredDoctors = doctors.filter(
        (d) =>
            (selectedSpecialty === "All" || d.specialty.includes(selectedSpecialty.replace("ics", "").replace("logy", ""))) &&
            (searchQuery === "" ||
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary mb-2">
                    Find a Doctor
                </h1>
                <p className="text-body-md text-content-secondary">
                    Book appointments with verified doctors across specialties
                </p>
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        variant="search"
                        placeholder="Search doctors, specialties, symptoms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    size="md"
                    leftIcon={<Filter className="w-4 h-4" />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    Filters
                </Button>
            </div>

            {/* Specialty chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {specialties.map((s) => (
                    <Chip
                        key={s}
                        label={s}
                        selected={selectedSpecialty === s}
                        onClick={() => setSelectedSpecialty(s)}
                    />
                ))}
            </div>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor, i) => (
                    <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card variant="interactive" padding="none">
                            <div className="p-5">
                                <div className="flex gap-4">
                                    <Avatar fallback={doctor.name} size="lg" status={doctor.available ? "online" : "away"} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-body-lg font-semibold text-content-primary dark:text-content-dark-primary truncate">
                                                {doctor.name}
                                            </h3>
                                            {doctor.verified && (
                                                <Badge variant="primary" size="sm">✓ Verified</Badge>
                                            )}
                                        </div>
                                        <p className="text-body-sm text-content-secondary">{doctor.specialty}</p>
                                        <p className="text-body-sm text-content-tertiary">{doctor.experience} years exp • {doctor.hospital}</p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-chip bg-amber-50 dark:bg-amber-900/20">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="text-caption font-semibold text-amber-700 dark:text-amber-400">{doctor.rating}</span>
                                            </div>
                                            <span className="text-caption text-content-tertiary">({doctor.reviews} reviews)</span>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {doctor.modes.map((mode) => (
                                                <Badge key={mode} variant="info" size="sm">
                                                    {mode === "video" ? "📹 Video" : mode === "audio" ? "📞 Audio" : "🏥 Clinic"}
                                                </Badge>
                                            ))}
                                            <Badge variant="inactive" size="sm">
                                                <Globe className="w-3 h-3 mr-0.5" />
                                                {doctor.languages.slice(0, 2).join(", ")}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom bar */}
                            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30 rounded-b-card">
                                <div>
                                    <p className="text-caption text-content-tertiary">
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        {doctor.nextSlot}
                                    </p>
                                    <p className="text-body-md font-semibold text-content-primary dark:text-content-dark-primary">
                                        ₹{doctor.fee}
                                    </p>
                                </div>
                                <Link href={`/patient/doctors/${doctor.id}`}>
                                    <Button size="md">Book Now</Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
