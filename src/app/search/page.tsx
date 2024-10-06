"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import client from "../../lib/sanityClient";
import { Person } from "../../data/peopleData";
import styles from "./SearchPage.module.css";

// Dynamically import Leaflet components without SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Dynamically load Leaflet icon configuration (client-side only)
let tombstoneIcon: L.Icon | null = null;
if (typeof window !== "undefined") {
  import("leaflet").then((L) => {
    tombstoneIcon = new L.Icon({
      iconUrl: "/images/tombstone.png",
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -37],
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [41, 41],
    });
  });
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [highlightedGraves, setHighlightedGraves] = useState<Person[]>([]);
  const [graves, setGraves] = useState<Person[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gravesData = await client.fetch(`
          *[_type == "grave"]{
            _id,
            name,
            nickname,
            image,
            lat,
            lng,
            googlemapurl,
            town,
            deathdate,
            dob,
            misc
          }
        `);
        setGraves(gravesData);
      } catch (error) {
        console.error("Error fetching graves data from Sanity:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setHighlightedGraves([]);
    } else {
      const filteredResults = graves.filter((person) =>
        person.name.toLowerCase().includes(searchValue),
      );
      setHighlightedGraves(filteredResults);
    }
  };

  const calculateAge = (dob: string | null, deathdate: string | null) => {
    if (!dob || !deathdate) return "Unknown";

    const birthDate = new Date(dob);
    const deathDate = new Date(deathdate);

    let age = deathDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = deathDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <header className={styles.header}>
        <div className={styles.imageContainer}>
          <Link href="/" passHref>
            <div style={{ cursor: "pointer" }}>
              <Image
                src="/images/killasser-cemetery.png"
                alt="Killasser Cemetery"
                width={100}
                height={100}
                priority
              />
            </div>
          </Link>
        </div>
        <div className={styles.textContainer}>
          <h1>Search for a Grave</h1>
          <input
            type="text"
            placeholder="Enter Full Name"
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: "10px",
              width: "300px",
              marginBottom: "20px",
            }}
          />
        </div>
      </header>

      {typeof window !== "undefined" && tombstoneIcon && (
        <MapContainer
          center={[54.00355045322079, -8.964299261569979]}
          zoom={19}
          scrollWheelZoom={false}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {highlightedGraves.length > 0
            ? highlightedGraves
                .filter((person) => person.lat && person.lng)
                .map((person, index) => {
                  const lat = person.lat ? parseFloat(person.lat) : 0;
                  const lng = person.lng ? parseFloat(person.lng) : 0;

                  if (isNaN(lat) || isNaN(lng) || !tombstoneIcon) return null; // Ensure tombstoneIcon is defined

                  return (
                    <Marker
                      key={index}
                      position={[lat, lng]}
                      icon={tombstoneIcon} // Only pass icon if it's defined
                    >
                      <Popup>
                        <div>
                          <h5>{person.name}</h5>
                          <p>
                            <strong>Date of Birth:</strong>{" "}
                            {formatDate(person.dob)} <br />
                            <strong>Date of Death:</strong>{" "}
                            {formatDate(person.deathdate)} <br />
                            <strong>Age:</strong>{" "}
                            {calculateAge(person.dob, person.deathdate)} <br />
                            {person.googlemapurl && (
                              <a
                                href={person.googlemapurl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View on Google Maps
                              </a>
                            )}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })
            : graves
                .filter((person) => person.lat && person.lng)
                .map((person, index) => {
                  const lat = person.lat ? parseFloat(person.lat) : 0;
                  const lng = person.lng ? parseFloat(person.lng) : 0;

                  if (isNaN(lat) || isNaN(lng) || !tombstoneIcon) return null; // Ensure tombstoneIcon is defined

                  return (
                    <Marker
                      key={index}
                      position={[lat, lng]}
                      icon={tombstoneIcon} // Only pass icon if it's defined
                    >
                      <Popup>
                        <div>
                          <h5>{person.name}</h5>
                          <p>
                            <strong>Date of Birth:</strong>{" "}
                            {formatDate(person.dob)} <br />
                            <strong>Date of Death:</strong>{" "}
                            {formatDate(person.deathdate)} <br />
                            <strong>Age:</strong>{" "}
                            {calculateAge(person.dob, person.deathdate)} <br />
                            {person.googlemapurl && (
                              <a
                                href={person.googlemapurl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View on Google Maps
                              </a>
                            )}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
        </MapContainer>
      )}
    </div>
  );
}
