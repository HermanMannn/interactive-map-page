import { useState } from "react";

const timelineData = [
  {
    year: 1947,
    months: [
      {
        month: "November",
        events: [
          { title: "UN General Assembly Resolution 181", type: "resolution" },
        ],
      },
      {
        month: "December",
        events: [
          { title: "Oil Refinery Massacre", type: "massacre" },
          { title: "Balad Al-Sheykh Massacre", type: "massacre" },
        ],
      },
    ],
  },
  {
    year: 1948,
    months: [
      {
        month: "February",
        events: [{ title: "Khirbat Sa'Sa' Massacre", type: "massacre" }],
      },
      {
        month: "March",
        events: [
          { title: "Najmat Al-Subuh Battle", type: "battle" },
          { title: "Al-Husayniah Massacre", type: "massacre" },
        ],
      },
      {
        month: "April",
        events: [
          { title: "Mishmar Haemek Battle", type: "battle" },
          { title: "Dayr Yasin Massacre", type: "massacre" },
          { title: "Tiberias Battle", type: "battle" },
          { title: "Haifa Battle", type: "battle" },
        ],
      },
      {
        month: "May",
        events: [
          { title: "Declaration of State of Israel", type: "other" },
          { title: "Tantura Massacre", type: "massacre" },
          { title: "Lydda Massacre", type: "massacre" },
        ],
      },
      {
        month: "October",
        events: [
          { title: "Al-Dawayima Massacre", type: "massacre" },
          { title: "Safsaf Massacre", type: "massacre" },
        ],
      },
    ],
  },
  {
    year: 1949,
    months: [
      {
        month: "March",
        events: [{ title: "Armistice Agreements", type: "other" }],
      },
    ],
  },
];

function getEventDotClass(type) {
  switch (type) {
    case "battle":
      return "bg-timeline-event-battle";
    case "massacre":
      return "bg-timeline-event-massacre";
    case "resolution":
      return "bg-primary";
    default:
      return "bg-muted-foreground";
  }
}

export default function TimelineSidebar() {
  const [search, setSearch] = useState("");

  const filtered = timelineData
    .map((year) => ({
      ...year,
      months: year.months
        .map((m) => ({
          ...m,
          events: m.events.filter((e) =>
            e.title.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((m) => m.events.length > 0),
    }))
    .filter((y) => y.months.length > 0);

  return (
    <aside className="absolute top-0 left-0 z-10 h-full w-72 overflow-y-auto bg-card/90 backdrop-blur-sm border-r border-border">
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-3 border-b border-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>

      <div className="p-3 space-y-4">
        {filtered.map((year) => (
          <div key={year.year}>
            <h2 className="text-2xl font-black text-timeline-year italic">
              {year.year}
            </h2>
            {year.months.map((month) => (
              <div key={month.month} className="mt-1.5 ml-1">
                <h3 className="text-sm font-bold italic text-timeline-month">
                  {month.month}
                </h3>
                <div className="ml-1 border-l-2 border-timeline-border pl-2 space-y-0.5">
                  {month.events.map((event) => (
                    <div
                      key={event.title}
                      className="flex items-center gap-1.5 cursor-pointer hover:bg-accent/30 rounded px-1 py-0.5 transition-colors"
                    >
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${getEventDotClass(event.type)}`}
                      />
                      <span className="text-xs text-foreground leading-tight truncate">
                        {event.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
