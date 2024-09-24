import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startLat = searchParams.get("startLat");
  const startLng = searchParams.get("startLng");
  const endLat = searchParams.get("endLat");
  const endLng = searchParams.get("endLng");

  // Check if all parameters are provided
  if (!startLat || !startLng || !endLat || !endLng) {
    return NextResponse.json(
      { error: "Missing query parameters" },
      { status: 400 },
    );
  }

  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleApiKey) {
    return NextResponse.json(
      { error: "Google Maps API key is missing" },
      { status: 500 },
    );
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&mode=walking&key=${googleApiKey}`,
    );

    if (response.data.status !== "OK") {
      return NextResponse.json(
        { error: response.data.error_message },
        { status: 500 },
      );
    }

    // Return the polyline points from the API
    return NextResponse.json({
      polyline: response.data.routes[0]?.overview_polyline?.points,
    });
  } catch {
    return NextResponse.json(
      { error: "Error fetching directions" },
      { status: 500 },
    );
  }
}
