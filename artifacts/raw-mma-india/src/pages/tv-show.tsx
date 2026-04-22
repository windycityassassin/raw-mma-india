import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  city: z.string().min(1, "City is required"),
  weightClass: z.string().min(1, "Weight class is required"),
  primarySport: z.string().min(1, "Primary sport is required"),
  yearsTraining: z.string().min(1, "Years training is required"),
  gymName: z.string().min(1, "Current gym name is required"),
  bouts: z.string().min(1, "Number of bouts is required"),
  record: z.string().min(1, "Win/Loss record is required"),
  footageUrl: z.string().url("Must be a valid URL").min(1, "Footage link is required"),
  instagram: z.string().optional(),
  whyRaw: z.string().max(200, "Maximum 200 characters").optional()
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const JUDGING_CRITERIA = [
  { name: "Effective Striking", desc: "Volume, accuracy, and power", looksFor: "Visible impact, cumulative damage, and control of striking exchanges." },
  { name: "Effective Grappling", desc: "Takedowns, submission attempts, control", looksFor: "Successful takedowns, dominant positions, near-submissions." },
  { name: "Aggression", desc: "Forward pressure, taking the fight to opponent", looksFor: "Consistently moving forward and initiating action." },
  { name: "Octagon Control", desc: "Cage control, ring generalship", looksFor: "Dictating the pace and location of the fight, forcing opponent to react." }
];

const SCORING_SCENARIOS = [
  { score: "10-9", desc: "Close round, one fighter slightly edges out the other." },
  { score: "10-8", desc: "Dominant round, one fighter completely controls the other, often with near-finishes." },
  { score: "10-7", desc: "Overwhelming dominance, multiple knockdowns or extended periods of severe damage." }
];

const SEASON_FORMAT = [
  { title: "8 Episodes", desc: "Per season" },
  { title: "4 Cities", desc: "Delhi, Mumbai, Bengaluru, Hyderabad — 2 episodes per city" },
  { title: "3 Bouts", desc: "Per episode, 1 contract awarded" },
  { title: "Season Finale", desc: "Top performers compete at a live RAW event" },
  { title: "Totals", desc: "24 competed, minimum 8 contracts available" }
];

const CONTENT_ENGINE = [
  { platform: "YouTube", type: "Full Episodes", cadence: "Weekly", purpose: "Build audience first, free access." },
  { platform: "Instagram Reels", type: "Fight Highlights", cadence: "Within 2 hours of filming", purpose: "Viral reach and instant engagement." },
  { platform: "Fighter Story Docs", type: "Mini-docs (5 mins)", cadence: "Before their episode airs", purpose: "Build emotional connection and stakes." },
  { platform: "Hindi Commentary Track", type: "Separate audio", cadence: "Simultaneously", purpose: "Localize content and expand reach in heartland." },
  { platform: "Press/Media", type: "Credentialed access", cadence: "Every event", purpose: "Mainstream media coverage and legitimacy." }
];

