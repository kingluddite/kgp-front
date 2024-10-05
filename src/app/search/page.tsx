"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link"; // Import the Link component from Next.js
import Image from "next/image"; // Import the Image component from Next.js
import client from "../../lib/sanityClient"; // Import Sanity client
import { Person } from "../../data/peopleData"; // Import the Person type
import styles from "./SearchPage.module.css"; // Import your CSS module

// Custom tombstone marker icon
const tombstoneIcon = new L.Icon({
  iconUrl: "/images/tombstone.png", // Path to your custom tombstone icon
  iconSize: [32, 37],
  iconAnchor: [16, 37],
  popupAnchor: [0, -37],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [highlightedGraves, setHighlightedGraves] = useState<Person[]>([]);
  const [graves, setGraves] = useState<Person[]>([]); // State to store fetched data

  useEffect(() => {
    // Fetch the graves data from Sanity
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
  }, []); // Fetch data on component mount

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter graves based on search input
    if (searchValue === "") {
      setHighlightedGraves([]);
    } else {
      const filteredResults = graves.filter((person) =>
        person.name.toLowerCase().includes(searchValue),
      );
      setHighlightedGraves(filteredResults);
    }
  };

  // Helper function to calculate age from dob and deathdate
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

  // Helper function to format date to 'January 1st, 1900' format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Helper component to adjust map view to show all markers
  function ResetCenterView({ graves }: { graves: Person[] }) {
    const map = useMap();

    useEffect(() => {
      if (graves.length > 0) {
        const validGraves = graves.filter((grave) => grave.lat && grave.lng);

        if (validGraves.length > 0) {
          const bounds = L.latLngBounds(
            validGraves.map((grave) => [
              parseFloat(grave.lat ?? "0"),
              parseFloat(grave.lng ?? "0"),
            ]),
          );
          map.fitBounds(bounds);
        }
      }
    }, [graves, map]);

    return null;
  }

  // Determine which graves to display: only matching graves if search is active, otherwise show all
  const gravesToShow =
    highlightedGraves.length > 0 ? highlightedGraves : graves;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Container to hold image and title/search bar horizontally */}
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
          {/* Search Input */}
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

      {/* Leaflet Map */}
      <MapContainer
        center={[54.00355045322079, -8.964299261569979]} // Coordinates for Killasser Cemetery
        zoom={19}
        scrollWheelZoom={false}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Show only the matching graves */}
        {gravesToShow
          .filter((person) => person.lat && person.lng) // Ensure lat and lng exist
          .map((person, index) => {
            const lat = parseFloat(person.lat ?? "0");
            const lng = parseFloat(person.lng ?? "0");

            if (isNaN(lat) || isNaN(lng)) return null; // Skip if invalid coordinates

            return (
              <Marker
                key={index}
                position={[lat, lng]}
                icon={tombstoneIcon} // Always show the tombstone icon for matches
              >
                <Popup>
                  <div>
                    <h5>{person.name}</h5>
                    {/* Display formatted dates and age */}
                    <p>
                      <strong>Date of Birth:</strong> {formatDate(person.dob)}{" "}
                      <br />
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

        <ResetCenterView graves={gravesToShow} />
      </MapContainer>
    </div>
  );
}
