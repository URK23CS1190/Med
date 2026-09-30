"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
    Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, 
    Settings, Share2, ClipboardList, Activity, Wifi
} from "lucide-react";
import { Button, Avatar, Card } from "@/components/ui";

export default function DoctorCallRoom() {
    const router = useRouter();
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

    // Bind stream to doctor self video element on mount/toggle
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
        router.push("/doctor/appointments");
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
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm md:text-base">Riya Sharma • Patient</span>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5" /> Secure Consultation Feed
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/5">
                        <ClipboardList className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/5">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Video Viewport */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
                {/* Patient Viewport (Simulation Container) */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex flex-col items-center justify-center z-10">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping [animation-duration:2.5s]" />
                        <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-pulse [animation-duration:1.5s]" />
                        <Avatar fallback="RS" size="xl" className="w-36 h-36 border-4 border-slate-700 flex items-center justify-center text-4xl font-bold text-white shadow-2xl" />
                    </div>
                    
                    <p className="text-xl text-white font-bold font-display mt-6 tracking-wide">Riya Sharma</p>
                    <p className="text-sm text-primary-400 font-semibold mt-1">28F • Palpitations Consultation</p>
                    
                    {/* Simulated Voice Wave */}
                    <div className="flex items-center gap-1.5 mt-6 h-6">
                        {[1, 2, 3, 4, 3, 2, 3, 4, 1].map((bar, i) => (
                            <span 
                                key={i} 
                                className="w-1 rounded bg-primary-500 animate-pulse" 
                                style={{ 
                                    height: `${bar * 6}px`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "1.2s"
                                }} 
                            />
                        ))}
                    </div>
                </div>

                {/* Picture in Picture (Self/Doctor Camera View) */}
                <div className="absolute bottom-28 right-6 w-36 h-48 md:w-56 md:h-72 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 z-25 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                        {isVideoOff || !stream ? (
                            <div className="text-center p-4">
                                <Avatar fallback="Dr" size="md" className="mx-auto mb-2 border border-slate-700" />
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Camera Off</p>
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                <video 
                                    autoPlay 
                                    muted 
                                    playsInline 
                                    ref={selfVideoRef}
                                    className="w-full h-full object-cover scale-x-[-1] brightness-95"
                                />
                                <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">You</span>
                            </div>
                        )}
                    </div>
                    {/* Local mute indicator on PiP */}
                    {isMuted && (
                        <div className="absolute top-2 right-2 p-1 rounded-md bg-red-500 text-white z-30 shadow-md">
                            <MicOff className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>

                {/* Floating Patient Stats (Doctor Exclusive View) */}
                <div className="absolute left-6 bottom-32 hidden md:block z-20">
                    <Card padding="sm" className="bg-black/60 backdrop-blur-md border-white/10 text-white w-64 shadow-2xl">
                        <h4 className="text-caption font-bold text-white/50 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-primary-500 animate-pulse" /> Patient Vitals
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center border-b border-white/5 pb-1">
                                <span className="text-white/70">Heart Rate</span>
                                <span className="font-bold text-red-400">72 BPM</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-1">
                                <span className="text-white/70">Oxygen Level</span>
                                <span className="font-bold text-emerald-400">98%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">BP Check</span>
                                <span className="font-bold text-blue-400">120/80</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="p-6 md:p-8 flex justify-center items-center gap-6 bg-gray-950 border-t border-white/10 z-30">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full border ${isMuted ? "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30" : "bg-white/10 text-white border-white/5 hover:bg-white/20"}`}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`w-14 h-14 rounded-full border ${isVideoOff ? "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30" : "bg-white/10 text-white border-white/5 hover:bg-white/20"}`}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-full bg-white/10 text-white border border-white/5 hover:bg-white/20"
                >
                    <Share2 className="w-6 h-6" />
                </Button>

                <div className="w-px h-10 bg-white/10 mx-2 hidden md:block" />

                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-3xl hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] active:scale-90 transition-all flex items-center justify-center"
                >
                    <PhoneOff className="w-8 h-8" />
                </Button>
            </div>
        </div>
    );
}
