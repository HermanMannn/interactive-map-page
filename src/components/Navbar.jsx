import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-sm border-b border-border">
      <Link to="/" className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight text-foreground">
          Palestine Recorded
        </span>
      </Link>

      <nav className="flex items-center gap-8">
        <Link to="/" className="text-base font-medium text-foreground hover:text-primary transition-colors">
          About
        </Link>
        <Link to="/" className="text-base font-medium text-foreground hover:text-primary transition-colors">
          Donate
        </Link>
        <Link to="/" className="text-base font-medium text-foreground hover:text-primary transition-colors">
          Contact Us
        </Link>
      </nav>
    </header>
  );
}
