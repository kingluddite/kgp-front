"use client";
import React, { useState } from "react";
import Link from "next/link";
import people, { Person } from "../../data/peopleData"; // Import your people data
import styles from "./SearchPage.module.css"; // Import your CSS module

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Person[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setResults([]);
    } else {
      const filteredResults = people.filter((person) =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      setResults(filteredResults);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Search for a Grave</h1>

      {/* Search Form */}
      <input
        type="text"
        className="form-control"
        placeholder="Enter last name"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Search Results */}
      <div className={styles.resultsContainer}>
        {results.length > 0
          ? results.map((person, index) => (
              <div className={styles.card} key={index}>
                <Link href={`/person/${person.slug}`} passHref>
                  <div>
                    <h5>{person.name}</h5>
                    <p>Click to view more details</p>
                  </div>
                </Link>
              </div>
            ))
          : searchTerm && <p>No results found for &quot;{searchTerm}&quot;</p>}
      </div>
    </div>
  );
}
