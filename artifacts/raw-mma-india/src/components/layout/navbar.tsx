import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/ecosystem", label: "Ecosystem" },
    { href: "/tvshow", label: "TV Show" },
    { href: "/pipeline", label: "Fighter Pipeline" },
    { href: "/sponsorship", label: "Sponsorship" },
    { href: "/investors", label: "Investors" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary">RAW</Link>
        <div className="hidden md:flex gap-6 text-sm font-medium tracking-wide">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`hover:text-foreground transition-colors uppercase ${location === link.href ? "text-foreground" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Button className="font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90" data-testid="btn-get-involved">
          Get Involved
        </Button>
      </div>
    </nav>
  );
}
