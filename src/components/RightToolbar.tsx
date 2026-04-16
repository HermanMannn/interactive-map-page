import { Home, Calendar, Grid3X3, MessageSquare, Settings } from "lucide-react";

const tools = [
  { icon: Home, label: "Home" },
  { icon: Calendar, label: "Calendar" },
  { icon: Grid3X3, label: "Grid" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

export default function RightToolbar() {
  return (
    <aside className="absolute top-0 right-0 z-10 flex h-full w-14 flex-col items-center gap-2 bg-card/90 backdrop-blur-sm border-l border-border py-4">
      {tools.map((tool) => (
        <button
          key={tool.label}
          title={tool.label}
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent/40 hover:text-primary transition-colors"
        >
          <tool.icon className="h-5 w-5" />
        </button>
      ))}
    </aside>
  );
}
