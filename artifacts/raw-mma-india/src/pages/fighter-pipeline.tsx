import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const PIPELINE_STEPS = [
  {
    step: 1,
    title: "Discovery",
    desc: "Scouts identify athletes through open tryouts, gym referrals, and social submission. Target: wrestlers, boxers, kabaddi players.",
    duration: "Ongoing",
  },
  {
    step: 2,
    title: "Physical Assessment",
    desc: "Standardized battery: VO2 max, strength-to-weight ratio, movement screening, reaction time. Minimum bar for advancement.",
    duration: "3 Days",
  },
  {
    step: 3,
    title: "6-Week Training Camp",
    desc: "Structured curriculum under RAW-certified coaches. Stand-up, wrestling, BJJ, clinch, conditioning. Morning and evening sessions.",
    duration: "6 Weeks",
  },
  {
    step: 4,
    title: "Showcase Bout",
    desc: "Internal or semi-public bout with RAW officials scoring. Performance, aggression, coachability, and fight IQ evaluated.",
    duration: "1 Day",
  },
  {
    step: 5,
    title: "Contract Decision",
    desc: "RAW team reviews footage, scores, and camp performance. Contract offer, deferral, or release decision delivered within 72 hours.",
    duration: "72 Hours",
  },
];

const ASSESSMENT_CRITERIA = [
  { criterion: "VO2 Max & Conditioning", weight: 25, measure: "5-round pace ability" },
  { criterion: "Takedown/Clinch Ability", weight: 20, measure: "3-min grappling eval" },
  { criterion: "Striking Mechanics", weight: 20, measure: "Mitt work + bag work" },
  { criterion: "Fight IQ", weight: 20, measure: "Sparring review" },
  { criterion: "Coachability", weight: 15, measure: "Camp behavior + response to feedback" },
];

const REGIONAL_TALENT = [
  { region: "Haryana & Punjab", sport: "Olympic Wrestling", readiness: "High", gyms: "15+", target: "Featherweight to Middleweight", desc: "Olympic wrestling factory. Most national-level wrestlers." },
  { region: "Maharashtra (Mumbai/Pune)", sport: "Boxing & MMA", readiness: "High", gyms: "8", target: "All Classes", desc: "Strong boxing tradition + growing MMA scene." },
  { region: "Karnataka (Bengaluru)", sport: "Multi-discipline", readiness: "High", gyms: "12+", target: "All Classes", desc: "Most established MMA ecosystem. Home of AKA India, SBG India." },
  { region: "Kerala", sport: "Kalaripayattu & Striking", readiness: "Emerging", gyms: "5", target: "Lighter weight classes", desc: "Underscout — huge upside. Fast growing combat sports." },
  { region: "Tamil Nadu", sport: "Boxing", readiness: "Medium", gyms: "7", target: "Bantamweight to Lightweight", desc: "Boxing stronghold. Chennai producing national-level boxers." },
  { region: "Delhi NCR", sport: "Cross-discipline", readiness: "High", gyms: "20+", target: "All Classes", desc: "Largest urban catchment. Highest gym density." },
  { region: "West Bengal", sport: "Kabaddi & Wrestling", readiness: "Emerging", gyms: "4", target: "Bantamweight to Welterweight", desc: "Kolkata emerging as MMA hub." },
  { region: "Northeast (Assam, Manipur, Mizoram)", sport: "Boxing & Kickboxing", readiness: "Medium", gyms: "6", target: "Strawweight to Featherweight", desc: "Underscout goldmine. Natural athletes, combat tradition." },
];

