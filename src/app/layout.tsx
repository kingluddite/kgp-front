import { ReactNode } from "react";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
