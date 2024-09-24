"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import the Link component from Next.js
import people, { Person } from "../data/peopleData";

export default function HomePage() {
  // Use imported data for people
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Person[]>([]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setResults([]);
    } else {
      // Filter the people list by last name
      const filteredResults = people.filter((person) =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      setResults(filteredResults);
    }
  };

  return (
    <div>
      {/* Header Section with the Image */}
      <header style={styles.header}>
        <div style={styles.imageContainer}>
          <Image
            src="/images/killasser-cemetery.png"
            alt="Killasser Cemetery"
            width={200} // Adjust based on desired size
            height={200} // Adjust based on desired size
          />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.heading}>Killasser Cemetery</h1>
          <p style={styles.description}>
            Killasser Cemetery is a serene and historic burial ground located in
            the peaceful countryside of County Mayo, Ireland. It is known for
            its quiet ambiance, traditional Irish gravestones, and the natural
            beauty of the surrounding landscape.
          </p>
        </div>
      </header>

      {/* Celtic Border Image */}
      <div style={styles.celticBorder}></div>

      {/* Main Content */}
      <div className="container mt-5">
        <h1>Search for a Last Name</h1>

        {/* Search Input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter last name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Render Results as Cards */}
        <div className="row">
          {results.length > 0
            ? results.map((person, index) => (
                <div className="col-md-4" key={index}>
                  <Link href={`/person/${person.slug}`} passHref>
                    <div className="card mb-4" style={{ cursor: "pointer" }}>
                      <div className="card-body">
                        <h5 className="card-title">{person.name}</h5>
                        <p className="card-text">Click to view more details</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            : searchTerm && (
                <p>No results found for &quot;{searchTerm}&quot;</p>
              )}
        </div>
      </div>
    </div>
  );
}

// Custom styles for the header and image
const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
    padding: "20px",
    color: "white",
    position: "relative", // Ensure that content stays inside the header
  },
  imageContainer: {
    flex: "0 0 auto",
    marginRight: "20px",
  },
  textContainer: {
    flex: "1",
  },
  heading: {
    fontSize: "2rem",
    margin: 0,
  },
  description: {
    fontSize: "1.2rem",
    marginTop: "10px",
    lineHeight: "1.5",
  },
  // Add Celtic border just below the header and above the form
  celticBorder: {
    height: "40px", // Adjust height based on your Celtic border image
    backgroundImage: 'url("/images/celtic-border.png")', // Use the correct image path
    backgroundRepeat: "repeat-x",
    backgroundSize: "contain",
    marginTop: "-5px", // Adjust margin if needed to eliminate space
  },
};
