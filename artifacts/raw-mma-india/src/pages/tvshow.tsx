import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const budgetData = [
  { name: "Fighter Talent & Fees", value: 28 },
  { name: "Crew & Equipment", value: 24 },
  { name: "Location & Logistics", value: 18 },
  { name: "Post-Production & Edit", value: 16 },
  { name: "Marketing & Promotion", value: 14 },
];

const COLORS = ["hsl(10 90% 45%)", "hsl(0 0% 40%)", "hsl(0 0% 60%)", "hsl(0 0% 20%)", "hsl(25 85% 55%)"];

export default function TvShow() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-primary">THE RAW CONTENDER SERIES</h1>
          <p className="text-xl text-muted-foreground font-mono uppercase tracking-widest max-w-3xl mx-auto">
            Building India's first MMA stars before the events exist. 4 cities. One contract per episode.
          </p>
        </motion.div>

        {/* 1. Concept */}
        <section className="mb-24">
          <div className="bg-card border-l-4 border-primary p-8">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">The Concept</h2>
            <p className="text-muted-foreground font-mono text-lg leading-relaxed">
              A reality competition series modeled on Dana White's Contender Series. Each episode features 4-6 aspiring Indian MMA fighters competing for a RAW contract. Filmed across 4 Indian cities. Episodes show fighter stories, training, and the bouts. Goal: build India's first MMA stars before the events exist.
            </p>
          </div>
        </section>

        {/* 2. Episode Format */}
        <section className="mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Episode Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border rounded-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase text-primary">Day 1: The Build-Up</CardTitle>
              </CardHeader>
              <CardContent className="font-mono text-muted-foreground">
                Fighter Arrival → Media Day → Weigh-Ins → Athlete Profiles filmed
              </CardContent>
            </Card>
            <Card className="bg-card border-border rounded-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase text-primary">Day 2: The Violence</CardTitle>
              </CardHeader>
              <CardContent className="font-mono text-muted-foreground">
                Walkouts → Fights (3 x 5-min rounds) → Post-fight interviews → Contract Decision
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. Fight Rules & Weight Classes */}
        <section className="mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Unified MMA Rules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { class: "Featherweight", weight: "Up to 66kg" },
              { class: "Lightweight", weight: "Up to 70kg" },
              { class: "Welterweight", weight: "Up to 77kg" },
              { class: "Middleweight", weight: "Up to 84kg" },
            ].map((wc) => (
              <div key={wc.class} className="border border-border bg-secondary/20 p-6 text-center">
                <div className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">{wc.class}</div>
                <div className="font-mono text-sm text-primary uppercase tracking-widest">{wc.weight}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Fighter Recruitment */}
        <section className="mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Fighter Recruitment Funnel</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {[
              { step: 1, title: "Regional Tryouts", desc: "4 Cities: Delhi, Mumbai, Bengaluru, Hyderabad" },
              { step: 2, title: "Gym Referrals", desc: "Partnered gyms nominate top athletes" },
              { step: 3, title: "Social Open Call", desc: "Submit 60-second fight reel + stats" },
            ].map((item, i) => (
              <div key={i} className="flex-1 w-full bg-card border border-border p-6 relative">
                <div className="text-5xl font-black text-primary/20 absolute top-4 right-4">{item.step}</div>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-2 relative z-10">{item.title}</h3>
                <p className="font-mono text-sm text-muted-foreground relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* 5. Production Logistics */}
          <section>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Production Crew</h2>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="uppercase font-bold tracking-widest text-muted-foreground">Role</TableHead>
                  <TableHead className="uppercase font-bold tracking-widest text-muted-foreground text-right">Headcount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { role: "Director", count: 1 },
                  { role: "Camera Operators", count: 4 },
                  { role: "Ring Announcer", count: 1 },
                  { role: "Commentary Team", count: 2 },
                  { role: "Cage-Side Medical", count: 3 },
                  { role: "Lighting/Grip Crew", count: 6 },
                  { role: "Post-Production Team", count: 4 },
                  { role: "Social Media Team", count: 2 },
                ].map((row) => (
                  <TableRow key={row.role} className="border-border/50">
                    <TableCell className="font-mono">{row.role}</TableCell>
                    <TableCell className="text-right font-black">{row.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 p-4 border border-primary/30 bg-primary/5 font-mono text-sm text-muted-foreground">
              <strong className="text-foreground uppercase">Location Strategy:</strong> Year 1 — rented venues in Delhi, Mumbai, Bengaluru, Hyderabad. Capacity: 500-1500 seats. No arena until Year 3.
            </div>
          </section>

          {/* 6. Budget Breakdown */}
          <section>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Budget Per Episode</h2>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 0, color: 'white' }}
                    itemStyle={{ color: 'white', fontFamily: 'monospace' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <div className="text-2xl font-black text-primary">₹25-40L</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Est. Cost</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {budgetData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <div className="w-3 h-3" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 7. Distribution Strategy */}
        <section>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Distribution Strategy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { platform: "YouTube", tag: "Primary, Year 1", desc: "Free, builds initial audience" },
              { platform: "JioStar", tag: "Target, Year 2", desc: "400M+ reach" },
              { platform: "Sony LIV", tag: "Target, Year 2", desc: "Premium sports audience" },
              { platform: "Regional TV", tag: "Year 2-3", desc: "Language-specific markets" },
              { platform: "International", tag: "Year 3+", desc: "ONE Championship model" },
            ].map((dist) => (
              <div key={dist.platform} className="border border-border p-4 hover:border-primary transition-colors flex flex-col h-full">
                <div className="text-xs font-bold text-primary tracking-widest uppercase mb-2">{dist.tag}</div>
                <h4 className="text-xl font-black uppercase mb-2">{dist.platform}</h4>
                <p className="font-mono text-xs text-muted-foreground mt-auto">{dist.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
