import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Wordle from "@/components/Wordle";
import RightToolbar from "@/components/RightToolbar";

export const Route = createFileRoute("/wordle")({
  component: WordlePage,
});

function WordlePage() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="relative flex-1 overflow-hidden">
        <Wordle />
        <RightToolbar />
      </div>
    </div>
  );
}
