import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-sm border-b border-border">
      <Link to="/" className="flex items-center gap-3">
        {/* Logo - diamond icon */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 40 40"
          fill="none"
          className="text-primary"
        >
          <rect
            x="20"
            y="2"
            width="14"
            height="14"
            rx="1"
            transform="rotate(45 20 2)"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          />
          <rect
            x="20"
            y="10"
            width="8"
            height="8"
            rx="1"
            transform="rotate(45 20 10)"
            fill="currentColor"
          />
        </svg>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Palestine Recorded
        </span>
      </Link>

      <nav className="flex items-center gap-8">
        <Link
          to="/"
          className="text-base font-medium text-foreground hover:text-primary transition-colors"
        >
          About
        </Link>
        <Link
          to="/"
          className="text-base font-medium text-foreground hover:text-primary transition-colors"
        >
          Donate
        </Link>
        <Link
          to="/"
          className="text-base font-medium text-foreground hover:text-primary transition-colors"
        >
          Contact Us
        </Link>
      </nav>
    </header>
  );
}