const SOURCE_SPORTS = [
  {
    sport: "Olympic Wrestling",
    why: "World-class body control, elite takedowns, mat dominance. Haryana and Punjab produce Olympic medalists. Direct MMA applicability on day one.",
    crossover: "High",
    regions: "Haryana, Punjab, UP",
    icon: "W",
  },
  {
    sport: "Boxing",
    why: "Hands, footwork, and defensive head movement. India's boxing program produces world champions. Striking foundation for MMA.",
    crossover: "High",
    regions: "Manipur, Maharashtra, UP",
    icon: "B",
  },
  {
    sport: "Kabaddi",
    why: "Elite short-burst athleticism, grappling instincts, high pain tolerance. Contact-normalized at grassroots. Underrated MMA pipeline.",
    crossover: "Medium-High",
    regions: "Punjab, Haryana, Tamil Nadu",
    icon: "K",
  },
  {
    sport: "Judo",
    why: "Throws, clinch work, and hip mechanics translate directly to takedowns and cage control. Strong institutional base at state level.",
    crossover: "High",
    regions: "Maharashtra, West Bengal, Delhi",
    icon: "J",
  },
  {
    sport: "Kickboxing",
    why: "Full striking repertoire with leg kicks. Southeastern India has active kickboxing circuits. Most complete striking base after boxing.",
    crossover: "High",
    regions: "Karnataka, Goa, Tamil Nadu",
    icon: "KBX",
  },
];

const GYMS = [
  { name: "Crosstrain Fight Club", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "BJJ", "Muay Thai", "Wrestling"], founded: 2009, notable: "Bharat Kandare" },
  { name: "Matrix Fight Night Gym", city: "New Delhi", state: "Delhi", disciplines: ["MMA", "Boxing", "BJJ"], founded: 2015, notable: "Home to MFN roster athletes" },
  { name: "AKA India", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "Wrestling", "BJJ", "Kickboxing"], founded: 2018, notable: "AKA affiliate, US-trained coaching" },
  { name: "Synergy MMA", city: "Mumbai", state: "Maharashtra", disciplines: ["MMA", "BJJ", "Boxing"], founded: 2013, notable: "Deepak Rao" },
  { name: "Combat Institute of India", city: "Hyderabad", state: "Telangana", disciplines: ["MMA", "Wrestling", "Boxing"], founded: 2011, notable: "Prashanth Babu" },
  { name: "Total Knockouts", city: "Pune", state: "Maharashtra", disciplines: ["MMA", "Muay Thai", "Boxing"], founded: 2010, notable: "Regional amateur circuit base" },
  { name: "Capital Combat Club", city: "New Delhi", state: "Delhi", disciplines: ["MMA", "BJJ", "Kickboxing"], founded: 2016, notable: "Major Delhi metro feeder gym" },
  { name: "Grappling Factory", city: "Mumbai", state: "Maharashtra", disciplines: ["BJJ", "Wrestling", "MMA"], founded: 2014, notable: "Dedicated grappling curriculum" },
  { name: "Chennai Combat Sports", city: "Chennai", state: "Tamil Nadu", disciplines: ["MMA", "Muay Thai", "Boxing"], founded: 2012, notable: "South India's oldest MMA gym" },
  { name: "Legends MMA Academy", city: "Kolkata", state: "West Bengal", disciplines: ["MMA", "BJJ", "Judo"], founded: 2017, notable: "East India circuit anchor" },
  { name: "Punjab Combat Club", city: "Chandigarh", state: "Punjab", disciplines: ["MMA", "Wrestling", "Boxing"], founded: 2013, notable: "Wrestling-first program" },
  { name: "Fight Factory India", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "Muay Thai", "Wrestling"], founded: 2015, notable: "High-output amateur program" },
  { name: "Iron Will MMA", city: "Ahmedabad", state: "Gujarat", disciplines: ["MMA", "Boxing", "BJJ"], founded: 2016, notable: "Gujarat's premier MMA gym" },
  { name: "Alpha Combat Academy", city: "Jaipur", state: "Rajasthan", disciplines: ["MMA", "Wrestling", "Kickboxing"], founded: 2014, notable: "Rajasthan circuit anchor" },
  { name: "Ground Zero MMA", city: "Guwahati", state: "Assam", disciplines: ["MMA", "Muay Thai", "BJJ"], founded: 2018, notable: "Northeast India gateway" },
  { name: "Bandra Boxing Club MMA", city: "Mumbai", state: "Maharashtra", disciplines: ["Boxing", "MMA", "Kickboxing"], founded: 2008, notable: "Long-standing Mumbai institution" },
  { name: "Strike Zone Combat", city: "Kochi", state: "Kerala", disciplines: ["MMA", "Muay Thai", "Boxing"], founded: 2015, notable: "Kerala's fastest growing gym" },
  { name: "Rajasthan Combat Sports", city: "Jodhpur", state: "Rajasthan", disciplines: ["Wrestling", "MMA", "Boxing"], founded: 2012, notable: "Former state wrestling program base" },
  { name: "TKO Gym India", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "BJJ", "Kickboxing"], founded: 2016, notable: "Strong amateur-to-pro pipeline" },
  { name: "Velocity MMA", city: "Hyderabad", state: "Telangana", disciplines: ["MMA", "Boxing", "Wrestling"], founded: 2017, notable: "Telangana circuit feeder" },
  { name: "War Tribe India", city: "New Delhi", state: "Delhi", disciplines: ["MMA", "BJJ", "Muay Thai"], founded: 2019, notable: "US-brand affiliate (War Tribe)" },
  { name: "Sambo Federation Gym", city: "New Delhi", state: "Delhi", disciplines: ["Sambo", "Wrestling", "MMA"], founded: 2010, notable: "Official Sambo training centre" },
  { name: "Kombat Group India", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "Boxing", "BJJ"], founded: 2017, notable: "Affiliated with Singapore's Evolve-adjacent network" },
  { name: "East Coast Combat", city: "Visakhapatnam", state: "Andhra Pradesh", disciplines: ["MMA", "Muay Thai", "BJJ"], founded: 2016, notable: "Andhra anchor gym" },
  { name: "Northern Fists Academy", city: "Lucknow", state: "Uttar Pradesh", disciplines: ["Boxing", "MMA", "Kickboxing"], founded: 2011, notable: "UP boxing pipeline crossover" },
  { name: "Deccan Fight Club", city: "Pune", state: "Maharashtra", disciplines: ["MMA", "BJJ", "Wrestling"], founded: 2013, notable: "Western Maharashtra circuit base" },
  { name: "Raw Combat India", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "BJJ", "Kickboxing", "Wrestling"], founded: 2020, notable: "Modern training facility with conditioning lab" },
];

