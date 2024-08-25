import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { prisma } from "~/db.server";

import { useSocket } from "~/ws/context";

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
      Cars: { include: { CarParticipant: { include: { participant: true } } } },
    },
  });

  if (!carPool) {
    throw new Response("not carpool");
  }
  return json({ carPool, participantId });
}

export default function CarPool() {
  const { carPool, participantId } = useLoaderData<typeof loader>();
  const socket = useSocket();
  console.log(carPool);
  // TODO: implement a store for the carpool state

  return (
    <div>
      <button onClick={() => socket?.emit("something", "ping")}>Send ping</button>
      <div>
        <h1 className="text-2xl">Carpool: {carPool.name}</h1>
        <h3>Organiser: {carPool.organiser.email} </h3>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {carPool.Cars.map((car, i) => {
          return (
            <Car
              {...car}
              participants={car.CarParticipant}
              participantId={participantId}
              key={car.name + i}
            />
          );
        })}
      </div>
    </div>
  );
}

function Car({
  id,
  seats,
  name,
  participants,
  participantId,
}: {
  id: string;
  seats: number;
  name: string;
  participants: { seat: number; participant: { name: string } }[];
  participantId: string;
}) {
  const socket = useSocket();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (!socket) return;
    const onSeatSelected = ({ seat }: { seat: number }) => {
      console.log("seatSelected", seat);
      revalidator.revalidate();
    };
    socket.on("seatSelected", onSeatSelected);

    return () => {
      socket.off("seatSelected", onSeatSelected);
    };
  }, [socket, revalidator]);

  const handleSeatClick = (seatNumber: number, isTaken: boolean) => {
    console.log("seat click", seatNumber, socket);
    if (isTaken) {
      return;
    }
    socket?.emit("selectSeat", { carId: id, seat: seatNumber, participantId }, (response) => {
      console.log({ response });
      if (response.status === "success") {
        toast.success(`Seat ${seatNumber} in ${name} was selected.`);
        revalidator.revalidate();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="rounded bg-blue-100 shadow">
      <div className="px-3 pt-1">{name}</div>
      <div className="grid grid-cols-2 gap-1 p-3">
        {Array.from({ length: seats }).map((_, i) => {
          const participant = participants.find((p) => p.seat === i);
          const isTaken = !!participant;
          return (
            <button
              className={
                "rounded p-2 " + (isTaken ? "bg-red-300" : "bg-blue-300 hover:bg-blue-400")
              }
              key={i}
              onClick={() => handleSeatClick(i, isTaken)}
            >
              {participant ? participant.participant.name : `Seat ${i}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
