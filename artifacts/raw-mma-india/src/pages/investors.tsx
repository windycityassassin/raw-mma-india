import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const PHASES = [
  {
    phase: "Phase 1",
    name: "Seed",
    capital: "₹2–5 Cr",
    timeline: "Months 1–18",
    color: "#c0392b",
    what: "Produces 8 episodes of The RAW Contender Series, builds fighter roster of 40+ athletes, establishes 3 core gym partnerships, develops full brand identity and media kit.",
    funds: [
      "8-episode production of The RAW Contender Series",
      "Fighter development: 40+ athlete contracts and training camps",
      "3 affiliate gym partnerships — Delhi, Mumbai, Bengaluru",
      "Full brand and creative production (logo, kit, digital)",
      "Core operational team: 8 staff",
    ],
    metrics: [
      "1M+ YouTube views within 6 months of launch",
      "Season 1 sponsor revenue: ₹50L+",
      "40 fighters signed across 4 weight classes",
      "3 affiliate gym MOUs executed",
    ],
  },
  {
    phase: "Phase 2",
    name: "Growth",
    capital: "₹15–30 Cr",
    timeline: "Months 18–42",
    color: "#e74c3c",
    what: "Regional live events in 4 cities, active OTT deal negotiation, 100+ gym network expansion, merchandise launch, and scaling content production to Season 2 and 3.",
    funds: [
      "Live events: 12 Fight Nights + 4 City Cards per year",
      "OTT licensing pitch package and rights negotiation",
      "Expansion to 100+ affiliate gym network",
      "Merchandise line: fighter jerseys, RAW apparel, collectibles",
      "Expanded team: 30+ staff including regional managers",
    ],
    metrics: [
      "₹3Cr+ cumulative sponsorship revenue",
      "10M+ total YouTube subscribers",
      "OTT deal signed (JioStar or Sony LIV)",
      "100+ affiliate gyms across 8 states",
      "Merchandise: ₹50L annual revenue",
    ],
  },
  {
    phase: "Phase 3",
    name: "Scale",
    capital: "₹75 Cr+",
    timeline: "Year 4 Onward",
    color: "#922b21",
    what: "National arena events in major venues, pay-per-view infrastructure, international cards featuring Indian fighters, and positioning RAW as Asia's premier MMA property.",
    funds: [
      "Arena-scale events: 15,000+ seat venues",
      "PPV infrastructure and international broadcast rights",
      "International fight cards with global MMA fighters",
      "Academy franchise model: 10 RAW-branded academies",
      "Regional language broadcast deals",
    ],
    metrics: [
      "₹25Cr+ annual revenue",
      "First PPV event: 500K buys target",
      "International broadcast in 5+ markets",
      "50M+ digital monthly reach",
      "India's #1 combat sports property by viewership",
    ],
  },
];

