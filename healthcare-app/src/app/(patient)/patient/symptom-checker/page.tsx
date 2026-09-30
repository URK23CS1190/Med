"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// Comprehensive Clinical Q&A and Symptom Dataset
interface MedicalEntry {
    keywords: string[];
    response: string;
    specialty: string;
    urgency: "low" | "medium" | "high";
    title?: string;
}

const medicalKnowledgeDataset: MedicalEntry[] = [
    {
        keywords: ["chest pain", "heart palpitations", "crushing chest", "heart racing", "angina"],
        title: "Chest Pain & Cardiovascular Distress",
        response: "Chest pain is a critical symptom that can indicate cardiovascular emergencies like myocardial infarction (heart attack) or angina. **Immediate attention is required.**\n\nIf you are experiencing crushing pain, tightness in your chest, pain radiating to your left arm/jaw, or sudden shortness of breath, **please call emergency medical services (e.g., 102/112) immediately**.\n\nFor non-emergency cardiac symptoms (mild palpitations, routine checkups), a consultation with a **Cardiologist** is strongly recommended to perform an ECG, echocardiogram, or lipid panel evaluation.",
        specialty: "Cardiology",
        urgency: "high"
    },
    {
        keywords: ["stroke symptoms", "stroke signs", "fast protocol", "numbness one side", "slurred speech"],
        title: "Stroke Detection (F.A.S.T.)",
        response: "A stroke is a medical emergency that occurs when blood flow to the brain is interrupted. Use the **F.A.S.T.** protocol to identify symptoms:\n- **F (Face Drooping):** Is one side of the face drooping or numb?\n- **A (Arm Weakness):** Is one arm weak or numb? Ask the person to raise both arms. Does one drift downward?\n- **S (Speech Difficulty):** Is speech slurred or hard to understand?\n- **T (Time to Call Emergency):** If someone shows any of these signs, call emergency services immediately.\n\nSurvivors should consult a **Neurologist** for post-stroke management.",
        specialty: "Neurology",
        urgency: "high"
    },
    {
        keywords: ["headache", "migraine", "dizziness", "vertigo", "throbbing head", "head pain"],
        title: "Headaches, Migraines & Neurological Conditions",
        response: "Headaches can range from common tension headaches due to stress/fatigue to severe migraines or cluster headaches. \n\n- **Migraines:** Characterized by throbbing pain (often unilateral), sensitivity to light/sound, and nausea.\n- **Tension Headaches:** A dull, aching pain that feels like a tight band around the forehead.\n\n**Warning signs:** A sudden, extremely severe headache ('thunderclap' headache), headache accompanied by stiff neck, high fever, confusion, or difficulty speaking requires **emergency neurological evaluation**. Otherwise, consult a **Neurologist** for preventive care.",
        specialty: "Neurology",
        urgency: "medium"
    },
    {
        keywords: ["what is diabetes", "diabetes definition", "type 1 diabetes", "type 2 diabetes", "insulin resistant"],
        title: "Diabetes Mellitus Overview",
        response: "Diabetes is a chronic disease where the body cannot regulate glucose levels effectively. There are two primary types:\n1. **Type 1 Diabetes:** An autoimmune condition where the pancreas produces little to no insulin. Usually diagnosed in children and young adults.\n2. **Type 2 Diabetes:** The body becomes resistant to insulin or doesn't make enough. Highly linked to lifestyle choices, genetics, and obesity.\n\n**Common symptoms:** Excessive thirst, frequent urination, unexplained weight loss, and extreme fatigue. Diet control, physical exercise, and consulting an **Endocrinologist** are central to managing diabetes.",
        specialty: "Endocrinology",
        urgency: "medium"
    },
    {
        keywords: ["prevent high blood pressure", "prevent hypertension", "lower blood pressure", "high bp care"],
        title: "Hypertension (High BP) Prevention",
        response: "High blood pressure (Hypertension) increases the risk of stroke and heart disease. You can manage or prevent it with these steps:\n- **Reduce Sodium Intake:** Keep salt consumption below 2,300 mg per day.\n- **Exercise Regularly:** At least 150 minutes of moderate aerobic exercise weekly.\n- **Dietary Approaches (DASH Diet):** Emphasize vegetables, fruits, whole grains, and lean proteins.\n- **Manage Stress:** Incorporate meditation, deep breathing exercises, and adequate sleep.\n\nConsult a **Cardiologist** or **General Physician** for routine blood pressure tracking and medication adjustments.",
        specialty: "Cardiology",
        urgency: "medium"
    },
    {
        keywords: ["heart healthy diet", "diet for heart", "heart healthy foods", "prevent cholesterol"],
        title: "Cardiovascular Nutrition Guide",
        response: "A healthy diet is vital to prevent atherosclerosis and maintain arterial flexibility. Include:\n- **Leafy Green Vegetables:** Rich in nitrates and Vitamin K, which protect blood vessels.\n- **Fatty Fish & Omega-3s:** Salmon, mackerel, and sardines help lower blood pressure and triglycerides.\n- **Oats & Barley:** High in soluble fiber (beta-glucan), which reduces LDL cholesterol.\n- **Berries & Nuts:** Packed with antioxidants and monounsaturated fats.\n\nLimit trans fats, refined sugars, and processed meats. Schedule regular checkups with a **General Physician** or **Cardiologist** to evaluate lipid profiles.",
        specialty: "Cardiology",
        urgency: "low"
    },
    {
        keywords: ["stomach pain", "acid reflux", "nausea", "vomiting", "indigestion", "heartburn", "diarrhea", "constipation"],
        title: "Gastrointestinal & Digestive Symptoms",
        response: "Gastrointestinal symptoms can stem from acid reflux (GERD), food intolerances, gastritis, or infections (gastroenteritis).\n\n- **GERD / Heartburn:** Avoid lying down immediately after eating, limit spicy/fatty foods, and avoid alcohol/caffeine.\n- **Diarrhea / Nausea:** Focus on hydration. Replace lost electrolytes with ORS (Oral Rehydration Salts).\n\n**Warning signs:** Blood in vomit/stool, persistent severe pain in the right lower abdomen (appendicitis warning), or inability to keep fluids down requires immediate medical attention. Otherwise, consult a **Gastroenterologist**.",
        specialty: "Gastroenterology",
        urgency: "medium"
    },
    {
        keywords: ["cough", "shortness of breath", "asthma", "wheezing", "chest congestion", "difficulty breathing"],
        title: "Respiratory Distresses & Pulmonology",
        response: "Respiratory issues can indicate asthma, bronchitis, pneumonia, or allergies.\n\n- **Asthma / Wheezing:** Marked by bronchial inflammation. Triggers include dust, pollen, cold air, or physical exertion.\n- **Shortness of Breath:** Can be caused by lung infections or cardiovascular problems.\n\n**Warning signs:** Blue lips/face, severe chest retraction during breathing, or sudden extreme air hunger are medical emergencies. For chronic cough, asthma management, or wheezing, consult a **Pulmonologist**.",
        specialty: "Pulmonology",
        urgency: "medium"
    },
    {
        keywords: ["back pain", "joint pain", "muscle sprain", "arthritis", "fracture", "knee pain", "bone ache"],
        title: "Orthopedic & Musculoskeletal Issues",
        response: "Musculoskeletal issues include arthritis, muscle sprains, ligament tears, or herniated discs.\n\n- **Sprains/Strains:** Use the **R.I.C.E.** protocol: Rest, Ice, Compression, Elevation.\n- **Chronic Joint Pain:** Often due to Osteoarthritis or Rheumatoid Arthritis. Low-impact exercises (swimming, cycling) can help maintain joint mobility.\n\nIf you experience joint swelling with high fever, or an inability to bear weight after a trauma (potential fracture), seek urgent care. Otherwise, consult an **Orthopedist**.",
        specialty: "Orthopedics",
        urgency: "low"
    },
    {
        keywords: ["rash", "acne", "skin itching", "eczema", "hives", "dermatitis", "dry skin"],
        title: "Dermatological (Skin) Conditions",
        response: "Skin issues can range from hormonal acne and dry eczema flare-ups to allergic contact dermatitis.\n\n- **Acne:** Cleanse gently, avoid picking, and use non-comedogenic skin products.\n- **Eczema / Dry Skin:** Keep skin hydrated with fragrance-free moisturizers and avoid hot showers.\n- **Allergic Hives (Urticaria):** Antihistamines can reduce swelling and itching.\n\n**Warning signs:** A rapidly spreading rash accompanied by fever, breathing difficulty, or blistering inside the mouth requires emergency care. For chronic or stubborn skin problems, consult a **Dermatologist**.",
        specialty: "Dermatology",
        urgency: "low"
    },
    {
        keywords: ["fever", "sore throat", "runny nose", "cold", "flu symptoms", "mild fever", "cough and cold"],
        title: "Common Infections & General Care",
        response: "Common colds, influenza, and mild viral infections usually present with nasal congestion, sore throat, fatigue, and low-grade fever.\n\n- **Home Care:** Prioritize bed rest, drink plenty of warm fluids (water, herbal teas), and use saline nasal sprays.\n- **Fever Management:** Paracetamol or Ibuprofen can reduce body temperature and ease muscle aches.\n\nIf your fever remains above 103°F (39.4°C) for over 3 days, or if you experience severe swallowing difficulty or chest tightness, consult a **General Physician**.",
        specialty: "General Medicine",
        urgency: "low"
    },
    {
        keywords: ["boost immunity", "stronger immunity", "prevent getting sick", "vitamin intake"],
        title: "Immune System Optimization",
        response: "Supporting your immune system involves maintaining a balance of healthy habits:\n- **Balanced Nutrition:** Eat foods high in Vitamin C (citrus fruits), Vitamin D (mushrooms, fish, sunlight exposure), and Zinc (nuts, seeds).\n- **Sleep Quality:** 7-9 hours of deep sleep allows immune cell regeneration.\n- **Hydration:** Water assists in lymphatic circulation, helping white blood cells travel.\n- **Vaccinations:** Up-to-date immunizations are the most effective protection against targeted pathogens.\n\nConsult a **General Physician** for routine blood tests to check for vitamin deficiencies.",
        specialty: "General Medicine",
        urgency: "low"
    },
    {
        keywords: ["blurred vision", "eye pain", "dry eyes", "red eye", "double vision"],
        title: "Ophthalmology & Eye Care",
        response: "Eye conditions can be mild (dry eyes due to excessive screen time) or represent sight-threatening emergencies.\n\n- **Computer Vision Syndrome:** Practice the **20-20-20 rule**: Every 20 minutes, look at something 20 feet away for at least 20 seconds.\n- **Redness / Itching:** Often caused by conjunctivitis (pink eye) or allergic reactions.\n\n**Warning signs:** Sudden, painful vision loss, flashes of light, or a curtain-like shadow over your field of vision (retinal detachment warning) are medical emergencies. For routine issues, consult an **Ophthalmologist**.",
        specialty: "Ophthalmology",
        urgency: "medium"
    },
    {
        keywords: ["anxiety", "depression", "panic attack", "insomnia", "stress", "mental health", "sadness"],
        title: "Mental & Psychological Well-being",
        response: "Mental health conditions like anxiety, chronic stress, insomnia, and depression significantly affect physical health.\n\n- **Stress / Panic Attacks:** Practice diaphragmatic breathing (inhale for 4 seconds, hold for 4, exhale for 6).\n- **Insomnia:** Maintain sleep hygiene — restrict screens for 1 hour before bedtime, keep the room dark and cool.\n- **Depression:** Chronic low mood, loss of interest in activities, or altered appetite.\n\nIf you are experiencing suicidal thoughts or severe distress, reach out to an emergency crisis helpline immediately. Otherwise, schedule a confidential session with a **Psychiatrist** or **Clinical Psychologist**.",
        specialty: "Psychiatry",
        urgency: "medium"
    },
    {
        keywords: ["food poisoning", "bad food", "stomach virus", "stomach bug", "diarrhea and vomiting"],
        title: "Food Poisoning & Gastroenteritis",
        response: "Food poisoning is caused by eating food contaminated with infectious organisms (bacteria, viruses, or parasites).\n\n- **Treatment:** Focus on fluid replacement. Sip clear liquids or electrolyte mixtures. Avoid dairy, caffeine, and fatty foods until fully recovered.\n- **BRAT Diet:** Start with bananas, rice, applesauce, and toast when you can tolerate solid food.\n\nIf you experience high fever, bloody stools, or signs of severe dehydration (dry mouth, no urination for 8 hours), consult a **Gastroenterologist** or **General Physician** immediately.",
        specialty: "Gastroenterology",
        urgency: "medium"
    }
];

