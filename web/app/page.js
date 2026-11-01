import AirportSearch from "@/components/AirportSearch";

export default function Home() {

  return (

      <main>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Find any airport..
        </h1>

        <p className ="mt-1 text-slate-650"> Search with a cityname and choose your desired airport
        </p>

        <AirportSearch />

      </main>

  );
}