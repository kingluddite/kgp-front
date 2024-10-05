"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import the Link component from Next.js
import styles from "./home/HomePage.module.css"; // Import your CSS module

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <Link href="/" passHref>
          <div className={styles.imageContainer} style={{ cursor: "pointer" }}>
            <Image
              src="/images/killasser-cemetery.png" // Adjust image path as needed
              alt="Killasser Cemetery"
              width={300}
              height={300}
              priority
            />
          </div>
        </Link>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>Killasser Cemetery</h1>
          <p className={styles.description}>
            A peaceful and historic resting place in County Mayo, Ireland.
          </p>

          {/* Button to link to search page */}
          <Link href="/search" passHref>
            <button className={styles.findGraveButton}>Find a Grave</button>
          </Link>
        </div>
      </header>
    </div>
  );
}
