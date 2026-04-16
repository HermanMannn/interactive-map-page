import { createFileRoute } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import TimelineSidebar from "../components/TimelineSidebar";
import RightToolbar from "../components/RightToolbar";
import HistoricalMap from "../components/HistoricalMap";

export const Route = createFileRoute("/")({
  component: TimelinePage,
  head: () => ({
    meta: [
      { title: "Palestine Recorded — Interactive Timeline" },
      {
        name: "description",
        content:
          "Explore the historical timeline of Palestine with an interactive map.",
      },
    ],
  }),
});

function TimelinePage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="relative flex-1">
        <HistoricalMap />
        <TimelineSidebar />
        <RightToolbar />
      </div>
    </div>
  );
}
