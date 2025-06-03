import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom marker icon (default Leaflet icon fix for React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const position = [26.062, 32.241]; // Nag Hammadi, Qena

export default function MapNagHamadi() {
  return (
    <div className="my-5" data-aos="zoom-in">
      <h4 className="fw-bold text-center mb-4">خريطة الموقع - نجع حمادي، قنا</h4>
      <div className="d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: 600, height: 400, borderRadius: 18, overflow: "hidden", boxShadow: "0 0 24px #eee" }}>
          <MapContainer center={position} zoom={14} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                نجع حمادي، محافظة قنا
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      <div className="mt-3 text-center text-muted" style={{ fontSize: '1rem' }}>
        الموقع لمقرنا في نجع حمادي، محافظة قنا
      </div>
    </div>
  );
} 