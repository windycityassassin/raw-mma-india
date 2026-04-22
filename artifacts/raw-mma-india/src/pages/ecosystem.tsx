import { useState } from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const NODES = [
  {
    id: "tv",
    label: "TV Show",
    sublabel: "The RAW Contender Series",
    angle: 0,
    color: "#c0392b",
    description:
      "The flagship content engine. Films regional trials across 4 cities. Awards one professional contract per episode. Every fight is a real consequence — not entertainment theater.",
    feeds: ["Fighter Stars build audience loyalty", "Sponsor visibility across 8+ episodes", "Live Event demand via episode story arcs"],
  },
  {
    id: "fighters",
    label: "Fighter Dev",
    sublabel: "Elite Athlete Pipeline",
    angle: 45,
    color: "#e74c3c",
    description:
      "6-week structured training camps convert Olympic wrestlers, boxers, and kabaddi athletes into professional MMA competitors. The RAW brand is only as strong as its roster.",
    feeds: ["Stars created by TV Show exposure", "Sponsors pay premium for named fighters", "Gyms become pipeline feeders"],
  },
  {
    id: "gyms",
    label: "Gym Network",
    sublabel: "National Ground Game",
    angle: 90,
    color: "#c0392b",
    description:
      "100+ affiliate gyms across India generate a steady stream of amateur prospects. Gyms earn RAW certification, access to coaching clinics, and priority placement in Showcase Bouts.",
    feeds: ["Fighter development pipeline", "Academy revenue from franchise fees", "Fan bases in each city"],
  },
  {
    id: "sponsors",
    label: "Brand Sponsors",
    sublabel: "Commercial Engine",
    angle: 135,
    color: "#e74c3c",
    description:
      "Energy drinks, fintech, auto, and apparel brands compete in a 72-hour auction model for octagon placement. Fighter fame drives sponsor ROI. Each season resets the market.",
    feeds: ["Funds TV production budget", "Funds live event production", "Validates RAW as premium media property"],
  },
  {
    id: "merch",
    label: "Merchandise",
    sublabel: "Cultural Currency",
    angle: 180,
    color: "#c0392b",
    description:
      "Fighter jerseys, RAW apparel, event collectibles. Sold at live events and online. Merch revenue is brand thermometer — the moment fighters become icons, merch becomes the proof.",
    feeds: ["Fan identity and loyalty loops", "Supplemental revenue for fighters", "Brand visibility off-screen"],
  },
  {
    id: "ott",
    label: "OTT/Digital",
    sublabel: "Distribution Layer",
    angle: 225,
    color: "#e74c3c",
    description:
      "YouTube primary. JioStar, Sony LIV secondary. Short-form viral content on Instagram and YouTube Shorts. Every fight clip is a discovery mechanism for new audiences.",
    feeds: ["TV Show amplification and reach", "International exposure for fighters", "Data on what audiences watch"],
  },
  {
    id: "events",
    label: "Live Events",
    sublabel: "The Live Experience",
    angle: 270,
    color: "#c0392b",
    description:
      "Tiered event structure: Fight Nights (500-1,000), City Cards (3,000-5,000), Arena Spectacles (15,000+). Gate revenue, sponsor visibility, and fan energy that money cannot manufacture.",
    feeds: ["TV content — every event is a shoot", "Merchandise sold at venue", "Fan loyalty through live presence"],
  },
  {
    id: "academy",
    label: "Academy",
    sublabel: "Training Franchise",
    angle: 315,
    color: "#e74c3c",
    description:
      "RAW-branded training academies offer amateur fighters structured coaching under certified RAW trainers. Franchise model drives recurring revenue and builds regional talent hubs.",
    feeds: ["Fighter development pipeline", "Gym network expansion", "Community grassroots brand equity"],
  },
];

const FLYWHEEL = ["ATTRACT", "BUILD", "MONETIZE"];