const schema = z.object({
  name: z.string().min(2, "Name required"),
  organization: z.string().min(2, "Organization required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(8, "Valid phone required"),
  investmentRange: z.string().min(1, "Select a range"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      organization: "",
      email: "",
      phone: "",
      investmentRange: "",
      message: "",
    },
  });

  const onSubmit = (_data: FormData) => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0d0d0d] border border-[#c0392b]/40 p-12 text-center"
      >
        <div className="w-16 h-16 border-2 border-[#c0392b] flex items-center justify-center mx-auto mb-6">
          <div className="w-6 h-6 bg-[#c0392b]" />
        </div>
        <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Expression Received</h3>
        <p className="text-white/60 font-mono text-sm max-w-md mx-auto">
          The RAW team will review your submission and respond within 48 business hours with our full investor deck and a proposed call schedule.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-[#0d0d0d] border border-white/10 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Full Name</label>
          <input
            data-testid="input-name"
            {...form.register("name")}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 font-mono text-sm focus:border-[#c0392b] focus:outline-none transition-colors"
            placeholder="Your name"
          />
          {form.formState.errors.name && (
            <p className="text-[#c0392b] text-xs mt-1 font-mono">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Organization</label>
          <input
            data-testid="input-organization"
            {...form.register("organization")}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 font-mono text-sm focus:border-[#c0392b] focus:outline-none transition-colors"
            placeholder="Fund / firm / entity"
          />
          {form.formState.errors.organization && (
            <p className="text-[#c0392b] text-xs mt-1 font-mono">{form.formState.errors.organization.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Email</label>
          <input
            data-testid="input-email"
            {...form.register("email")}
            type="email"
            className="w-full bg-black border border-white/20 text-white px-4 py-3 font-mono text-sm focus:border-[#c0392b] focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
          {form.formState.errors.email && (
            <p className="text-[#c0392b] text-xs mt-1 font-mono">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Phone</label>
          <input
            data-testid="input-phone"
            {...form.register("phone")}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 font-mono text-sm focus:border-[#c0392b] focus:outline-none transition-colors"
            placeholder="+91 xxxx xxxxxx"
          />
          {form.formState.errors.phone && (
            <p className="text-[#c0392b] text-xs mt-1 font-mono">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Investment Range</label>
        <select
          data-testid="select-investment-range"
          {...form.register("investmentRange")}
          className="w-full bg-black border border-white/20 text-white px-4 py-3 font-mono text-sm focus:border-[#c0392b] focus:outline-none transition-colors"
        >
          <option value="">Select range</option>
          <option value="seed-small">Phase 1: ₹2–3 Cr</option>
          <option value="seed-large">Phase 1: ₹3–5 Cr</option>
          <option value="growth-small">Phase 2: ₹15–20 Cr</option>
          <option value="growth-large">Phase 2: ₹20–30 Cr</option>
          <option value="scale">Phase 3: ₹75 Cr+</option>
          <option value="strategic">Strategic partnership / non-capital</option>
        </select>
        {form.formState.errors.investmentRange && (
          <p className="text-[#c0392b] text-xs mt-1 font-mono">{form.formState.errors.investmentRange.message}</p>
        )}
      </div>
      <div className="mb-8">
        <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Additional Context <span className="text-white/20">(optional)</span></label>
        <textarea
          data-testid="textarea-message"
          {...form.register("message")}
          rows={4}
          className="w-full bg-black border border-white/20 text-white px-4 py-3 font-mono text-sm focus:border-[#c0392b] focus:outline-none transition-colors resize-none"
          placeholder="Any relevant background, specific interests, or questions for the RAW team"
        />
      </div>
      <button
        data-testid="button-submit-investor"
        type="submit"
        className="w-full bg-[#c0392b] text-white font-black uppercase tracking-widest py-4 text-sm hover:bg-[#e74c3c] transition-colors"
      >
        Submit Expression of Interest
      </button>
      <p className="text-white/30 text-xs font-mono text-center mt-4">
        Submission is non-binding. RAW team responds within 48 business hours.
      </p>
    </form>
  );
}

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#c0392b]" />
            <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest">Investment Case</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
            Investor <br />
            <span className="text-[#c0392b]">Roadmap</span>
          </h1>
          <p className="text-xl text-white/60 font-mono max-w-3xl border-l-4 border-[#c0392b] pl-6">
            A three-phase capital deployment model that builds from 8 TV episodes to India's first national MMA arena property. Each phase is self-funding by the end of its window.
          </p>
        </motion.div>

        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-12">
            Three-Phase <span className="text-[#c0392b]">Timeline</span>
          </h2>
          <div className="relative">
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#922b21]" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {PHASES.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  data-testid={`card-phase-${i}`}
                  className="relative"
                >
                  <div className="lg:pt-12">
                    <div
                      className="hidden lg:flex absolute top-10 left-1/2 -translate-x-1/2 w-8 h-8 items-center justify-center font-black text-white text-sm z-10"
                      style={{ background: phase.color }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div className="bg-[#0d0d0d] border border-white/10 p-8 hover:border-[#c0392b]/30 transition-colors">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: phase.color }}>
                      {phase.phase} — {phase.timeline}
                    </div>
                    <div className="text-4xl font-black text-white mb-1">{phase.capital}</div>
                    <div className="text-white font-black uppercase tracking-tight text-xl mb-4">{phase.name}</div>
                    <p className="text-white/60 font-mono text-sm mb-6 pb-6 border-b border-white/10">{phase.what}</p>
                    <div className="mb-6">
                      <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Capital Funds</div>
                      <ul className="space-y-2">
                        {phase.funds.map((f, j) => (
                          <li key={j} className="flex gap-2 items-start">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: phase.color }} />
                            <span className="text-white/55 font-mono text-xs">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Success Metrics</div>
                      <ul className="space-y-2">
                        {phase.metrics.map((m, j) => (
                          <li key={j} className="flex gap-2 items-start">
                            <div className="text-[#c0392b] text-xs font-bold mt-0.5 flex-shrink-0">/</div>
                            <span className="text-white/55 font-mono text-xs">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="bg-[#0d0d0d] border border-[#c0392b]/30 p-12 text-center">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c0392b] to-transparent mb-12" />
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
              The last major<br />
              <span className="text-[#c0392b]">combat sports market</span><br />
              on earth is untouched.
            </h2>
            <p className="text-white/50 font-mono text-lg max-w-3xl mx-auto mb-4">
              1.4 billion people. A government that has named sports a national infrastructure priority. A generation that has watched UFC and ONE Championship and asked: where is ours?
            </p>
            <p className="text-white/50 font-mono text-lg max-w-3xl mx-auto">
              RAW is not a promotion. It is a platform — the infrastructure for India's first homegrown combat sports empire. The window is open. It will not remain open forever.
            </p>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c0392b] to-transparent mt-12" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
            Express <span className="text-[#c0392b]">Interest</span>
          </h2>
          <p className="text-white/50 font-mono text-sm mb-8">
            Submit your expression of interest. The RAW team will respond with the full investor deck and a proposed call schedule within 48 business hours.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
