import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const gymsData = [
  { name: "Matrix Fight Night Gym", city: "Delhi", state: "Delhi", disciplines: ["MMA", "Boxing", "BJJ"], year: 2012 },
  { name: "Crosstrain Fight Club", city: "Mumbai", state: "Maharashtra", disciplines: ["MMA", "Wrestling", "Kickboxing"], year: 2010 },
  { name: "AKA India", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "Boxing", "Wrestling"], year: 2015 },
  { name: "SBG India", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "BJJ", "Wrestling"], year: 2016 },
  { name: "Punchfit MMA", city: "Mumbai", state: "Maharashtra", disciplines: ["MMA", "Muay Thai", "Boxing"], year: 2013 },
  { name: "Fitness One MMA", city: "Hyderabad", state: "Telangana", disciplines: ["MMA", "Kickboxing", "BJJ"], year: 2014 },
  { name: "SuperFight Factory", city: "Delhi", state: "Delhi", disciplines: ["MMA", "Boxing", "Muay Thai"], year: 2011 },
  { name: "Kumite MMA", city: "Pune", state: "Maharashtra", disciplines: ["MMA", "Judo", "Wrestling"], year: 2017 },
  { name: "Ground Zero MMA", city: "Chennai", state: "Tamil Nadu", disciplines: ["MMA", "BJJ", "Boxing"], year: 2015 },
  { name: "Bulldog MMA", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "Kickboxing", "BJJ"], year: 2018 },
  { name: "Knockout MMA", city: "Kolkata", state: "West Bengal", disciplines: ["MMA", "Muay Thai", "Wrestling"], year: 2016 },
  { name: "Lion's Den India", city: "Delhi", state: "Delhi", disciplines: ["MMA", "Boxing", "Judo"], year: 2013 },
  { name: "Iron Fist MMA", city: "Ahmedabad", state: "Gujarat", disciplines: ["MMA", "Boxing", "Kickboxing"], year: 2019 },
  { name: "Grappling Academy Jaipur", city: "Jaipur", state: "Rajasthan", disciplines: ["BJJ", "Wrestling", "MMA"], year: 2020 },
  { name: "Strike Force MMA", city: "Chandigarh", state: "Punjab", disciplines: ["MMA", "Boxing", "Wrestling"], year: 2017 },
  { name: "Combat Zone India", city: "Mumbai", state: "Maharashtra", disciplines: ["MMA", "BJJ", "Muay Thai"], year: 2014 },
  { name: "Warrior MMA Academy", city: "Hyderabad", state: "Telangana", disciplines: ["MMA", "Wrestling", "Boxing"], year: 2016 },
  { name: "RCT MMA Gym", city: "Kochi", state: "Kerala", disciplines: ["MMA", "Kickboxing", "BJJ"], year: 2018 },
  { name: "Invictus Fight Academy", city: "Bengaluru", state: "Karnataka", disciplines: ["MMA", "Boxing", "Muay Thai"], year: 2019 },
  { name: "Prime Combat Sports", city: "Delhi", state: "Delhi", disciplines: ["MMA", "Wrestling", "Judo"], year: 2015 },
  { name: "East Side MMA", city: "Kolkata", state: "West Bengal", disciplines: ["MMA", "Boxing", "BJJ"], year: 2020 },
  { name: "Renegade MMA", city: "Pune", state: "Maharashtra", disciplines: ["MMA", "Muay Thai", "Wrestling"], year: 2018 },
  { name: "Challenger's MMA", city: "Chennai", state: "Tamil Nadu", disciplines: ["MMA", "Kickboxing", "Wrestling"], year: 2017 },
  { name: "Northeast Combat Academy", city: "Guwahati", state: "Assam", disciplines: ["MMA", "Boxing", "Judo"], year: 2019 },
  { name: "Octagon India", city: "Noida", state: "Uttar Pradesh", disciplines: ["MMA", "BJJ", "Kickboxing"], year: 2016 }
];

