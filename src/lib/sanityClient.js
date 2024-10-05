import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Sanity project ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Sanity dataset name
  useCdn: true, // Set to `true` to use the CDN for faster responses
  apiVersion: "2021-08-31", // API version
});

export default client;
