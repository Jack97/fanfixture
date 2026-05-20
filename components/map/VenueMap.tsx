"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Venue } from "@/lib/football-api/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons broken by webpack
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  venue: Venue;
}

export default function VenueMap({ venue }: Props) {
  useEffect(() => {
    // Ensure Leaflet container resizes correctly on mount
  }, []);

  return (
    <div className="rounded-sm overflow-hidden border border-[var(--color-pitch-border)] h-64 sm:h-80">
      <MapContainer
        center={[venue.lat, venue.lng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[venue.lat, venue.lng]} icon={icon}>
          <Popup>
            <strong>{venue.name}</strong>
            <br />
            {venue.address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
