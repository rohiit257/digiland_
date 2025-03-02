"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ coordinates }) {
  const mapRef = useRef(null);
  const zoomLevel = 15; // Default zoom level

  useEffect(() => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) return;

    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map("map", {
        center: [coordinates.lat, coordinates.lng],
        zoom: zoomLevel, // Set initial zoom
        zoomControl: true, // Enable zoom controls
        scrollWheelZoom: true, // Allow zoom with scroll
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Add marker
      L.marker([coordinates.lat, coordinates.lng])
        .addTo(mapRef.current)
        .bindPopup("Property Location")
        .openPopup();
    } else {
      // If map already exists, update view & zoom
      mapRef.current.setView([coordinates.lat, coordinates.lng], zoomLevel);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates]);

  return <div id="map" className="w-full h-[400px] rounded-md mt-4" />;
}
