"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  // useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import people, { Person } from "../../data/peopleData"; // Your people data

// Custom tombstone marker icon
const tombstoneIcon = new L.Icon({
  iconUrl: "/images/tombstone.png", // Path to your custom tombstone icon
  iconSize: [32, 37], // Adjust based on your icon's dimensions
  iconAnchor: [16, 37], // Position of the icon anchor (where the point of the icon should be)
  popupAnchor: [0, -37], // Position of the popup relative to the icon
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41], // Optional, if you want the shadow under your custom icon
});

// Custom highlighted icon (optional)
const highlightedIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png", // Example of a different icon for highlighted graves
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to capture map drag/move and get current coordinates
// function LocationMarker() {
//   const [position, setPosition] = useState<L.LatLng | null>(null);
//
//   useMapEvents({
//     dragend: (e) => {
//       const map = e.target;
//       const center = map.getCenter();
//       setPosition(center);
//       console.log("Current Center:", center); // Log the latitude and longitude when dragging ends
//     },
//     moveend: (e) => {
//       const map = e.target;
//       const center = map.getCenter();
//       setPosition(center);
//       console.log("Map Moved to:", center); // Log the latitude and longitude when the map is moved
//     },
//   });
//
//   return position === null ? null : (
//     <Marker position={position} icon={tombstoneIcon}>
//       <Popup>
//         Map center: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
//       </Popup>
//     </Marker>
//   );
// }
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [highlightedGraves, setHighlightedGraves] = useState<Person[]>([]);

  useEffect(() => {
    if (people.length === 0) {
      console.log("No people data available");
    } else {
      console.log("People data:", people);
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter graves based on search input
    if (searchValue === "") {
      setHighlightedGraves([]);
    } else {
      const filteredResults = people.filter((person) =>
        person.name.toLowerCase().includes(searchValue),
      );
      setHighlightedGraves(filteredResults);
    }
  };

  // Helper component to adjust map view to show all markers
  function ResetCenterView({ graves }: { graves: Person[] }) {
    const map = useMap();

    useEffect(() => {
      if (graves.length > 0) {
        // Filter out any graves with invalid lat or lng
        const validGraves = graves.filter((grave) => grave.lat && grave.lng);

        if (validGraves.length > 0) {
          const bounds = L.latLngBounds(
            validGraves.map((grave) => [grave.lat, grave.lng]),
          );
          map.fitBounds(bounds);
        }
      }
    }, [graves, map]);

    return null;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Search for a Grave</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Enter last name"
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

      {/* Leaflet Map */}
      <MapContainer
        center={[54.00355045322079, -8.964299261569979]} // Coordinates for Killasser Cemetery
        zoom={19} // Set the zoom level to 19 for close-up view
        scrollWheelZoom={false}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Add LocationMarker to track and display the current map center */}
        {/* <LocationMarker /> */}

        {/* Markers for all graves */}
        {people
          .filter((person) => person.lat && person.lng) // Ensure lat and lng exist
          .map((person, index) => {
            const isHighlighted = highlightedGraves.includes(person);

            return (
              <Marker
                key={index}
                position={[person.lat, person.lng]}
                icon={isHighlighted ? highlightedIcon : tombstoneIcon}
              >
                <Popup>
                  <div>
                    <h5>{person.name}</h5>
                    <p>
                      Location: [{person.lat}, {person.lng}]
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Automatically adjust map view to fit all markers */}
        <ResetCenterView
          graves={highlightedGraves.length > 0 ? highlightedGraves : people}
        />
      </MapContainer>
    </div>
  );
}
