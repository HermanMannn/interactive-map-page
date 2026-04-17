type Coords = { lat: number; lng: number; zoom?: number };
type Listener = (c: Coords) => void;

const listeners = new Set<Listener>();

export const mapEvents = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  flyTo(coords: Coords) {
    listeners.forEach((fn) => fn(coords));
  },
};
