import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import { useSocket } from "~/ws/context";
import { twMerge } from "tailwind-merge";
import { CarWrapper } from "~/components/car";

import { prisma } from "~/db.server";
import { getHostname } from "~/utils/getHostname";

export async function loader({ params }: LoaderFunctionArgs) {
  const carpoolId = params.carpoolid;

  const carPool = await prisma.carPool.findUnique({
    where: { id: carpoolId },
    include: {
      organiser: true,
      Cars: { include: { CarParticipant: { include: { participant: true } } } },
    },
  });

  return json({ carPool });
}

export default function Carpool() {
  const { carPool } = useLoaderData<typeof loader>();
  const [link, setLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!carPool) return;
    setLink(`${getHostname()}/carpool/${carPool.id}/join`);
  }, [carPool]);

  if (!carPool) {
    return (
      <div>
        <h1>Car Pool not found</h1>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <div className="flex h-full w-full flex-col place-items-center bg-baseGreen">
      <div className="flex h-12 w-full justify-center">
        <h1 className="flex flex-col place-content-center justify-center text-center text-4xl">
          Sakura
        </h1>
      </div>
      <h1>Invite your friends to {carPool.name}</h1>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "10%", width: "10%" }}
        value={link}
        viewBox={`0 0 256 256`}
      />
      <button onClick={copyToClipboard}>{copied ? "Copied" : "Copy link"}</button>
      <div className="mt-5 flex flex-wrap gap-2">
        {carPool.Cars.map((car, i) => {
          return <OrganiserCar {...car} participants={car.CarParticipant} key={car.name + i} />;
        })}
      </div>
    </div>
  );
}

function OrganiserCar({
  id,
  seats,
  name,
  participants,
}: {
  id: string;
  seats: number;
  name: string;
  participants: { seat: number; participant: { name: string; id: string } }[];
}) {
  const socket = useSocket();
  const revalidator = useRevalidator();

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

  return (
    <CarWrapper name={name}>
      <>
        {Array.from({ length: seats }).map((_, i) => {
          const participant = participants.find((p) => p.seat === i);
          const isTaken = !!participant;
          return (
            <button
              className={twMerge(
                "rounded p-2",
                "bg-blue-300 hover:bg-blue-400",
                isTaken && "bg-red-300 hover:bg-red-400",
              )}
              key={i}
            >
              {participant ? participant.participant.name : `Seat ${i}`}
            </button>
          );
        })}
      </>
    </CarWrapper>
  );
}
