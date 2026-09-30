import type { Metadata } from "next";
import { SmartwatchTracker } from "@/components/shared";

export const metadata: Metadata = {
    title: "Vitals & Smartwatch Tracker",
    description: "View live biometric sync from your smartwatch ring. Monitor heart rate, blood oxygen levels, skin temperature, active run statistics and log physical exercises.",
};

export default function PatientTrackerPage() {
    return <SmartwatchTracker />;
}
