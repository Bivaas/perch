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
  description: "see live traffic, Airport METAR and flight history",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      
        <body className="min-h-full flex flex-col">

            {/* top navbar */}
            <header className= "border-b border-slate-200 bg-white">

              <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">

                <Link href="/" className="text-2xl font-bold text-sky-600" >
                  Perch
                </Link>

                <div className="flex gap-4 text-sm">

                  <Link href="/" className="hover:text-sky-600">
                  
                    Search
                  </Link>

                  <Link href="/airport/VNKT" className="hover:text-sky-600">
                  
                    Kathmandu
                  </Link>

                  <Link href="/airport/OMDB" className="hover:text-sky-600" >
                  
                    Dubai
                  </Link>

                </div>

              </nav>

            </header>

            {/* page */}
            <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">

              {children}
            </div>

        </body>

    </html>
  );
}
