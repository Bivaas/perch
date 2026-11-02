import Link from "next/link";

export default function NotFound() {

    return (

        <main className = "py-16 text-center">

            <p className="text-5xl font-bold">404!</p>

            <h1 className="mt-6 text-xl font-semibold">No pages Found!</h1>

            <p className="mt-2">

                No airport or page found. Verify ICAO code or search with cityname

            </p>

            <Link href="/" className="mt-10 inline-block rounded-lg bg-slate-400 px-4 py-2 text-white">Search airports</Link>

        </main>
    );
}