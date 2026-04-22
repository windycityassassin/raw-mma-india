import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const PLACEMENTS = [
  {
    id: "mat",
    label: "Mat Center",
    sublabel: "Center octagon canvas",
    reach: "100% of all broadcast footage",
    minBid: "₹8L",
    startup: "₹8–12L",
    regional: "₹25–40L",
    national: "₹80L–1.2Cr",
    desc: "The most-viewed surface in MMA. Every fight, every takedown, every submission. The brand mark appears in all broadcast, OTT, and clip footage without exception.",
  },
  {
    id: "corner-pads",
    label: "Corner Pads",
    sublabel: "4 corner post pads",
    reach: "All broadcast cuts, corner moments",
    minBid: "₹5L",
    startup: "₹5–8L",
    regional: "₹15–25L",
    national: "₹50–75L",
    desc: "Four placements per event. Saturate the corner frame — the most-replayed moment in MMA as fighters are cut and corners work between rounds.",
  },
  {
    id: "cage-panels",
    label: "Cage Panels",
    sublabel: "Broadcast-facing panels",
    reach: "Camera-facing, continuous exposure",
    minBid: "₹4L",
    startup: "₹4–6L",
    regional: "₹12–20L",
    national: "₹40–60L",
    desc: "Side and back cage panels face the primary broadcast camera throughout the event. Continuous exposure for all 3-5 minutes of every round.",
  },
  {
    id: "lower-thirds",
    label: "Lower-Thirds",
    sublabel: "Broadcast graphic overlay",
    reach: "Every broadcast viewer — digital and TV",
    minBid: "₹6L",
    startup: "₹6–10L",
    regional: "₹18–28L",
    national: "₹60–90L",
    desc: "Sponsored lower-third graphic that appears with each fighter's name card, fighter stats, and event titles. Pure broadcast visibility — every viewer in every market.",
  },
  {
    id: "fighter-shorts",
    label: "Fighter Shorts",
    sublabel: "Athlete-worn branding",
    reach: "Fighter media, social content, broadcast",
    minBid: "₹3L",
    startup: "₹3–5L",
    regional: "₹8–15L",
    national: "₹25–40L",
    desc: "Brand mark on the thigh or waistband of contracted fighters. Appears in fight footage, social posts, and interview content. The most personal association in sport.",
  },
  {
    id: "ring-cards",
    label: "Ring Card Boards",
    sublabel: "Between-round displays",
    reach: "Broadcast cut to ring at every round change",
    minBid: "₹2L",
    startup: "₹2–4L",
    regional: "₹5–10L",
    national: "₹15–25L",
    desc: "Custom branded ring card boards displayed between every round. A natural broadcast cut point that gives dedicated seconds of screen time per round.",
  },
  {
    id: "title",
    label: "Event Title",
    sublabel: "Presenting sponsor naming",
    reach: "All marketing, all broadcast, all press",
    minBid: "₹20L",
    startup: "₹20–35L",
    regional: "₹60–90L",
    national: "₹2–4Cr",
    desc: "The presenting sponsor owns the event name: 'Brand X presents RAW Fight Night: Delhi.' Appears in all out-of-home, digital, press coverage, and event announcements.",
  },
];

const OCTAGON_POSITIONS = [
  { id: "mat", angle: 0, r: 0, label: "Mat Center" },
  { id: "title", angle: 0, r: 115, label: "Event Title" },
  { id: "lower-thirds", angle: 51, r: 115, label: "Lower-Thirds" },
  { id: "corner-pads", angle: 102, r: 115, label: "Corner Pads" },
  { id: "cage-panels", angle: 153, r: 115, label: "Cage Panels" },
  { id: "fighter-shorts", angle: 204, r: 115, label: "Fighter Shorts" },
  { id: "ring-cards", angle: 255, r: 115, label: "Ring Cards" },
];

const AUCTION_STEPS = [
  {
    step: 1,
    title: "Brand Registers Interest",
    detail: "Fill out the RAW Media Kit Request form. Provide category (energy, fintech, auto, etc.), audience targets, and budget range.",
  },
  {
    step: 2,
    title: "RAW Sends Media Kit",
    detail: "Full sponsorship deck: reach stats, event schedule, placement catalogue, exclusivity terms, and case studies from comparable sports properties.",
  },
  {
    step: 3,
    title: "Bidding Window Opens",
    detail: "72-hour sealed-bid auction per placement per event. Category exclusivity guaranteed — no competing brand in same vertical wins same placement.",
  },
  {
    step: 4,
    title: "Highest Bid Wins",
    detail: "Winning bid confirmed within 24 hours of window close. Runner-up offered alternative placement at starting bid. No negotiation on winning amounts.",
  },
  {
    step: 5,
    title: "Contract Executed",
    detail: "Standard RAW Sponsorship Agreement. 50% upfront, 50% on event day. Brand receives post-event impression report within 7 business days.",
  },
];

