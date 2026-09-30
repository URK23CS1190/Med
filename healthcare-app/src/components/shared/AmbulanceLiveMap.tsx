"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Medical Icons
const hospitalIcon = L.divIcon({
  html: `<div class="w-10 h-10 bg-white border-2 border-primary-500 rounded-full flex items-center justify-center shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
         </div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const ambulanceIcon = L.divIcon({
  html: `<div class="w-12 h-12 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8"/><path d="m3 11 3-3V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3l3 3"/><path d="M12 7h.01"/><path d="M8 11h8"/><path d="M8 15h8"/></svg>
         </div>`,
  className: "",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  beds: number;
}

interface AmbulanceLiveMapProps {
  hospitals: Hospital[];
  selectedHospitalId?: string;
  ambulancePos: [number, number];
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function AmbulanceLiveMap({ hospitals, selectedHospitalId, ambulancePos }: AmbulanceLiveMapProps) {
  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);
  const pathCoordinates: [number, number][] = selectedHospital 
    ? [ambulancePos, [selectedHospital.lat, selectedHospital.lng]] 
    : [];

  return (
    <MapContainer 
      center={ambulancePos} 
      zoom={13} 
      className="w-full h-full z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ChangeView center={ambulancePos} />

      {/* Ambulance Marker */}
      <Marker position={ambulancePos} icon={ambulanceIcon}>
        <Popup>Your Location</Popup>
      </Marker>

      {/* Hospital Markers */}
      {hospitals.map(h => (
        <Marker 
          key={h.id} 
          position={[h.lat, h.lng]} 
          icon={hospitalIcon}
        >
          <Popup>
            <div className="p-1">
              <h4 className="font-bold">{h.name}</h4>
              <p className="text-xs">{h.beds} Beds Available</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Route Line */}
      {pathCoordinates.length > 0 && (
        <>
            {/* Route Polyline */}
            <Polyline 
                positions={pathCoordinates} 
                color="#3b82f6" 
                weight={6} 
                opacity={0.8}
                dashArray="1, 12"
                lineCap="round"
            />

            {/* Simulated Traffic Layers - High Saturation */}
            <Polyline 
                positions={[[19.110, 72.850], [19.115, 72.860], [19.120, 72.865]]} 
                color="#ef4444" 
                weight={8} 
                opacity={0.6}
            >
                <Popup>Heavy Traffic - 12m delay</Popup>
            </Polyline>
            
            <Polyline 
                positions={[[19.090, 72.840], [19.100, 72.845], [19.105, 72.848]]} 
                color="#f59e0b" 
                weight={8} 
                opacity={0.6}
            >
                <Popup>Moderate Congestion</Popup>
            </Polyline>

            <Polyline 
                positions={[[19.102, 72.848], [19.108, 72.852]]} 
                color="#10b981" 
                weight={8} 
                opacity={0.6}
            >
                <Popup>Clear Path</Popup>
            </Polyline>

          <Polyline 
            positions={pathCoordinates} 
            color="#3b82f6" 
            weight={2} 
            opacity={0.4}
          />
        </>
      )}
    </MapContainer>
  );
}
