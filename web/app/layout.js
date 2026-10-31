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

                <Link href="/">Search</Link> -{" "}
                <Link href="/airport/VNKT">Kathmandu</Link> -{" "}
                <Link href="/airport/VNVT">Biratnagar</Link> -{" "}

            </nav>

            {children}

        </body>

    </html>
  );
}