const ALL_STATES = Array.from(new Set(GYMS.map((g) => g.state))).sort();
const ALL_DISCIPLINES = Array.from(new Set(GYMS.flatMap((g) => g.disciplines))).sort();

const fighterSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().min(2, "Date of birth is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  primarySport: z.string().min(2, "Primary sport is required"),
  yearsTraining: z.string().min(1, "Years of training is required"),
  currentGym: z.string().min(2, "Current gym is required"),
  wins: z.string(),
  losses: z.string(),
  draws: z.string(),
  highestAchievement: z.string().min(2, "Highest achievement is required"),
  weightClass: z.string().min(2, "Target weight class is required"),
  footageUrl: z.string().url("Valid footage URL is required"),
  instagram: z.string().optional(),
  whyFight: z.string().max(300, "Max 300 characters").min(10, "Tell us why you want to fight"),
  howHeard: z.string().min(2, "Required"),
});

type FighterFormValues = z.infer<typeof fighterSchema>;

const gymSchema = z.object({
  gymName: z.string().min(2, "Gym name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  activeMembers: z.string().min(1, "Required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

type GymFormValues = z.infer<typeof gymSchema>;

export default function FighterPipelinePage() {
  const [stateFilter, setStateFilter] = useState("All");
  const [disciplineFilter, setDisciplineFilter] = useState("All");

  const filteredGyms = useMemo(() => {
    return GYMS.filter((gym) => {
      const matchState = stateFilter === "All" || gym.state === stateFilter;
      const matchDiscipline = disciplineFilter === "All" || gym.disciplines.includes(disciplineFilter);
      return matchState && matchDiscipline;
    });
  }, [stateFilter, disciplineFilter]);

  // Fighter Form State
  const [fighterStep, setFighterStep] = useState(1);
  const [fighterSubmitted, setFighterSubmitted] = useState(false);
  
  const fighterForm = useForm<FighterFormValues>({
    resolver: zodResolver(fighterSchema),
    mode: "onBlur",
    defaultValues: {
      wins: "0", losses: "0", draws: "0",
    }
  });

  const onFighterSubmit = (data: FighterFormValues) => {
    console.log("Fighter submitted:", data);
    setFighterSubmitted(true);
  };

  const nextFighterStep = async () => {
    let fieldsToValidate: (keyof FighterFormValues)[] = [];
    if (fighterStep === 1) {
      fieldsToValidate = ["fullName", "dob", "city", "state", "phone", "email"];
    } else if (fighterStep === 2) {
      fieldsToValidate = ["primarySport", "yearsTraining", "currentGym", "highestAchievement"];
    }
    
    const isValid = await fighterForm.trigger(fieldsToValidate);
    if (isValid) setFighterStep((prev) => prev + 1);
  };

  // Gym Form State
  const [gymSubmitted, setGymSubmitted] = useState(false);
  const gymForm = useForm<GymFormValues>({
    resolver: zodResolver(gymSchema),
  });

  const onGymSubmit = (data: GymFormValues) => {
    console.log("Gym submitted:", data);
    setGymSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#c0392b]" />
            <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest">The Talent Machine</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
            Fighter <br />
            <span className="text-[#c0392b]">Pipeline</span>
          </h1>
          <p className="text-xl text-white/60 font-mono max-w-3xl border-l-4 border-[#c0392b] pl-6">
            India has Olympic wrestlers, boxing champions, and kabaddi warriors. RAW converts this raw athletic pedigree into elite professional MMA talent through a structured pipeline.
          </p>
        </motion.div>

        {/* REGISTER AS A RAW FIGHTER */}
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0d0d0d] border border-[#c0392b]/30 p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0392b]/5 blur-[100px] pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2 relative z-10">
              Register as a <span className="text-[#c0392b]">RAW Fighter</span>
            </h2>
            <p className="text-white/60 font-mono text-sm mb-10 max-w-2xl relative z-10">
              This is the front door to the RAW pipeline. Fill out your athletic profile. If you meet the criteria, a scout will contact you for a physical assessment.
            </p>

            {fighterSubmitted ? (
              <div className="bg-black/50 border border-white/10 p-8 text-center" data-testid="fighter-success-message">
                <div className="w-16 h-16 bg-[#c0392b] text-white flex items-center justify-center rounded-full mx-auto mb-6 text-2xl font-black">✓</div>
                <h3 className="text-2xl font-black uppercase text-white mb-2">Welcome to the RAW Pipeline</h3>
                <p className="text-white/60 font-mono">Your profile has been submitted. A RAW scout will contact you within 21 days.</p>
              </div>
            ) : (
              <form onSubmit={fighterForm.handleSubmit(onFighterSubmit)} className="relative z-10" data-testid="fighter-registration-form">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`h-2 flex-1 ${fighterStep >= step ? 'bg-[#c0392b]' : 'bg-white/10'}`} />
                  ))}
                </div>

                <div className="bg-black/40 border border-white/10 p-6 md:p-8">
                  {/* Step 1 */}
                  {fighterStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3 className="text-xl font-bold uppercase text-white mb-6">Step 1: Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Full Name</label>
                          <input {...fighterForm.register("fullName")} data-testid="fighter-input-fullname" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="e.g. Rahul Kumar" />
                          {fighterForm.formState.errors.fullName && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.fullName.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Date of Birth</label>
                          <input type="date" {...fighterForm.register("dob")} data-testid="fighter-input-dob" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors [color-scheme:dark]" />
                          {fighterForm.formState.errors.dob && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.dob.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">City</label>
                          <input {...fighterForm.register("city")} data-testid="fighter-input-city" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="e.g. Rohtak" />
                          {fighterForm.formState.errors.city && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.city.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">State</label>
                          <select {...fighterForm.register("state")} data-testid="fighter-input-state" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors">
                            <option value="">Select State</option>
                            {ALL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {fighterForm.formState.errors.state && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.state.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Phone Number</label>
                          <input {...fighterForm.register("phone")} data-testid="fighter-input-phone" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="+91" />
                          {fighterForm.formState.errors.phone && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.phone.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Email</label>
                          <input type="email" {...fighterForm.register("email")} data-testid="fighter-input-email" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="fighter@example.com" />
                          {fighterForm.formState.errors.email && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.email.message}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {fighterStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3 className="text-xl font-bold uppercase text-white mb-6">Step 2: Athletic Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Primary Combat Sport</label>
                          <select {...fighterForm.register("primarySport")} data-testid="fighter-input-sport" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors">
                            <option value="">Select Sport</option>
                            <option value="Wrestling">Wrestling</option>
                            <option value="Boxing">Boxing</option>
                            <option value="Kabaddi">Kabaddi</option>
                            <option value="Judo">Judo</option>
                            <option value="Kickboxing">Kickboxing</option>
                            <option value="Muay Thai">Muay Thai</option>
                            <option value="BJJ">BJJ</option>
                            <option value="Other">Other</option>
                          </select>
                          {fighterForm.formState.errors.primarySport && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.primarySport.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Years of Training</label>
                          <input type="number" {...fighterForm.register("yearsTraining")} data-testid="fighter-input-years" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="e.g. 5" />
                          {fighterForm.formState.errors.yearsTraining && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.yearsTraining.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Current Gym Name</label>
                          <input {...fighterForm.register("currentGym")} data-testid="fighter-input-gym" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="e.g. Haryana Wrestling Club" />
                          {fighterForm.formState.errors.currentGym && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.currentGym.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Competition Record (W - L - D)</label>
                          <div className="flex gap-2">
                            <input type="number" {...fighterForm.register("wins")} data-testid="fighter-input-wins" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none text-center" placeholder="W" />
                            <input type="number" {...fighterForm.register("losses")} data-testid="fighter-input-losses" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none text-center" placeholder="L" />
                            <input type="number" {...fighterForm.register("draws")} data-testid="fighter-input-draws" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none text-center" placeholder="D" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Highest Achievement</label>
                          <input {...fighterForm.register("highestAchievement")} data-testid="fighter-input-achievement" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="e.g. National Gold Medalist 2022" />
                          {fighterForm.formState.errors.highestAchievement && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.highestAchievement.message}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 */}
                  {fighterStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3 className="text-xl font-bold uppercase text-white mb-6">Step 3: RAW Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Target Weight Class</label>
                          <select {...fighterForm.register("weightClass")} data-testid="fighter-input-weightclass" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors">
                            <option value="">Select Weight Class</option>
                            <option value="Featherweight">Featherweight (66kg)</option>
                            <option value="Lightweight">Lightweight (70kg)</option>
                            <option value="Welterweight">Welterweight (77kg)</option>
                            <option value="Middleweight">Middleweight (84kg)</option>
                          </select>
                          {fighterForm.formState.errors.weightClass && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.weightClass.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Fight Footage URL (YouTube/Drive)</label>
                          <input type="url" {...fighterForm.register("footageUrl")} data-testid="fighter-input-footage" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="https://..." />
                          {fighterForm.formState.errors.footageUrl && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.footageUrl.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Instagram Handle (Optional)</label>
                          <input {...fighterForm.register("instagram")} data-testid="fighter-input-instagram" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors" placeholder="@handle" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">How did you hear about RAW?</label>
                          <select {...fighterForm.register("howHeard")} data-testid="fighter-input-source" className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors">
                            <option value="">Select Source</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Gym">Gym</option>
                            <option value="Friend">Friend</option>
                            <option value="News">News</option>
                            <option value="Other">Other</option>
                          </select>
                          {fighterForm.formState.errors.howHeard && <span className="text-[#c0392b] text-xs mt-1 block">{fighterForm.formState.errors.howHeard.message}</span>}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Why do you want to fight in RAW?</label>
                          <textarea {...fighterForm.register("whyFight")} data-testid="fighter-input-why" rows={3} className="w-full bg-[#0d0d0d] border border-white/20 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none transition-colors resize-none" placeholder="Tell us your motivation..." />
                          <div className="flex justify-between mt-1">
                            <span className="text-[#c0392b] text-xs">{fighterForm.formState.errors.whyFight?.message}</span>
                            <span className="text-white/30 text-xs font-mono">{fighterForm.watch("whyFight")?.length || 0}/300</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  {fighterStep > 1 ? (
                    <button type="button" onClick={() => setFighterStep(s => s - 1)} data-testid="fighter-btn-back" className="px-6 py-3 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-colors">
                      Back
                    </button>
                  ) : <div />}
                  
                  {fighterStep < 3 ? (
                    <button type="button" onClick={nextFighterStep} data-testid="fighter-btn-next" className="px-8 py-3 bg-[#c0392b] text-white font-black uppercase tracking-widest text-sm hover:bg-[#a02f23] transition-colors">
                      Next Step
                    </button>
                  ) : (
                    <button type="submit" data-testid="fighter-btn-submit" className="px-8 py-3 bg-[#c0392b] text-white font-black uppercase tracking-widest text-sm hover:bg-[#a02f23] transition-colors">
                      Submit Profile
                    </button>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </div>

        <div className="mb-32">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-10">
            The <span className="text-[#c0392b]">Pipeline</span>
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-[#c0392b]/20" />
            <div className="space-y-0">
              {PIPELINE_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`pipeline-step-${i}`}
                  className="relative pl-16 pb-10"
                >
                  <div className="absolute left-0 top-1 w-12 h-12 bg-[#c0392b] flex items-center justify-center font-black text-white text-lg">
                    {step.step}
                  </div>
                  <div className="bg-[#0d0d0d] border border-white/10 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">{step.title}</h3>
                      <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest">{step.duration}</span>
                    </div>
                    <p className="text-white/60 font-mono text-sm">{step.desc}</p>
                    
                    {/* Assessment Breakdown inserted inside step 2 */}
                    {step.step === 2 && (
                      <div className="mt-8 border border-white/10 bg-black overflow-hidden" data-testid="assessment-breakdown">
                        <div className="bg-white/5 px-4 py-3 border-b border-white/10">
                          <h4 className="text-white font-bold uppercase tracking-widest text-xs">What RAW Looks For</h4>
                        </div>
                        <div className="p-4">
                          {ASSESSMENT_CRITERIA.map((crit, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                              <div className="flex justify-between text-xs font-mono mb-2">
                                <span className="text-white font-bold uppercase">{crit.criterion}</span>
                                <span className="text-[#c0392b] font-black">{crit.weight}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 mb-2 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${crit.weight}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                  className="h-full bg-[#c0392b]"
                                />
                              </div>
                              <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                                Measure: {crit.measure}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* REGIONAL TALENT MAP */}
        <div className="mb-32">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
              Where India's <span className="text-[#c0392b]">Fighters Come From</span>
            </h2>
            <p className="text-white/50 font-mono text-sm mb-10 max-w-2xl">
              India's combat sports pedigree is deeply regional. We target specific states for specific disciplines.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {REGIONAL_TALENT.map((region, i) => (
                <div key={i} data-testid={`talent-region-${i}`} className="bg-[#0d0d0d] border border-white/10 hover:border-[#c0392b]/50 transition-colors p-6 group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-black uppercase tracking-tight leading-tight group-hover:text-[#c0392b] transition-colors">{region.region}</h3>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Primary Tradition</div>
                      <div className="text-white/80 font-mono text-xs">{region.sport}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">MMA Readiness</div>
                      <div className={`font-mono text-xs font-bold ${region.readiness === 'High' ? 'text-[#c0392b]' : region.readiness === 'Medium' ? 'text-white/80' : 'text-white/50'}`}>
                        {region.readiness}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Active Gyms</div>
                        <div className="text-white/80 font-mono text-xs">{region.gyms}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs font-mono border-t border-white/10 pt-4">
                    {region.desc}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#c0392b]/20">
                    <div className="text-[10px] text-[#c0392b] uppercase tracking-widest font-bold">Target Weight Classes</div>
                    <div className="text-white/60 font-mono text-xs">{region.target}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-32">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Source <span className="text-[#c0392b]">Sports</span>
          </h2>
          <p className="text-white/50 font-mono text-sm mb-8">
            Why each feeder sport produces MMA fighters — and where they come from.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOURCE_SPORTS.map((sport, i) => (
              <div key={i} data-testid={`card-sport-${i}`} className="bg-[#0d0d0d] border border-white/10 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#c0392b] flex items-center justify-center font-black text-white text-xs flex-shrink-0">
                    {sport.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tight">{sport.sport}</h3>
                    <div className="text-white/40 text-xs font-mono mt-0.5">{sport.regions}</div>
                  </div>
                </div>
                <p className="text-white/60 font-mono text-sm mb-4">{sport.why}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-white/30 font-bold">MMA Crossover:</span>
                  <span className={`text-xs font-bold uppercase tracking-wide ${
                    sport.crossover === "High" ? "text-[#c0392b]" : "text-white/60"
                  }`}>{sport.crossover}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-32">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
            Gym <span className="text-[#c0392b]">Directory</span>
          </h2>
          <p className="text-white/50 font-mono text-sm mb-8">
            {GYMS.length} verified Indian MMA gyms. Filter by state or discipline.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">State</label>
              <select
                data-testid="select-state-filter"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-[#0d0d0d] border border-white/20 text-white px-4 py-2 text-sm font-mono focus:border-[#c0392b] focus:outline-none"
              >
                <option value="All">All States</option>
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Discipline</label>
              <select
                data-testid="select-discipline-filter"
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="bg-[#0d0d0d] border border-white/20 text-white px-4 py-2 text-sm font-mono focus:border-[#c0392b] focus:outline-none"
              >
                <option value="All">All Disciplines</option>
                {ALL_DISCIPLINES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <span className="text-white/40 font-mono text-sm pb-2">
                {filteredGyms.length} of {GYMS.length} gyms
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGyms.map((gym, i) => (
              <div
                key={gym.name}
                data-testid={`card-gym-${i}`}
                className="bg-[#0d0d0d] border border-white/10 p-5 hover:border-[#c0392b]/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold uppercase tracking-tight text-sm leading-tight">{gym.name}</h3>
                  <span className="text-white/30 text-xs font-mono ml-2 flex-shrink-0">{gym.founded}</span>
                </div>
                <div className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-3">
                  {gym.city}, {gym.state}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {gym.disciplines.map((d) => (
                    <span key={d} className="text-xs border border-white/20 text-white/50 px-2 py-0.5 font-mono">{d}</span>
                  ))}
                </div>
                {gym.notable && (
                  <div className="text-white/30 font-mono text-xs border-t border-white/5 pt-3">
                    {gym.notable}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RAW CERTIFICATION FOR GYMS */}
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-white/10 bg-[#0a0a0a] overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="w-12 h-1 bg-[#c0392b] mb-8" />
                <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-6">
                  Become a RAW <span className="text-[#c0392b]">Partner Gym</span>
                </h2>
                <p className="text-white/60 font-mono text-sm mb-8 leading-relaxed">
                  We are building a network of elite developmental facilities across India. Partner gyms act as official scouting nodes and developmental centers for RAW talent.
                </p>
                
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">What Partners Get</h4>
                <ul className="space-y-3 mb-8">
                  {["Priority scouting access for your top fighters", "RAW branding rights and marketing support", "Discounted entry for amateur circuit events", "Quarterly RAW camp access for coaches", "Revenue share on contracted fighters"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#c0392b] mt-0.5">▪</span>
                      <span className="text-white/80 text-sm font-mono">{item}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Requirements</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/50 border border-white/5 p-4">
                    <div className="text-[#c0392b] font-black text-xl mb-1">3+</div>
                    <div className="text-white/40 text-xs font-mono uppercase">Qualified Coaches</div>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-4">
                    <div className="text-[#c0392b] font-black text-xl mb-1">2 Yrs</div>
                    <div className="text-white/40 text-xs font-mono uppercase">Minimum Operating</div>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-4">
                    <div className="text-[#c0392b] font-black text-xl mb-1">20+</div>
                    <div className="text-white/40 text-xs font-mono uppercase">Fighter Capacity</div>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-4">
                    <div className="text-[#c0392b] font-black text-xl mb-1">100%</div>
                    <div className="text-white/40 text-xs font-mono uppercase">Active Facility</div>
                  </div>
                </div>
              </div>
              
              <div className="p-10 md:p-16 bg-black flex flex-col justify-center">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Apply for Certification</h3>
                <p className="text-white/40 text-xs font-mono mb-8">Submit your gym details for review.</p>

                {gymSubmitted ? (
                  <div className="bg-[#0d0d0d] border border-[#c0392b]/30 p-8 text-center" data-testid="gym-success-message">
                    <div className="text-[#c0392b] text-4xl mb-4 font-black">✓</div>
                    <h3 className="text-xl font-bold uppercase text-white mb-2">Application Received</h3>
                    <p className="text-white/60 font-mono text-sm">The RAW Partnership team will reach out within 7 days.</p>
                  </div>
                ) : (
                  <form onSubmit={gymForm.handleSubmit(onGymSubmit)} className="space-y-4" data-testid="gym-registration-form">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input {...gymForm.register("gymName")} data-testid="gym-input-name" placeholder="Gym Name" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none" />
                        {gymForm.formState.errors.gymName && <span className="text-[#c0392b] text-[10px] mt-1 block">{gymForm.formState.errors.gymName.message}</span>}
                      </div>
                      <div>
                        <input {...gymForm.register("ownerName")} data-testid="gym-input-owner" placeholder="Owner Name" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none" />
                        {gymForm.formState.errors.ownerName && <span className="text-[#c0392b] text-[10px] mt-1 block">{gymForm.formState.errors.ownerName.message}</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input {...gymForm.register("city")} data-testid="gym-input-city" placeholder="City" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none" />
                        {gymForm.formState.errors.city && <span className="text-[#c0392b] text-[10px] mt-1 block">{gymForm.formState.errors.city.message}</span>}
                      </div>
                      <div>
                        <select {...gymForm.register("state")} data-testid="gym-input-state" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none">
                          <option value="">State</option>
                          {ALL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {gymForm.formState.errors.state && <span className="text-[#c0392b] text-[10px] mt-1 block">{gymForm.formState.errors.state.message}</span>}
                      </div>
                    </div>
                    <div>
                      <input type="number" {...gymForm.register("activeMembers")} data-testid="gym-input-members" placeholder="Number of Active Members" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none" />
                      {gymForm.formState.errors.activeMembers && <span className="text-[#c0392b] text-[10px] mt-1 block">{gymForm.formState.errors.activeMembers.message}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input type="email" {...gymForm.register("email")} data-testid="gym-input-email" placeholder="Email" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none" />
                        {gymForm.formState.errors.email && <span className="text-[#c0392b] text-[10px] mt-1 block">{gymForm.formState.errors.email.message}</span>}
                      </div>
                      <div>
                        <input {...gymForm.register("phone")} data-testid="gym-input-phone" placeholder="Phone" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-3 text-sm font-mono focus:border-[#c0392b] focus:outline-none" />
                        {gymForm.formState.errors.phone && <span className="text-[#c0392b] text-[10px] mt-1 block">{gymForm.formState.errors.phone.message}</span>}
                      </div>
                    </div>
                    <button type="submit" data-testid="gym-btn-submit" className="w-full bg-white text-black font-black uppercase tracking-widest text-sm py-4 hover:bg-[#c0392b] hover:text-white transition-colors mt-4">
                      Submit Application
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

