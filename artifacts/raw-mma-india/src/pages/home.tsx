import { motion } from "framer-motion";
import { Link } from "wouter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const NAV_CARDS = [
  {
    href: "/ecosystem",
    title: "Ecosystem Blueprint",
    subtitle: "The brand control wheel — every division feeds every other",
    tag: "Interactive",
  },
  {
    href: "/tv-show",
    title: "The RAW Contender Series",
    subtitle: "Full operational blueprint for India's first MMA TV show",
    tag: "TV & Production",
  },
  {
    href: "/fighter-pipeline",
    title: "Fighter Pipeline",
    subtitle: "27+ verified gyms. Source sports. Step-by-step pipeline.",
    tag: "Talent System",
  },
  {
    href: "/sponsorship",
    title: "Brand Sponsorship",
    subtitle: "Octagon placement auction model with tiered pricing",
    tag: "Commercial",
  },
  {
    href: "/investors",
    title: "Investor Roadmap",
    subtitle: "Three-phase capital model from seed to national scale",
    tag: "Investment",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="relative min-h-[92dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c0392b]/20 via-black to-black opacity-60" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        >
          <motion.div variants={fadeIn} className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-[#c0392b]" />
            <span className="uppercase tracking-[0.3em] text-[#c0392b] font-bold text-xs">Strategic Operations Platform</span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase leading-[0.82] tracking-tighter mb-10 text-white"
          >
            India <br />
            <span className="text-[#c0392b]">Bleeds</span>
            <br />
            Combat.
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-xl md:text-2xl text-white/50 font-mono max-w-2xl leading-relaxed mb-16 border-l-4 border-[#c0392b] pl-6"
          >
            1.4 billion people. Zero premium MMA leagues. Cricket is religion — but combat is instinct. RAW MMA India is the platform to build India's first homegrown combat sports empire.
          </motion.p>

          <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {NAV_CARDS.map((card, i) => (
              <Link key={card.href} href={card.href} data-testid={`link-home-${i}`}>
                <div className="bg-white/5 border border-white/10 p-6 hover:border-[#c0392b]/60 hover:bg-[#c0392b]/5 transition-all duration-300 cursor-pointer group">
                  <div className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-2">{card.tag}</div>
                  <h3 className="text-white font-black uppercase tracking-tight mb-2 group-hover:text-[#c0392b] transition-colors">{card.title}</h3>
                  <p className="text-white/40 font-mono text-xs leading-relaxed">{card.subtitle}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#c0392b] to-transparent mx-auto" />
        </div>
      </section>

      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1.4B", label: "Population" },
              { value: "65%", label: "Under Age 35" },
              { value: "0", label: "Premium MMA Leagues" },
              { value: "27+", label: "Verified Indian Gyms" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                data-testid={`stat-${i}`}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-[#c0392b] mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