const FLOW_PAIRS = [
  { from: "TV Show", to: "Fighter Stars", label: "Exposure creates fame" },
  { from: "Fighter Stars", to: "Sponsorships", label: "Fame attracts brands" },
  { from: "Sponsorships", to: "Live Events", label: "Brands fund productions" },
  { from: "Live Events", to: "TV Content", label: "Events generate footage" },
  { from: "TV Content", to: "OTT Reach", label: "Content drives viewership" },
  { from: "OTT Reach", to: "New Fans", label: "Views expand audience" },
  { from: "New Fans", to: "Live Tickets", label: "Fans buy seats" },
  { from: "Live Tickets", to: "Gate Revenue", label: "Revenue funds operations" },
  { from: "Gate Revenue", to: "Fighter Salaries", label: "Money develops talent" },
  { from: "Fighter Salaries", to: "TV Show", label: "Talent elevates content" },
  { from: "Gym Network", to: "Fighter Pipeline", label: "Gyms supply prospects" },
  { from: "Fighter Pipeline", to: "TV Show", label: "Prospects fill episodes" },
  { from: "Merchandise", to: "Brand Identity", label: "Merch builds street culture" },
  { from: "Brand Identity", to: "Sponsorships", label: "Identity justifies premium" },
  { from: "Academy", to: "Gym Network", label: "Academies seed affiliates" },
];