function FighterApplication() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "", age: "", city: "", weightClass: "",
      primarySport: "", yearsTraining: "", gymName: "", bouts: "", record: "",
      footageUrl: "", instagram: "", whyRaw: ""
    }
  });

  const onSubmit = (data: ApplicationFormValues) => {
    setIsSuccess(true);
  };

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["name", "age", "city", "weightClass"]);
    } else if (step === 2) {
      isValid = await form.trigger(["primarySport", "yearsTraining", "gymName", "bouts", "record"]);
    }
    if (isValid) setStep(step + 1);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#0d0d0d] border border-[#c0392b] p-12 text-center" data-testid="application-success">
        <h3 className="text-3xl font-black uppercase text-[#c0392b] mb-4">Application Received</h3>
        <p className="text-white/60 font-mono">Your application has been received. RAW scouts review all submissions within 14 days.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] border border-white/10 p-8" data-testid="application-form-container">
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 ${step >= s ? "bg-[#c0392b]" : "bg-white/10"}`} />
        ))}
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="text-xl font-black uppercase text-white mb-6">Step 1: Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Full Name</label>
                <input {...form.register("name")} data-testid="input-name" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.name && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Age</label>
                <input type="number" {...form.register("age")} data-testid="input-age" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.age && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.age.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">City</label>
                <input {...form.register("city")} data-testid="input-city" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.city && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Weight Class</label>
                <select {...form.register("weightClass")} data-testid="input-weight-class" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors appearance-none">
                  <option value="">Select Class</option>
                  <option value="Featherweight">Featherweight (66kg)</option>
                  <option value="Lightweight">Lightweight (70kg)</option>
                  <option value="Welterweight">Welterweight (77kg)</option>
                  <option value="Middleweight">Middleweight (84kg)</option>
                </select>
                {form.formState.errors.weightClass && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.weightClass.message}</p>}
              </div>
            </div>
            <button type="button" onClick={handleNext} data-testid="button-next-1" className="mt-8 bg-white text-black font-black uppercase tracking-wide py-3 px-8 hover:bg-[#c0392b] hover:text-white transition-colors">
              Next Step
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="text-xl font-black uppercase text-white mb-6">Step 2: Combat Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Primary Sport</label>
                <input {...form.register("primarySport")} data-testid="input-primary-sport" placeholder="e.g. Wrestling, Boxing, Muay Thai" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.primarySport && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.primarySport.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Years Training</label>
                <input type="number" {...form.register("yearsTraining")} data-testid="input-years-training" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.yearsTraining && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.yearsTraining.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Current Gym Name</label>
                <input {...form.register("gymName")} data-testid="input-gym-name" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.gymName && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.gymName.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Number of Bouts</label>
                <input type="number" {...form.register("bouts")} data-testid="input-bouts" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.bouts && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.bouts.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Win/Loss Record</label>
                <input {...form.register("record")} data-testid="input-record" placeholder="e.g. 5-1-0" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.record && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.record.message}</p>}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(1)} data-testid="button-back-2" className="border border-white/20 text-white font-black uppercase tracking-wide py-3 px-8 hover:bg-white/10 transition-colors">
                Back
              </button>
              <button type="button" onClick={handleNext} data-testid="button-next-2" className="bg-white text-black font-black uppercase tracking-wide py-3 px-8 hover:bg-[#c0392b] hover:text-white transition-colors">
                Next Step
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="text-xl font-black uppercase text-white mb-6">Step 3: Your Reel</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Fight Footage Link (Required)</label>
                <input {...form.register("footageUrl")} data-testid="input-footage-url" placeholder="YouTube or Google Drive URL" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
                {form.formState.errors.footageUrl && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.footageUrl.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Instagram Handle</label>
                <input {...form.register("instagram")} data-testid="input-instagram" placeholder="@username" className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Why RAW? (Max 200 chars)</label>
                <textarea {...form.register("whyRaw")} data-testid="input-why-raw" rows={4} maxLength={200} className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none transition-colors resize-none" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(2)} data-testid="button-back-3" className="border border-white/20 text-white font-black uppercase tracking-wide py-3 px-8 hover:bg-white/10 transition-colors">
                Back
              </button>
              <button type="submit" data-testid="button-submit" className="bg-[#c0392b] text-white font-black uppercase tracking-wide py-3 px-8 hover:bg-[#a93226] transition-colors">
                Submit Application
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}

const BUDGET_DATA = [
  { name: "Talent", value: 30, color: "#c0392b" },
  { name: "Crew & Equipment", value: 25, color: "#e74c3c" },
  { name: "Location & Logistics", value: 20, color: "#922b21" },
  { name: "Post-Production", value: 15, color: "#641e16" },
  { name: "Marketing", value: 10, color: "#4a0000" },
];

const EPISODE_TIMELINE = [
  {
    day: "Day 1",
    title: "Filming & Interviews",
    items: [
      "Fighter arrival and weigh-in ceremony",
      "1-on-1 pre-fight interviews in fighter rooms",
      "B-roll of training, warm-ups, strategy sessions",
      "Coach and trainer commentary filmed",
      "Crowd and atmosphere footage for atmosphere cuts",
    ],
  },
  {
    day: "Day 2",
    title: "Fight Day",
    items: [
      "Morning walkthrough and fighter prep",
      "4-camera live fight coverage (wide, cage-side, overhead, corner)",
      "Commentary team records live — Hindi and English",
      "Medical staff ringside throughout",
      "Post-fight contract ceremony filmed for dramatic reveal",
    ],
  },
];

const WEIGHT_CLASSES = [
  { name: "Featherweight", limit: "66 kg", notes: "Fastest growing division in Asian MMA" },
  { name: "Lightweight", limit: "70 kg", notes: "India's deepest talent pool — boxing crossovers" },
  { name: "Welterweight", limit: "77 kg", notes: "Wrestling-dominant, Haryana crossover zone" },
  { name: "Middleweight", limit: "84 kg", notes: "Kabaddi and judo athlete convergence" },
];

const CITIES = [
  { name: "Delhi", state: "Delhi NCR", reason: "Wrestling and combat sports heartland. Massive gym network.", x: 340, y: 195 },
  { name: "Mumbai", state: "Maharashtra", reason: "Largest media market. Boxing tradition. Production infrastructure.", x: 260, y: 340 },
  { name: "Bengaluru", state: "Karnataka", reason: "Youth tech demographic. Fastest growing MMA scene in South India.", x: 310, y: 420 },
  { name: "Hyderabad", state: "Telangana", reason: "Central hub connecting north-south circuits. Strong combat culture.", x: 320, y: 375 },
];

const CREW = [
  { role: "Director", count: 1, desc: "Oversees creative direction, storytelling, and episode narrative arc" },
  { role: "Camera Operators", count: 4, desc: "Wide, cage-side, overhead, and corner-side dedicated positions" },
  { role: "Commentary Team", count: 2, desc: "Lead commentator + color analyst — Hindi and English alternating" },
  { role: "Cage-side Crew", count: 6, desc: "Ring card, floor director, lighting, timing, scorers" },
  { role: "Medical Staff", count: 3, desc: "Chief medical officer, two ringside physicians — mandatory per Unified Rules" },
  { role: "Post-Production", count: 4, desc: "Editor, colorist, sound designer, graphics/motion" },
];

const DISTRIBUTION = [
  { platform: "YouTube", tier: "Primary", detail: "Full episodes free. Short-form clips push organic discovery. Target 1M subscribers in 18 months." },
  { platform: "JioStar", tier: "Secondary", detail: "OTT licensing pitch begins Year 1. Package: 8-episode Season 1 with highlight rights." },
  { platform: "Sony LIV", tier: "Secondary", detail: "Non-exclusive pitch as alternative OTT partner. Negotiation opens after YouTube traction." },
  { platform: "Regional TV", tier: "Year 2", detail: "Hindi Sports, Zee Sports, and regional language networks once national brand is established." },
];

function IndiaMap() {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const active = CITIES.find((c) => c.name === activeCity);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="relative">
        <svg viewBox="80 80 400 480" width="340" height="400" className="max-w-full">
          <path
            d="M340,90 L380,100 L420,130 L440,160 L450,200 L460,240 L450,280 L430,310 L400,340 L380,370 L360,400 L340,430 L320,450 L300,460 L280,450 L260,430 L240,410 L220,390 L200,360 L190,330 L185,300 L190,270 L200,240 L210,210 L220,180 L230,150 L250,120 L280,100 L310,90 Z M285,200 L300,190 L320,195 L330,210 L325,225 L310,230 L295,225 L285,215 Z"
            fill="#1a1a1a"
            stroke="#c0392b"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <path
            d="M210,150 L230,140 L250,145 L255,160 L245,175 L230,178 L215,170 Z"
            fill="#1a1a1a"
            stroke="#c0392b"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <path
            d="M300,460 L310,480 L320,500 L315,515 L305,520 L295,515 L285,500 L280,485 Z"
            fill="#1a1a1a"
            stroke="#c0392b"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          {CITIES.map((city) => (
            <g key={city.name} onClick={() => setActiveCity(activeCity === city.name ? null : city.name)} className="cursor-pointer">
              <circle
                cx={city.x}
                cy={city.y}
                r={activeCity === city.name ? 10 : 7}
                fill={activeCity === city.name ? "#c0392b" : "#c0392b"}
                opacity={activeCity === city.name ? 1 : 0.7}
              />
              <circle
                cx={city.x}
                cy={city.y}
                r={activeCity === city.name ? 18 : 14}
                fill="none"
                stroke="#c0392b"
                strokeWidth="1"
                opacity={activeCity === city.name ? 0.5 : 0.2}
                strokeDasharray={activeCity === city.name ? "none" : "3 4"}
              />
              <text
                x={city.x + 14}
                y={city.y + 4}
                fill={activeCity === city.name ? "#c0392b" : "#ffffff99"}
                fontSize="9"
                fontWeight="bold"
                fontFamily="system-ui"
                letterSpacing="1"
                style={{ textTransform: "uppercase" }}
              >
                {city.name}
              </text>
            </g>
          ))}
          <text x="430" y="490" fill="#c0392b30" fontSize="8" fontFamily="system-ui" letterSpacing="1">INDIA</text>
        </svg>
      </div>

      <div className="flex-1">
        <div className="text-xs text-white/30 uppercase tracking-widest font-bold mb-4">Year 1 Launch Cities — Click to Explore</div>
        {active ? (
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d0d] border border-[#c0392b]/40 p-6 mb-4"
          >
            <div className="text-[#c0392b] text-xs uppercase tracking-widest font-bold mb-1">{active.state}</div>
            <h4 className="text-2xl font-black uppercase text-white mb-3">{active.name}</h4>
            <p className="text-white/60 font-mono text-sm">{active.reason}</p>
          </motion.div>
        ) : null}
        <div className="space-y-2">
          {CITIES.map((city) => (
            <button
              key={city.name}
              data-testid={`button-city-${city.name.toLowerCase()}`}
              onClick={() => setActiveCity(activeCity === city.name ? null : city.name)}
              className={`w-full text-left p-3 border transition-colors duration-200 ${
                activeCity === city.name
                  ? "border-[#c0392b] text-[#c0392b] bg-[#c0392b]/5"
                  : "border-white/10 text-white/60 hover:border-white/30"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-widest">{city.name}</span>
              <span className="text-xs text-white/30 ml-2 font-mono">{city.state}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TVShowPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#c0392b]" />
            <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest">Operational Blueprint</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
            The RAW <br />
            <span className="text-[#c0392b]">Contender</span> Series
          </h1>
          <p className="text-xl text-white/60 font-mono max-w-3xl border-l-4 border-[#c0392b] pl-6">
            Modeled on Dana White's Contender Series — filmed regional trials, 8-10 fighters per episode, one professional contract awarded per episode. Unified MMA rules throughout.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { stat: "8-10", label: "Fighters Per Episode" },
            { stat: "1", label: "Contract Per Episode" },
            { stat: "8", label: "Episodes — Season 1" },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-white/10 p-8">
              <div className="text-5xl font-black text-[#c0392b] mb-2">{item.stat}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Weight <span className="text-[#c0392b]">Classes — Launch</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEIGHT_CLASSES.map((wc, i) => (
              <div key={i} data-testid={`card-weight-${i}`} className="bg-[#0d0d0d] border border-white/10 p-6 flex gap-6 items-start">
                <div className="text-[#c0392b] text-2xl font-black w-16 text-center">{wc.limit}</div>
                <div>
                  <div className="text-white font-black uppercase tracking-tight mb-1">{wc.name}</div>
                  <div className="text-white/50 font-mono text-sm">{wc.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Episode <span className="text-[#c0392b]">Format</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EPISODE_TIMELINE.map((day, i) => (
              <div key={i} data-testid={`card-episode-day-${i}`} className="bg-[#0d0d0d] border border-white/10 p-8">
                <div className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-1">{day.day}</div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6">{day.title}</h3>
                <ul className="space-y-3">
                  {day.items.map((item, j) => (
                    <li key={j} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c0392b] mt-2 flex-shrink-0" />
                      <span className="text-white/60 font-mono text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Fighter <span className="text-[#c0392b]">Discovery</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { method: "Regional Tryouts", detail: "4-city open call events. Any fighter with 3+ amateur bouts can apply. Evaluated by RAW-certified coaches." },
              { method: "Gym Referrals", detail: "Affiliated gym owners submit fighter profiles. Priority access for network gyms. Quarterly review cycle." },
              { method: "Social Submission", detail: "Video submission portal. Fighters upload fight footage, stats, and training reels. RAW scouts review bi-weekly." },
            ].map((item, i) => (
              <div key={i} data-testid={`card-discovery-${i}`} className="bg-[#0d0d0d] border border-white/10 p-6">
                <div className="text-[#c0392b] font-black uppercase tracking-tight mb-3">{item.method}</div>
                <p className="text-white/60 font-mono text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Production <span className="text-[#c0392b]">Crew</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-crew">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-bold">Role</th>
                  <th className="text-center py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-bold">Headcount</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-bold">Responsibilities</th>
                </tr>
              </thead>
              <tbody>
                {CREW.map((c, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-4 px-4 font-bold text-white uppercase tracking-wide text-sm">{c.role}</td>
                    <td className="py-4 px-4 text-center text-[#c0392b] font-black text-xl">{c.count}</td>
                    <td className="py-4 px-4 text-white/50 font-mono text-sm">{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Year 1 <span className="text-[#c0392b]">Location Strategy</span>
          </h2>
          <IndiaMap />
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Budget <span className="text-[#c0392b]">Breakdown</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#0d0d0d] border border-white/10 p-8">
            <div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={BUDGET_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {BUDGET_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v}%`, ""]}
                    contentStyle={{ background: "#0d0d0d", border: "1px solid #c0392b33", color: "#fff", fontFamily: "monospace", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {BUDGET_DATA.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-3 h-3 flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-sm uppercase tracking-wide">{item.name}</span>
                      <span className="text-[#c0392b] font-black">{item.value}%</span>
                    </div>
                    <div className="mt-1 h-1 bg-white/10 w-full">
                      <div className="h-1" style={{ width: `${item.value}%`, background: item.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Distribution <span className="text-[#c0392b]">Strategy</span>
          </h2>
          <div className="space-y-4">
            {DISTRIBUTION.map((d, i) => (
              <div key={i} data-testid={`card-distribution-${i}`} className="bg-[#0d0d0d] border border-white/10 p-6 flex gap-6 items-start">
                <div className="flex-shrink-0 text-center min-w-[100px]">
                  <div className="text-white font-black uppercase">{d.platform}</div>
                  <div
                    className={`text-xs font-bold uppercase tracking-widest mt-1 ${
                      d.tier === "Primary" ? "text-[#c0392b]" : d.tier === "Secondary" ? "text-white/50" : "text-white/30"
                    }`}
                  >
                    {d.tier}
                  </div>
                </div>
                <div className="h-full w-[1px] bg-white/10 flex-shrink-0" />
                <p className="text-white/60 font-mono text-sm">{d.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 1. FIGHTER APPLICATION SECTION */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeIn} 
          className="mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Apply to the <span className="text-[#c0392b]">Contender Series</span>
          </h2>
          <p className="text-white/60 font-mono mb-8 max-w-2xl">
            We are currently casting for Season 1. If you have the skills, the heart, and the story to become India's next MMA star, submit your application below.
          </p>
          <FighterApplication />
        </motion.div>

        {/* 2. JUDGING & SCORING CRITERIA */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeIn} 
          className="mb-24"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            How Fights <span className="text-[#c0392b]">Are Judged</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {JUDGING_CRITERIA.map((criterion, i) => (
              <div key={i} data-testid={`card-judging-${i}`} className="bg-[#0d0d0d] border border-white/10 p-6 hover:border-[#c0392b]/50 transition-colors">
                <h3 className="text-xl font-black uppercase text-white mb-2">{criterion.name}</h3>
                <p className="text-[#c0392b] font-mono text-sm mb-4">{criterion.desc}</p>
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">What Judges Look For</div>
                  <p className="text-white/70 text-sm">{criterion.looksFor}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-black border border-[#c0392b]/30 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0392b]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <h3 className="text-xl font-black uppercase text-white mb-6 relative z-10">The 10-Point Must System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {SCORING_SCENARIOS.map((scenario, i) => (
                <div key={i} data-testid={`card-scoring-${i}`}>
                  <div className="text-3xl font-black text-[#c0392b] mb-2">{scenario.score}</div>
                  <p className="text-white/60 text-sm font-mono">{scenario.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3. THE SEASON FORMAT */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeIn} 
          className="mb-24"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            The Season <span className="text-[#c0392b]">Format</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { stat: "24", label: "Fighters" },
              { stat: "8", label: "Contracts" },
              { stat: "4", label: "Cities" },
              { stat: "1", label: "Season" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#c0392b]/10 border border-[#c0392b]/30 p-6 text-center">
                <div className="text-4xl font-black text-[#c0392b] mb-1">{stat.stat}</div>
                <div className="text-xs uppercase tracking-widest text-white/70 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#c0392b] before:via-[#c0392b]/50 before:to-transparent">
            {SEASON_FORMAT.map((step, i) => (
              <div key={i} data-testid={`timeline-season-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-black bg-[#c0392b] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_0_2px_rgba(192,57,43,0.2)]"></div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-[#0d0d0d] border border-white/10 p-6">
                  <h4 className="text-xl font-black uppercase text-white mb-1">{step.title}</h4>
                  <p className="text-white/60 font-mono text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4. THE CONTENT ENGINE */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeIn} 
          className="mb-24"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            The Content <span className="text-[#c0392b]">Engine</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {CONTENT_ENGINE.map((content, i) => (
              <div key={i} data-testid={`card-content-${i}`} className="bg-[#0d0d0d] border border-white/10 p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <div className="text-xs uppercase tracking-widest text-[#c0392b] font-bold mb-4">{content.platform}</div>
                <h4 className="text-lg font-black uppercase text-white mb-4 flex-1">{content.type}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Cadence</div>
                    <div className="text-sm font-mono text-white/80">{content.cadence}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Purpose</div>
                    <div className="text-sm text-white/60">{content.purpose}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
