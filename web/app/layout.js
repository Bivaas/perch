import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Perch",
  description: "read airport traffic",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      
        <body className="min-h-full flex flex-col">

            <nav>

                <Link href="/">Flights</Link> -{" "}
                <link href="/map">Live map</link>
                <Link href="/stats">Stats</Link>

            </nav>

            {children}

        </body>

    </html>
  );
}
