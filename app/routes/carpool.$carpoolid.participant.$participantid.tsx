import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { toast } from "sonner";
import { prisma } from "~/db.server";

import { wsContext } from "~/ws/context";

export async function loader({ params }: LoaderFunctionArgs) {
  const carpoolId = params.carpoolid;
  const participantId = params.participantid;
  if (!carpoolId || !participantId) {
    throw new Response("No carpoolId or participantId in url", { status: 400 });
  }

  const carPool = await prisma.carPool.findUnique({
    where: { id: carpoolId },
    include: {
      organiser: true,
      Cars: true,
    },
  });
  if (!carPool) {
    throw new Response("not carpool");
  }
  return json(carPool);
}

export default function CarPool() {
  const carPool = useLoaderData<typeof loader>();
  const socket = useContext(wsContext);
  console.log(carPool);
  // TODO: implement a store for the carpool state

  return (
    <div>
      <button onClick={() => socket?.emit("something", "ping")}>
        Send ping
      </button>
      <div>
        <h1 className="text-2xl">Carpool: {carPool.name}</h1>
        <h3>Organiser: {carPool.organiser.email} </h3>
      </div>
      <div className="flex flex-wrap gap-2 mt-5">
        {carPool.Cars.map((car, i) => {
          return <Car {...car} key={car.name + i}></Car>;
        })}
      </div>
    </div>
  );
}

function Car({ seats, name }: { seats: number; name: string }) {
  const handleSeatClick = (seatNumber: number) => {
    console.log("seat click", seatNumber);
    toast.success(`Seat ${seatNumber} in ${name} was selected.`);
  };

  return (
    <div className="bg-blue-100 shadow rounded">
      <div className="px-3 pt-1">{name}</div>
      <div className="grid grid-cols-2 p-3 gap-1">
        {Array.from({ length: seats }).map((_, i) => {
          return (
            <button
              className="bg-blue-300 rounded p-2 hover:bg-blue-400"
              key={i}
              onClick={() => handleSeatClick(i)}
            >
              {" "}
              seat {i}{" "}
            </button>
          );
        })}
      </div>
    </div>
  );
}
