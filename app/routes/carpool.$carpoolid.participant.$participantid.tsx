import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { prisma } from "~/db.server";
import { CarWrapper } from "~/components/car";

import { useSocket } from "~/ws/context";
import { twMerge } from "tailwind-merge";

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
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: { CarParticipant: true },
  });

  if (!carPool || !participant) {
    throw new Response("no carpool or participant");
  }
  return json({ carPool, participant });
}

export default function CarPool() {
  const { carPool, participant } = useLoaderData<typeof loader>();
  const participantId = participant.id;
  const currentSeat = participant.CarParticipant[0];
  const socket = useSocket();

  return (
    <div className="flex h-full w-full flex-col place-items-center bg-baseGreen">
      <div>
        <h1 className="text-2xl">Carpool: {carPool.name}</h1>
        <h3>Organiser: {carPool.organiser.email} </h3>
        <h3>You: {participant.name} </h3>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {carPool.Cars.map((car, i) => {
          return (
            <ParticipantCar
              {...car}
              participants={car.CarParticipant}
              participantId={participantId}
              key={car.name + i}
              currentSeat={currentSeat}
            />
          );
        })}
      </div>
    </div>
  );
}

function ParticipantCar({
  id,
  seats,
  name,
  participants,
  participantId,
  currentSeat,
}: {
  id: string;
  seats: number;
  name: string;
  participants: { seat: number; participant: { name: string; id: string } }[];
  participantId: string;
  currentSeat?: { seat: number; carId: string };
}) {
  const socket = useSocket();
  const revalidator = useRevalidator();
  const selectedSeatNumber = currentSeat && currentSeat.carId === id ? currentSeat.seat : null;

  useEffect(() => {
    if (!socket) return;
    const onSeatChanged = ({ seat }: { seat: number }) => {
      console.log("seatChange", seat);
      revalidator.revalidate();
    };
    socket.on("seatChange", onSeatChanged);

    return () => {
      socket.off("seatChange", onSeatChanged);
    };
  }, [socket, revalidator]);

  const handleSeatClick = (seatNumber: number, isTaken: boolean) => {
    if (isTaken) {
      if (seatNumber === selectedSeatNumber) {
        socket?.emit("deselectSeat", { carId: id, seat: seatNumber, participantId }, (response) => {
          if (response.status === "success") {
            toast.success(`Reservation on seat ${seatNumber} in ${name} was removed.`);
          } else {
            toast.error(response.message);
          }
          revalidator.revalidate();
        });
      }
      return;
    }
    if (currentSeat !== undefined) {
      socket?.emit(
        "switchSeat",
        {
          from: currentSeat,
          to: { carId: id, seat: seatNumber },
          participantId,
        },
        (response) => {
          if (response.status === "success") {
            toast.success(`Switched seat from ${selectedSeatNumber} to ${seatNumber}.`);
          } else {
            toast.error(response.message);
          }
        },
      );
      return;
    }

    if (currentSeat) return;

    socket?.emit("selectSeat", { carId: id, seat: seatNumber, participantId }, (response) => {
      if (response.status === "success") {
        toast.success(`Seat ${seatNumber} in ${name} was selected.`);
      } else {
        toast.error(response.message);
      }
      revalidator.revalidate();
    });
  };

  return (
    <CarWrapper name={name}>
      <>
        {Array.from({ length: seats }).map((_, i) => {
          const participant = participants.find((p) => p.seat === i);
          const isCurrentUser = participant?.participant.id === participantId;
          const isTaken = !!participant;
          return (
            <button
              className={twMerge(
                "rounded p-2",
                "bg-blue-300 hover:bg-blue-400",
                isTaken && "bg-red-300 hover:bg-red-400",
                isCurrentUser && "bg-green-300 hover:bg-green-400",
              )}
              key={i}
              onClick={() => handleSeatClick(i, isTaken)}
            >
              {participant ? participant.participant.name : `Seat ${i}`}
            </button>
          );
        })}
      </>
    </CarWrapper>
  );
}
