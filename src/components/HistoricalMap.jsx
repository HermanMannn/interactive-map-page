import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { mapEvents } from "../lib/mapEvents";

export default function HistoricalMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let map;
    let unsub;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || mapInstance.current) return;

      map = L.map(mapRef.current, {
        center: [31.9, 35.2],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18 }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstance.current = map;

      unsub = mapEvents.subscribe(({ lat, lng, zoom }) => {
        map.flyTo([lat, lng], zoom ?? 11, { duration: 1.5 });
      });
    })();

    return () => {
      cancelled = true;
      if (unsub) unsub();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