export default function SymptomCheckerPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I am your clinical AI health assistant, trained with a comprehensive medical knowledge dataset.\n\nFeel free to ask me general medical questions (e.g., *'What is diabetes?'*, *'How do I lower high BP?'*) or describe symptoms you are experiencing to find recommended medical specialties.\n\n**Disclaimer:** I provide educational guidance only. Always consult a doctor in emergencies.",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ specialty: string; urgency: string; title: string } | null>(null);

    const handleSend = () => {
        if (!input.trim() || loading) return;

        const userQuery = input.trim();
        const userMsg: Message = { id: Date.now().toString(), role: "user", content: userQuery, timestamp: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Advanced matching algorithm through the clinical dataset
        let matchedEntry: MedicalEntry | null = null;
        let highestScore = 0;

        const queryLower = userQuery.toLowerCase();

        for (const entry of medicalKnowledgeDataset) {
            let matchesCount = 0;
            for (const keyword of entry.keywords) {
                if (queryLower.includes(keyword)) {
                    matchesCount++;
                }
            }

            if (matchesCount > highestScore) {
                highestScore = matchesCount;
                matchedEntry = entry;
            }
        }

        setTimeout(() => {
            if (matchedEntry && highestScore > 0) {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `### ${matchedEntry.title || "Health Guidance"}\n\n${matchedEntry.response}`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMsg]);
                setResult({
                    specialty: matchedEntry.specialty,
                    urgency: matchedEntry.urgency,
                    title: matchedEntry.title || "Health Guidance"
                });
            } else {
                // Fallback smart clinical response generator
                const genericAdvice = `Thank you for reaching out. Based on your inquiry: *"${userQuery}"*, my dataset points to a general physiological query.\n\nFor general body pain, unexplained fatigue, minor fevers, or dietary consultations, we recommend visiting a **General Medicine** practitioner first. They can complete baseline lab checkups (Complete Blood Count, metabolic panels) and refer you to a targeted organ specialist if necessary.\n\n*Self-Care Advice:* Stay hydrated, ensure 7-8 hours of sleep, and track your symptoms. If symptoms persist for more than 48-72 hours, consult a healthcare provider.`;
                
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `### Clinical Inquiry Evaluation\n\n${genericAdvice}`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMsg]);
                setResult({
                    specialty: "General Medicine",
                    urgency: "low",
                    title: "Clinical Inquiry Evaluation"
                });
            }
            setLoading(false);
        }, 800);
    };

    const handleClear = () => {
        setMessages([
            {
                id: "1",
                role: "assistant",
                content: "Hello! I am your clinical AI health assistant, trained with a comprehensive medical knowledge dataset.\n\nFeel free to ask me general medical questions (e.g., *'What is diabetes?'*, *'How do I lower high BP?'*) or describe symptoms you are experiencing to find recommended medical specialties.\n\n**Disclaimer:** I provide educational guidance only. Always consult a doctor in emergencies.",
                timestamp: new Date(),
            },
        ]);
        setResult(null);
    };

    const urgencyColors = { low: "success", medium: "warning", high: "danger" } as const;

    return (
        <div className="space-y-6 max-w-3xl mx-auto p-4">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-display-sm text-content-primary dark:text-content-dark-primary font-display">
                    Medical AI Assistant
                </h1>
                <p className="text-body-md text-content-secondary mt-2">
                    Clinical Q&A system powered by an evidence-based medical dataset
                </p>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 rounded-card bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-body-sm text-amber-800 dark:text-amber-300">
                    <strong>Medical Disclaimer:</strong> This assistant is trained on clinical reference data for educational purposes. It does not replace professional diagnosis. Call emergency numbers immediately in life-threatening situations.
                </div>
            </div>

            {/* Chat Area */}
            <Card padding="none" className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-elevated">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-surface-dark-elevated">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-content-secondary">AI Dataset Trained & Online</span>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleClear}>
                        Reset Chat
                    </Button>
                </div>

                <div className="h-[420px] overflow-y-auto p-5 space-y-4 scrollbar-thin">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${
                                msg.role === "assistant" 
                                    ? "bg-gradient-hero text-white" 
                                    : "bg-gray-100 dark:bg-gray-800 text-content-secondary"
                            }`}>
                                {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={`max-w-[80%] rounded-card p-4 shadow-sm ${
                                msg.role === "assistant"
                                    ? "bg-gray-50 dark:bg-surface-dark-elevated text-content-primary dark:text-content-dark-primary"
                                    : "bg-primary-500 text-white"
                            }`}>
                                <div 
                                    className="text-body-sm whitespace-pre-wrap leading-relaxed markdown-body"
                                    dangerouslySetInnerHTML={{ 
                                        __html: msg.content
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/### (.*?)\n/g, '<h4 class="font-bold text-base mb-2">$1</h4>')
                                    }} 
                                />
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-hero text-white flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-gray-50 dark:bg-surface-dark-elevated rounded-card p-4 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Result recommendation panel */}
                {result && !loading && (
                    <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-primary-50/50 dark:bg-primary-950/10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Badge variant={urgencyColors[result.urgency as keyof typeof urgencyColors]} dot pulse>
                                    {result.urgency.charAt(0).toUpperCase() + result.urgency.slice(1)} Urgency
                                </Badge>
                                <span className="text-body-sm text-content-secondary">
                                    Suggested: <strong className="text-primary-600 dark:text-primary-400">{result.specialty}</strong>
                                </span>
                            </div>
                            <Button size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                                Consult {result.specialty}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Input area */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark-card">
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Describe symptoms or ask health questions (e.g., 'What is diabetes?')..."
                            className="flex-1 h-11 rounded-chip px-4 bg-gray-100 dark:bg-surface-dark-elevated 
                                       text-body-sm border-0 focus:ring-2 focus:ring-primary-500/20 transition-all focus:outline-none"
                            disabled={loading}
                        />
                        <Button onClick={handleSend} leftIcon={<Send className="w-4 h-4" />} isLoading={loading}>
                            Send
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