function OctagonDiagram({ active, setActive }: { active: string | null; setActive: (id: string | null) => void }) {
  const cx = 240;
  const cy = 240;
  const octPoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 - 22.5) * (Math.PI / 180);
    return `${cx + 95 * Math.cos(angle)},${cy + 95 * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 480 480" width="400" height="400" className="max-w-full">
      <defs>
        <radialGradient id="octGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0000" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>
      <rect width="480" height="480" fill="url(#octGrad)" />
      <polygon points={octPoints} fill="#0d0d0d" stroke="#c0392b" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={115} fill="none" stroke="#c0392b" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3" />

      {OCTAGON_POSITIONS.map((pos) => {
        const isCenter = pos.r === 0;
        const rad = (pos.angle - 90) * (Math.PI / 180);
        const nx = isCenter ? cx : cx + pos.r * Math.cos(rad);
        const ny = isCenter ? cy : cy + pos.r * Math.sin(rad);
        const isActive = active === pos.id;

        return (
          <g key={pos.id} onClick={() => setActive(isActive ? null : pos.id)} className="cursor-pointer">
            {!isCenter && (
              <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#c0392b" strokeWidth="0.5" opacity="0.2" />
            )}
            <circle
              cx={nx}
              cy={ny}
              r={isCenter ? 28 : 22}
              fill={isActive ? "#c0392b" : "#111"}
              stroke="#c0392b"
              strokeWidth={isActive ? 2 : 1}
            />
            <text
              x={nx}
              y={ny}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isActive ? "#fff" : "#c0392b"}
              fontSize={isCenter ? 7 : 6}
              fontWeight="bold"
              fontFamily="system-ui"
              letterSpacing="0.5"
              style={{ textTransform: "uppercase" }}
            >
              {pos.label.split(" ").map((word, wi) => (
                <tspan key={wi} x={nx} dy={wi === 0 ? (pos.label.includes(" ") ? -5 : 0) : 10}>
                  {word}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      <text x={cx} y={cy + 48} textAnchor="middle" fill="#c0392b" fontSize="8" fontWeight="bold" fontFamily="system-ui" letterSpacing="2" style={{ textTransform: "uppercase" }}>
        RAW Octagon
      </text>
    </svg>
  );
}

export default function SponsorshipPage() {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  const activePlacement = PLACEMENTS.find((p) => p.id === activeSpot);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#c0392b]" />
            <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest">Commercial Infrastructure</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
            Brand <br />
            <span className="text-[#c0392b]">Sponsorship</span>
          </h1>
          <p className="text-xl text-white/60 font-mono max-w-3xl border-l-4 border-[#c0392b] pl-6">
            RAW operates a premium auction model for all sponsor placements. Category exclusivity guaranteed. This is how serious sports properties sell — not rate cards, but competitive bidding.
          </p>
        </motion.div>

        <div className="mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Placement <span className="text-[#c0392b]">Inventory</span>
          </h2>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <OctagonDiagram active={activeSpot} setActive={setActiveSpot} />
              <p className="text-white/30 text-xs font-mono text-center mt-2">Click a placement to explore pricing</p>
            </div>
            <div className="flex-1">
              {activePlacement ? (
                <motion.div
                  key={activePlacement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0d0d0d] border border-[#c0392b]/40 p-8"
                >
                  <div className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-1">{activePlacement.sublabel}</div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">{activePlacement.label}</h3>
                  <p className="text-white/60 font-mono text-sm mb-6">{activePlacement.desc}</p>
                  <div className="mb-6">
                    <div className="text-xs text-white/30 uppercase tracking-widest font-bold mb-2">Estimated Reach</div>
                    <div className="text-white/70 font-mono text-sm">{activePlacement.reach}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Startup", value: activePlacement.startup, sub: "First 2 seasons" },
                      { label: "Regional", value: activePlacement.regional, sub: "City-level events" },
                      { label: "National", value: activePlacement.national, sub: "Arena-scale" },
                    ].map((tier, i) => (
                      <div key={i} className="bg-black border border-white/10 p-4">
                        <div className="text-white/30 text-xs uppercase tracking-widest font-bold mb-1">{tier.label}</div>
                        <div className="text-white font-black text-sm">{tier.value}</div>
                        <div className="text-white/30 text-xs font-mono mt-1">{tier.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-white/30 font-mono">
                    Minimum bid: {activePlacement.minBid} per event. Category exclusive — no competing brand in same vertical.
                  </div>
                </motion.div>
              ) : (
                <div className="bg-[#0d0d0d] border border-white/10 p-8">
                  <div className="text-white/30 text-xs uppercase tracking-widest mb-4 font-bold">7 Placement Zones</div>
                  <p className="text-white/50 font-mono text-sm mb-6">
                    Select a placement zone from the diagram to see reach estimates and pricing across all three RAW stages — Startup, Regional, and National.
                  </p>
                  <div className="space-y-2">
                    {PLACEMENTS.map((p) => (
                      <button
                        key={p.id}
                        data-testid={`button-placement-${p.id}`}
                        onClick={() => setActiveSpot(p.id)}
                        className="w-full flex justify-between items-center p-3 border border-white/10 hover:border-[#c0392b]/40 text-left transition-colors"
                      >
                        <span className="text-white text-sm font-bold uppercase tracking-wide">{p.label}</span>
                        <span className="text-[#c0392b] text-sm font-bold">{p.minBid}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Pricing <span className="text-[#c0392b]">Tiers</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-pricing">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-bold">Placement</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-bold">Reach</th>
                  <th className="text-right py-3 px-4 text-xs uppercase tracking-widest text-[#c0392b] font-bold">Startup</th>
                  <th className="text-right py-3 px-4 text-xs uppercase tracking-widest text-[#c0392b] font-bold">Regional</th>
                  <th className="text-right py-3 px-4 text-xs uppercase tracking-widest text-[#c0392b] font-bold">National</th>
                </tr>
              </thead>
              <tbody>
                {PLACEMENTS.map((p, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="text-white font-bold uppercase text-sm">{p.label}</div>
                      <div className="text-white/40 font-mono text-xs">{p.sublabel}</div>
                    </td>
                    <td className="py-4 px-4 text-white/50 font-mono text-xs">{p.reach}</td>
                    <td className="py-4 px-4 text-right text-white font-mono text-sm">{p.startup}</td>
                    <td className="py-4 px-4 text-right text-white font-mono text-sm">{p.regional}</td>
                    <td className="py-4 px-4 text-right text-[#c0392b] font-bold text-sm">{p.national}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Auction <span className="text-[#c0392b]">Process</span>
          </h2>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#c0392b]/20 -translate-x-1/2" />
            <div className="space-y-6">
              {AUCTION_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  data-testid={`auction-step-${i}`}
                  className={`flex gap-6 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-col`}
                >
                  <div className="flex-1 bg-[#0d0d0d] border border-white/10 p-6">
                    <div className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-2">Step {step.step}</div>
                    <h3 className="text-white font-black uppercase tracking-tight mb-3">{step.title}</h3>
                    <p className="text-white/60 font-mono text-sm">{step.detail}</p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-[#c0392b] flex items-center justify-center font-black text-white text-xl md:mt-4">
                    {step.step}
                  </div>
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 1: THE ROI OF COMBAT */}
        <div className="mb-24 mt-24">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            The ROI of <span className="text-[#c0392b]">Combat</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { stat: "900M+", label: "UFC reaches 900 million viewers across 175 countries" },
              { stat: "23%", label: "Bud Light UFC deal drove 23% brand recall lift in key demos (Nielsen)" },
              { stat: "3x", label: "Combat sports average 3x more social engagement per viewer than team sports" },
              { stat: "₹25K Cr", label: "India's sports media market size and growing 18% annually" },
              { stat: "40%", label: "India OTT sports viewership annual growth rate YoY" },
              { stat: "Zero", label: "Established MMA properties in India — first mover captures all mindshare" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`roi-card-${i}`}
                className="bg-[#0d0d0d] border border-[#c0392b]/20 p-8 flex flex-col justify-center text-center hover:border-[#c0392b]/60 transition-colors"
              >
                <div className="text-5xl font-black text-[#c0392b] mb-4 tracking-tighter">{item.stat}</div>
                <div className="text-white/80 font-mono text-sm leading-relaxed">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: BRAND FIT QUIZ */}
        <BrandFitQuiz />

        {/* SECTION 4: ACTIVATION TIERS */}
        <div className="mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8 text-center">
            What Your Brand Looks Like <span className="text-[#c0392b]">In RAW</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                name: "The Challenger",
                price: "₹5–15L per event",
                features: [
                  "Corner pad branding (x4)",
                  "Tagged in all fighter social posts",
                  "2 sponsored RAW posts per episode",
                  "Logo in event graphics"
                ]
              },
              {
                name: "The Contender",
                price: "₹15–50L per event",
                features: [
                  "Mat center branding",
                  "Lower-third broadcast overlay in all footage",
                  "Fighter shorts patch (2 fighters per episode)",
                  "RAW App banner placement",
                  "Post-event highlight reel co-branded"
                ]
              },
              {
                name: "The Champion",
                price: "₹50L+ per event",
                features: [
                  "[Brand] presents RAW: The Contender Series",
                  "Full event title naming",
                  "All digital assets co-branded",
                  "VIP ringside access (6 seats)",
                  "Press release co-branding",
                  "Exclusive fighter ambassador (1 per season)",
                  "First-look on all new event announcements"
                ],
                highlight: true
              }
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`tier-card-${i}`}
                className={`bg-[#0d0d0d] border p-8 flex flex-col ${tier.highlight ? 'border-[#c0392b] shadow-[0_0_30px_rgba(192,57,43,0.15)] relative overflow-hidden' : 'border-white/10'}`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 right-0 bg-[#c0392b] text-white text-[10px] font-bold uppercase px-3 py-1 tracking-widest">
                    Premium
                  </div>
                )}
                <div className="text-xl font-black uppercase text-white tracking-tight mb-2">{tier.name}</div>
                <div className="text-[#c0392b] font-mono font-bold mb-6 pb-6 border-b border-white/10">{tier.price}</div>
                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#c0392b] flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm font-mono leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => {
                    document.getElementById('sponsorship-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-testid={`button-enquire-tier-${i}`}
                  className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-colors ${tier.highlight ? 'bg-[#c0392b] text-white hover:bg-white hover:text-black' : 'border border-[#c0392b] text-[#c0392b] hover:bg-[#c0392b] hover:text-white'}`}
                >
                  Enquire Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 3: BRAND INQUIRY FORM */}
        <SponsorshipForm />

      </div>
    </div>
  );
}

function BrandFitQuiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: 1,
      q: "Your target audience?",
      options: ["18-25 Males", "25-35 Males", "18-35 Broad", "Women 18-35"]
    },
    {
      id: 2,
      q: "Your brand category?",
      options: ["Energy & Beverage", "Sports & Fitness", "Tech & Mobile", "Fintech", "Auto & Lifestyle", "Other"]
    },
    {
      id: 3,
      q: "Primary goal?",
      options: ["Brand Awareness", "Product Launch", "Youth Market Entry", "Digital Engagement"]
    },
    {
      id: 4,
      q: "Activation budget?",
      options: ["Under ₹10L", "₹10–50L", "₹50L–2Cr", "₹2Cr+"]
    }
  ];

  const handleSelect = (qId: number, option: string) => {
    const newAnswers = { ...answers, [qId]: option };
    setAnswers(newAnswers);
    if (Object.keys(newAnswers).length === questions.length) {
      setShowResult(true);
    }
  };

  const getResult = () => {
    if (answers[4] === "₹2Cr+") return "CHAMPIONSHIP PARTNERSHIP — Full ecosystem integration, contact RAW directly";
    if (answers[2] === "Energy & Beverage") return "OCTAGON ACTIVATION — Mat Center + Corner Pads + Fighter Kit";
    if (answers[2] === "Tech & Mobile") return "DIGITAL BROADCAST PACKAGE — Lower-Thirds + Social Integration";
    if (answers[2] === "Fintech") return "PREMIUM TITLE PACKAGE — Event Title Naming + Full Broadcast";
    return "CUSTOM PARTNERSHIP — Contact RAW for a tailored proposal";
  };

  return (
    <div className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#0d0d0d] border border-white/10 p-8 md:p-12"
      >
        <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8 text-center">
          Is RAW Right For <span className="text-[#c0392b]">Your Brand?</span>
        </h2>
        
        {!showResult ? (
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="border-b border-white/10 pb-8 last:border-0">
                <div className="text-white font-bold mb-4">{q.id}. {q.q}</div>
                <div className="flex flex-wrap gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      data-testid={`quiz-q${q.id}-opt-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => handleSelect(q.id, opt)}
                      className={`px-5 py-2 text-sm font-mono border transition-colors ${answers[q.id] === opt ? 'bg-[#c0392b] border-[#c0392b] text-white' : 'border-white/20 text-white/60 hover:border-[#c0392b]/50 hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-[#c0392b]/40 p-8 text-center"
          >
            <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Recommended Strategy</div>
            <div className="text-2xl md:text-3xl font-black text-[#c0392b] mb-8">{getResult()}</div>
            <button
              onClick={() => {
                document.getElementById('sponsorship-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="quiz-result-cta"
              className="bg-[#c0392b] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors"
            >
              Get Your Full Proposal →
            </button>
            <button 
              onClick={() => { setAnswers({}); setShowResult(false); }}
              className="block mx-auto mt-6 text-white/40 hover:text-white text-xs font-mono underline underline-offset-4"
            >
              Retake Quiz
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

const formSchema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  budget: z.string().optional(),
  interests: z.array(z.string()).default([]),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function SponsorshipForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      contactName: "",
      email: "",
      phone: "",
      category: "",
      budget: "",
      interests: [],
      message: "",
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Simulate API call
    setTimeout(() => setIsSubmitted(true), 800);
  };

  if (isSubmitted) {
    return (
      <div id="sponsorship-form" className="bg-[#0d0d0d] border border-[#c0392b]/40 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#c0392b]/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#c0392b]" />
        </div>
        <h3 className="text-2xl font-black uppercase text-white mb-4">Inquiry Received</h3>
        <p className="text-white/60 font-mono max-w-lg mx-auto">
          Your inquiry has been received. A RAW sponsorship executive will contact you within 48 hours with a tailored proposal.
        </p>
        <button 
          onClick={() => { form.reset(); setIsSubmitted(false); }}
          className="mt-8 text-sm font-bold text-[#c0392b] uppercase tracking-widest hover:text-white transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div id="sponsorship-form" className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
          Partner With <span className="text-[#c0392b]">RAW</span>
        </h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-[#0d0d0d] border border-white/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Brand / Company *</label>
              <input 
                {...form.register("brandName")} 
                data-testid="input-brand-name"
                className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none font-mono text-sm transition-colors" 
              />
              {form.formState.errors.brandName && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.brandName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Contact Name *</label>
              <input 
                {...form.register("contactName")} 
                data-testid="input-contact-name"
                className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none font-mono text-sm transition-colors" 
              />
              {form.formState.errors.contactName && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.contactName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Email *</label>
              <input 
                type="email"
                {...form.register("email")} 
                data-testid="input-email"
                className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none font-mono text-sm transition-colors" 
              />
              {form.formState.errors.email && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Phone</label>
              <input 
                {...form.register("phone")} 
                data-testid="input-phone"
                className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none font-mono text-sm transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Brand Category *</label>
              <select 
                {...form.register("category")}
                data-testid="select-category"
                className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none font-mono text-sm transition-colors appearance-none"
              >
                <option value="">Select Category...</option>
                {["Energy & Beverage", "Sports & Apparel", "Tech & Mobile", "Fintech", "Auto", "FMCG", "Other"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {form.formState.errors.category && <p className="text-[#c0392b] text-xs mt-1">{form.formState.errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Annual Marketing Budget</label>
              <select 
                {...form.register("budget")}
                data-testid="select-budget"
                className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none font-mono text-sm transition-colors appearance-none"
              >
                <option value="">Select Range...</option>
                {["Under ₹10L", "₹10–50L", "₹50L–2Cr", "₹2Cr+", "Prefer not to say"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Interested In</label>
            <div className="flex flex-wrap gap-3">
              {["Octagon Branding", "Broadcast Overlay", "Fighter Kit", "Event Title", "Digital Integration"].map((interest) => {
                const isSelected = form.watch("interests").includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    data-testid={`btn-interest-${interest.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => {
                      const current = form.getValues("interests");
                      const updated = isSelected 
                        ? current.filter(i => i !== interest)
                        : [...current, interest];
                      form.setValue("interests", updated);
                    }}
                    className={`px-4 py-2 text-xs font-mono border transition-colors ${isSelected ? 'bg-[#c0392b] border-[#c0392b] text-white' : 'border-white/20 text-white/60 hover:border-[#c0392b]/50'}`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Message</label>
            <textarea 
              {...form.register("message")}
              data-testid="input-message"
              rows={4}
              className="w-full bg-black border border-white/10 p-3 text-white focus:border-[#c0392b] outline-none font-mono text-sm transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            data-testid="btn-submit-inquiry"
            className="w-full bg-[#c0392b] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
