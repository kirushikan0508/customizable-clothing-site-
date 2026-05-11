import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLAVOUR | Premium Fashion for Boys & Girls",
  description: "Discover premium fashion for boys and girls. Shop shirts, t-shirts, dresses, pants, and trousers at FLAVOUR - where style meets comfort.",
  keywords: "fashion, clothing, boys, girls, shirts, dresses, pants, ecommerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#5C4033",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 20px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
