"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare, Users, Maximize, Wifi } from "lucide-react";

const getDoctorDetails = (id: string) => {
    switch (id) {
        case "PED-101":
            return { name: "Dr. Anjali Desai", specialty: "Pediatric Cardiologist" };
        case "PED-102":
            return { name: "Dr. Rohan Kapoor", specialty: "General Pediatrics" };
        case "PED-103":
            return { name: "Dr. Niti Gupta", specialty: "Child Psychologist" };
        case "APT-1002":
            return { name: "Dr. Rajesh Kumar", specialty: "Pediatrician" };
        case "APT-1003":
            return { name: "Dr. Sneha Reddy", specialty: "Dermatologist" };
        default:
            return { name: "Dr. Priya Sharma", specialty: "Consulting Cardiologist" };
    }
};

export default function VideoCallRoom({ params }: { params: { id: string } }) {
    const router = useRouter();
    const doc = getDoctorDetails(params.id);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const selfVideoRef = useRef<HTMLVideoElement>(null);

    // Camera Preview effect with Audio fallback
    useEffect(() => {
        async function getMedia() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                setStream(mediaStream);
            } catch (err) {
                console.warn("Failed to get audio and video, trying video only...", err);
                try {
                    const videoStream = await navigator.mediaDevices.getUserMedia({ 
                        video: true, 
                        audio: false 
                    });
                    setStream(videoStream);
                } catch (e) {
                    console.error("Error accessing video device.", e);
                }
            }
        }
        getMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Toggle video tracks on/off when isVideoOff changes
    useEffect(() => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff;
            });
        }
    }, [isVideoOff, stream]);

    // Toggle audio tracks on/off when isMuted changes
    useEffect(() => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted, stream]);

    // Bind stream to self video element on mount/toggle
    useEffect(() => {
        if (selfVideoRef.current && stream && !isVideoOff) {
            selfVideoRef.current.srcObject = stream;
        }
    }, [stream, isVideoOff]);

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleEndCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (params.id.startsWith("PED")) {
            router.push("/patient/children");
        } else {
            router.push("/patient/appointments");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col font-sans select-none">
            {/* Call Header */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-30 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-md text-white font-medium text-body-sm flex items-center gap-2 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {formatTime(callDuration)}
                    </div>
                    <div className="text-white">
                        <span className="font-semibold block text-sm md:text-base">{doc.name}</span>
                        <span className="text-[10px] md:text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5" /> Secure Medical Feed Active
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/5">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/5">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/5">
                        <Maximize className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Call Viewport */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
                {/* Doctor Viewport (Simulation container) */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex flex-col items-center justify-center z-10">
                    <div className="relative">
                        {/* Pulse Ring waves simulating audio activity */}
                        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping [animation-duration:2.5s]" />
                        <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-pulse [animation-duration:1.5s]" />
                        <div className="relative w-36 h-36 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-5xl font-bold text-white shadow-2xl">
                            DP
                        </div>
                    </div>
                    
                    <h2 className="text-xl text-white font-bold font-display mt-6 tracking-wide">{doc.name}</h2>
                    <p className="text-sm text-primary-400 font-semibold mt-1">{doc.specialty}</p>
                    
                    {/* Simulated Voice Waves */}
                    <div className="flex items-center gap-1.5 mt-6 h-6">
                        {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((bar, i) => (
                            <span 
                                key={i} 
                                className="w-1 rounded bg-primary-500 animate-pulse" 
                                style={{ 
                                    height: `${bar * 6}px`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "1s"
                                }} 
                            />
                        ))}
                    </div>
                </div>

                {/* Picture in Picture (Self/Patient Camera View) */}
                <AnimatePresence>
                    {!isVideoOff && stream && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="absolute bottom-28 right-6 w-36 h-48 md:w-56 md:h-72 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 z-25"
                        >
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                <div className="w-full h-full relative">
                                    <video 
                                        autoPlay 
                                        muted 
                                        playsInline 
                                        ref={selfVideoRef}
                                        className="w-full h-full object-cover scale-x-[-1] brightness-95"
                                    />
                                    <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">You</span>
                                </div>
                            </div>
                            {/* Local mute indicator on PiP */}
                            {isMuted && (
                                <div className="absolute top-2 right-2 p-1 rounded-md bg-red-500 text-white z-30 shadow-md">
                                    <MicOff className="w-3.5 h-3.5" />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Controls Bar */}
            <div className="h-28 bg-gray-950 border-t border-white/10 flex justify-center items-center px-6 pb-safe z-30">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-4 rounded-full transition-all duration-200 border ${
                            isMuted 
                                ? 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30' 
                                : 'bg-slate-800 text-white border-white/5 hover:bg-slate-700'
                        }`}
                        title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-4 rounded-full transition-all duration-200 border ${
                            isVideoOff 
                                ? 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30' 
                                : 'bg-slate-800 text-white border-white/5 hover:bg-slate-700'
                        }`}
                        title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
                    >
                        {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="p-4 px-8 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all duration-200 ml-4 flex items-center gap-2 font-semibold"
                        title="Leave Consultation Room"
                    >
                        <PhoneOff className="w-6 h-6" />
                        <span>Leave Room</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