export default function Pipeline() {
  const [filterState, setFilterState] = useState<string>("All");
  const [filterDiscipline, setFilterDiscipline] = useState<string>("All");

  const states = useMemo(() => ["All", ...Array.from(new Set(gymsData.map(g => g.state))).sort()], []);
  const disciplines = useMemo(() => ["All", ...Array.from(new Set(gymsData.flatMap(g => g.disciplines))).sort()], []);

  const filteredGyms = useMemo(() => {
    return gymsData.filter(g => {
      const stateMatch = filterState === "All" || g.state === filterState;
      const disciplineMatch = filterDiscipline === "All" || g.disciplines.includes(filterDiscipline);
      return stateMatch && disciplineMatch;
    });
  }, [filterState, filterDiscipline]);

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-primary">FIGHTER PIPELINE</h1>
          <p className="text-xl text-muted-foreground font-mono uppercase tracking-widest max-w-3xl mx-auto">
            From local mats to the RAW Octagon.
          </p>
        </motion.div>

        {/* 1. The Pipeline */}
        <section className="mb-24 overflow-x-auto pb-8">
          <div className="min-w-[800px]">
            <div className="flex items-start justify-between relative">
              <div className="absolute top-8 left-0 right-0 h-1 bg-border z-0" />
              {[
                { step: 1, title: "Discovery", desc: "Social, gyms, tryouts" },
                { step: 2, title: "Physical Assessment", desc: "Fitness tests, sparring eval" },
                { step: 3, title: "RAW Training Camp", desc: "6 weeks, coached" },
                { step: 4, title: "Showcase Bout", desc: "Filmed, evaluated" },
                { step: 5, title: "Contract Decision", desc: "Sign or release with feedback" },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center relative z-10 w-1/5 text-center">
                  <div className="w-16 h-16 bg-card border-4 border-border rounded-full flex items-center justify-center text-xl font-black text-foreground mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold uppercase tracking-tight text-sm md:text-base">{item.title}</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Feeder Sports */}
        <section className="mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">The Ancestry of Violence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { sport: "Wrestling", desc: "Takedowns, body control — India has Olympic medals" },
              { sport: "Boxing", desc: "Hands, head movement, footwork" },
              { sport: "Kabaddi", desc: "Explosive athleticism, grappling instinct, breath control" },
              { sport: "Judo", desc: "Throws, clinch fighting, ground transitions" },
              { sport: "Muay Thai", desc: "Striking variety, devastating leg kicks" },
            ].map((feeder) => (
              <div key={feeder.sport} className="bg-secondary/20 border border-border p-6 hover:border-primary transition-colors">
                <h4 className="text-xl font-black uppercase mb-3 text-primary">{feeder.sport}</h4>
                <p className="font-mono text-sm text-muted-foreground">{feeder.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. MMA Gym Directory */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <h2 className="text-3xl font-black uppercase tracking-tight">RAW Partner Network</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">State</label>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger className="w-[180px] rounded-none border-border bg-card">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {states.map(state => (
                      <SelectItem key={state} value={state} className="font-mono rounded-none">{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discipline</label>
                <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
                  <SelectTrigger className="w-[180px] rounded-none border-border bg-card">
                    <SelectValue placeholder="Select Discipline" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {disciplines.map(disc => (
                      <SelectItem key={disc} value={disc} className="font-mono rounded-none">{disc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGyms.map((gym, i) => (
              <motion.div 
                key={`${gym.name}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold uppercase tracking-tight text-lg">{gym.name}</h4>
                  <span className="text-xs font-mono text-primary font-bold">EST. {gym.year}</span>
                </div>
                <div className="text-sm font-mono text-muted-foreground mb-4">
                  {gym.city}, {gym.state}
                </div>
                <div className="flex flex-wrap gap-2">
                  {gym.disciplines.map(d => (
                    <span key={d} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-secondary text-secondary-foreground border border-border">
                      {d}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            {filteredGyms.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground font-mono">
                No gyms found matching criteria.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
