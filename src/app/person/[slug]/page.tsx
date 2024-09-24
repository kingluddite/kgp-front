"use client"; // Ensure client-side rendering

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios"; // For making API requests
import people from "../../../data/peopleData"; // Adjust path as necessary

// Custom tombstone marker
const tombstoneIcon = new L.Icon({
  iconUrl: "/images/tombstone.png",
  iconSize: [32, 37],
  iconAnchor: [16, 37],
  popupAnchor: [0, -37],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Define the type for the coordinates (latitude and longitude)
interface Coordinates {
  lat: number;
  lng: number;
}

interface Point {
  lat: number;
  lng: number;
}

interface Step {
  instruction: string;
  distance: string;
  duration: string;
}

// Function to get walking directions from your API route
const getWalkingRoute = async (start: Coordinates, end: Coordinates) => {
  try {
    const response = await axios.get(`/api/directions`, {
      params: {
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching walking route", error);
    return null;
  }
};

// Function to decode Google Maps polyline
const decodePolyline = (encoded: string): { lat: number; lng: number }[] => {
  const points: { lat: number; lng: number }[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
};

export default function PersonPage({ params }: { params: { slug: string } }) {
  const [route, setRoute] = useState<Point[]>([]); // Initialize as an empty array
  const [steps, setSteps] = useState<Step[]>([]); // State to hold walking instructions
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure map renders only on the client

    // Example coordinates (replace with actual data)
    const currentPosition = { lat: 54.001, lng: -8.964 }; // Replace with actual current location
    const person = people.find((p) => p.slug === params.slug);

    if (person) {
      const gravePosition = {
        lat: person.lat ? parseFloat(person.lat) : 0, // Fallback to 0 if lat is null
        lng: person.long ? parseFloat(person.long) : 0, // Fallback to 0 if long is null
      };

      // Get walking directions from the server-side API route
      getWalkingRoute(currentPosition, gravePosition).then((data) => {
        if (data && data.polyline) {
          const decodedPoints: Point[] = decodePolyline(data.polyline);
          // console.log("Decoded polyline points:", decodedPoints); // Debugging output
          setRoute(decodedPoints); // Set the decoded route points
        }

        if (data && data.steps) {
          // console.log("Walking instructions:", data.steps); // Debugging output
          setSteps(data.steps); // Set the walking instructions
        }
      });
    }
  }, [params.slug]);

  const person = people.find((p) => p.slug === params.slug);
  if (!person) {
    return <p>Person not found</p>; // Handle not found case
  }

  const { name, lat, long } = person;

  return (
    <div>
      <h1>{name}</h1>
      {isClient && (
        <div style={{ height: "500px", width: "100%" }}>
          <MapContainer
            center={[
              lat ? parseFloat(lat) : 0, // Fallback to 0 if lat is null
              long ? parseFloat(long) : 0, // Fallback to 0 if long is null
            ]}
            zoom={19}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {lat && long ? (
              <Marker
                position={[parseFloat(lat), parseFloat(long)]}
                icon={tombstoneIcon}
              />
            ) : (
              <p>Coordinates not available</p>
            )}
            {route.length > 0 && (
              <Polyline
                positions={route.map((point) => [point.lat, point.lng])}
                color="blue"
              />
            )}
          </MapContainer>

          <div>
            <h2>Walking Instructions</h2>
            {steps.length > 0 ? (
              <ul>
                {steps.map((step, index) => (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{ __html: step.instruction }}
                  />
                ))}
              </ul>
            ) : (
              <p>No instructions available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
