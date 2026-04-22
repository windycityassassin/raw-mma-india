import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const navLinks = [
  { label: "TV Show", href: "/tv-show" },
  { label: "Fighter Pipeline", href: "/fighter-pipeline" },
  { label: "Sponsorship", href: "/sponsorship" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-black/70 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" data-testid="link-logo">
          <span className="text-2xl font-black tracking-tighter text-[#c0392b] uppercase cursor-pointer select-none">
            RAW MMA
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <span
                  className={`px-4 py-2 text-xs font-bold tracking-widest uppercase cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "text-[#c0392b] border-b-2 border-[#c0392b]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <button
          data-testid="button-mobile-menu"
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 h-[2px] bg-current mb-1.5" />
          <div className="w-6 h-[2px] bg-current mb-1.5" />
          <div className="w-4 h-[2px] bg-current" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/98 border-t border-white/10 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <span
                className="block py-2 text-sm font-bold tracking-widest uppercase text-white/70 hover:text-[#c0392b] transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
