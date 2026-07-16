import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "./components/topbar";
import Navbar from "./components/navbar";
import Megabar from "./components/megabar";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "A2V Prints",
  description: "A2V Prints",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700;800&family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Topbar />
        <Navbar />
        <Megabar />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