function EcosystemWheel() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const cx = 300;
  const cy = 300;
  const r = 190;

  const activeData = NODES.find((n) => n.id === activeNode);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center">
      <div className="relative flex-shrink-0">
        <svg width="600" height="600" viewBox="0 0 600 600" className="max-w-full">
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a0000" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={cx} cy={cy} r={300} fill="url(#bgGrad)" />
          <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#c0392b" strokeWidth="0.5" opacity="0.3" />
          <circle cx={cx} cy={cy} r={r + 30} fill="none" stroke="#c0392b" strokeWidth="0.3" strokeDasharray="4 8" opacity="0.2" />

          {NODES.map((node, i) => {
            const next = NODES[(i + 1) % NODES.length];
            const rad1 = (node.angle - 90) * (Math.PI / 180);
            const rad2 = (next.angle - 90) * (Math.PI / 180);
            const x1 = cx + r * Math.cos(rad1);
            const y1 = cy + r * Math.sin(rad1);
            const x2 = cx + r * Math.cos(rad2);
            const y2 = cy + r * Math.sin(rad2);
            return (
              <line
                key={`conn-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#c0392b"
                strokeWidth="0.5"
                opacity="0.2"
              />
            );
          })}

          {NODES.map((node) => {
            const rad = (node.angle - 90) * (Math.PI / 180);
            const nx = cx + r * Math.cos(rad);
            const ny = cy + r * Math.sin(rad);
            const isActive = activeNode === node.id;

            const lx = cx + (r + 55) * Math.cos(rad);
            const ly = cy + (r + 55) * Math.sin(rad);

            return (
              <g key={node.id}>
                <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#c0392b" strokeWidth="0.5" opacity="0.15" />
                <circle
                  cx={nx}
                  cy={ny}
                  r={isActive ? 30 : 26}
                  fill={isActive ? "#c0392b" : "#0d0d0d"}
                  stroke="#c0392b"
                  strokeWidth={isActive ? 2 : 1}
                  filter={isActive ? "url(#glow)" : undefined}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setActiveNode(isActive ? null : node.id)}
                  data-testid={`node-ecosystem-${node.id}`}
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isActive ? "#c0392b" : "#ffffff99"}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="1.5"
                  className="pointer-events-none select-none"
                  style={{ textTransform: "uppercase" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          <polygon
            points="300,250 326,316 396,316 340,358 362,424 300,382 238,424 260,358 204,316 274,316"
            fill="#c0392b"
            opacity="0.15"
            stroke="#c0392b"
            strokeWidth="1.5"
          />
          <polygon
            points="300,262 322,320 384,320 336,352 356,412 300,374 244,412 264,352 216,320 278,320"
            fill="#0d0d0d"
            stroke="#c0392b"
            strokeWidth="1"
            opacity="0.8"
          />
          <text x={cx} y={cy - 20} textAnchor="middle" fill="#c0392b" fontSize="14" fontWeight="900" fontFamily="system-ui" letterSpacing="2" style={{ textTransform: "uppercase" }}>
            RAW
          </text>
          <text x={cx} y={cy + 2} textAnchor="middle" fill="#ffffff99" fontSize="8" fontFamily="system-ui" letterSpacing="1.5" style={{ textTransform: "uppercase" }}>
            MMA INDIA
          </text>
          <text x={cx} y={cy + 18} textAnchor="middle" fill="#c0392b99" fontSize="7" fontFamily="system-ui" letterSpacing="1" style={{ textTransform: "uppercase" }}>
            ECOSYSTEM
          </text>

          {FLYWHEEL.map((word, i) => {
            const angle = (i * 120 - 90) * (Math.PI / 180);
            const fx = cx + 80 * Math.cos(angle);
            const fy = cy + 80 * Math.sin(angle);
            return (
              <text
                key={word}
                x={fx}
                y={fy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff40"
                fontSize="6.5"
                fontWeight="bold"
                fontFamily="system-ui"
                letterSpacing="1"
                style={{ textTransform: "uppercase" }}
              >
                {word}
              </text>
            );
          })}

          <text x={cx - 90} y={cy + 96} textAnchor="middle" fill="#c0392b60" fontSize="5.5" fontFamily="system-ui" letterSpacing="0.5">
            ATTRACT  BUILD  MONETIZE
          </text>
        </svg>
      </div>

      <div className="flex-1 min-h-[300px]">
        {activeData ? (
          <motion.div
            key={activeData.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0d0d0d] border border-[#c0392b]/40 p-8"
          >
            <div className="text-[#c0392b] text-xs font-bold tracking-widest uppercase mb-1">{activeData.sublabel}</div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">{activeData.label}</h3>
            <p className="text-white/70 font-mono text-sm leading-relaxed mb-6">{activeData.description}</p>
            <div className="space-y-2">
              <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Feeds Into</div>
              {activeData.feeds.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c0392b] mt-1.5 flex-shrink-0" />
                  <span className="text-white/60 font-mono text-xs">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="bg-[#0d0d0d] border border-white/10 p-8 h-full flex flex-col justify-center">
            <div className="text-white/30 text-xs uppercase tracking-widest mb-4 font-bold">How To Use</div>
            <p className="text-white/50 font-mono text-sm">
              Click any node on the wheel to explore what that division does and what it feeds into. Every part of the RAW ecosystem serves every other part.
            </p>
            <div className="mt-8 flex gap-6">
              {FLYWHEEL.map((word, i) => (
                <div key={word} className="text-center">
                  <div className="text-[#c0392b] text-lg font-black">{i + 1}</div>
                  <div className="text-white/50 text-xs uppercase tracking-widest">{word}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DisneyFlowMap() {
  const [hoveredPair, setHoveredPair] = useState<number | null>(null);

  return (
    <div>
      <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">
        Value <span className="text-[#c0392b]">Flow Map</span>
      </h3>
      <p className="text-white/50 font-mono text-sm mb-8">
        Every RAW business unit with labeled value flows — modeled after Walt Disney's 1957 ecosystem diagram.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FLOW_PAIRS.map((pair, i) => (
          <motion.div
            key={i}
            data-testid={`flow-pair-${i}`}
            className={`p-5 border cursor-default transition-all duration-200 ${
              hoveredPair === i
                ? "border-[#c0392b] bg-[#c0392b]/5"
                : "border-white/10 bg-[#0d0d0d]"
            }`}
            onMouseEnter={() => setHoveredPair(i)}
            onMouseLeave={() => setHoveredPair(null)}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white font-bold text-sm uppercase tracking-wide">{pair.from}</span>
              <svg width="24" height="12" viewBox="0 0 24 12">
                <line x1="0" y1="6" x2="18" y2="6" stroke="#c0392b" strokeWidth="1.5" />
                <polygon points="14,2 24,6 14,10" fill="#c0392b" />
              </svg>
              <span className="text-white/70 font-bold text-sm uppercase tracking-wide">{pair.to}</span>
            </div>
            <div className="text-white/40 font-mono text-xs">{pair.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#c0392b]" />
            <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest">The Master Plan</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
            Ecosystem <br />
            <span className="text-[#c0392b]">Blueprint</span>
          </h1>
          <p className="text-xl text-white/60 font-mono max-w-3xl border-l-4 border-[#c0392b] pl-6">
            The UFC's brand control model, built for India. The RAW octagon sits at the center of a self-reinforcing flywheel where every division feeds every other division.
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-widest font-bold">Brand Control Wheel</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
        </div>

        <EcosystemWheel />

        <div className="mt-20 pt-16 border-t border-white/10">
          <DisneyFlowMap />
        </div>
      </div>
    </div>
  );
}
