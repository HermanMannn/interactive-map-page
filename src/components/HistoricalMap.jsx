import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
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
      // Expose Leaflet globally so the maplibre-gl-leaflet plugin can attach to it.
      if (typeof window !== "undefined") window.L = L;
      await import("maplibre-gl");
      await import("@maplibre/maplibre-gl-leaflet");

      if (cancelled || !mapRef.current || mapInstance.current) return;

      map = L.map(mapRef.current, {
        center: [31.5, 35.0],
        zoom: 8,
        zoomControl: false,
        attributionControl: false,
      });

      if (typeof L.maplibreGL === "function") {
        const glLayer = L.maplibreGL({
          style: "https://tiles.openfreemap.org/styles/liberty",
          attribution:
            '© <a href="https://openfreemap.org">OpenFreeMap</a> © OpenStreetMap',
        }).addTo(map);

        // Force all label layers to English ("name:en"), falling back to "name".
        const forceEnglishLabels = () => {
          const glMap = glLayer.getMaplibreMap?.();
          if (!glMap) return;
          const style = glMap.getStyle();
          if (!style?.layers) return;
          for (const layer of style.layers) {
            if (layer.type === "symbol" && layer.layout?.["text-field"]) {
              glMap.setLayoutProperty(layer.id, "text-field", [
                "coalesce",
                ["get", "name:en"],
                ["get", "name_en"],
                ["get", "name:latin"],
                ["get", "name"],
              ]);
            }
          }
        };
        const glMap = glLayer.getMaplibreMap?.();
        if (glMap) {
          if (glMap.isStyleLoaded()) forceEnglishLabels();
          else glMap.on("styledata", forceEnglishLabels);
        }
      } else {
        // Fallback to raster tiles if the GL plugin failed to attach.
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        }).addTo(map);
      }

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);
      mapInstance.current = map;

      // Ensure Leaflet measures the container correctly after mount.
      setTimeout(() => map.invalidateSize(), 0);

      let marker = null;
      let circle = null;

      unsub = mapEvents.subscribe(({ lat, lng, zoom }) => {
        map.flyTo([lat, lng], zoom ?? 11, { duration: 1.5 });

        if (marker) marker.remove();
        if (circle) circle.remove();

        marker = L.marker([lat, lng]).addTo(map);
        circle = L.circle([lat, lng], {
          radius: 4000, // 4 km
          color: "#ef4444",
          weight: 1,
          fillColor: "#ef4444",
          fillOpacity: 0.25,
        }).addTo(map);
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
