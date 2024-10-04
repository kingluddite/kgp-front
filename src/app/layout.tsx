import { ReactNode } from "react";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "My App",
  description: "A Next.js app with Bootstrap",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
