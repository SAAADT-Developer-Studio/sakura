import { LoaderFunctionArgs } from "@remix-run/node";
import { useContext } from "react";

import { wsContext } from "~/ws/context";

export async function loader({ params }: LoaderFunctionArgs) {
  const carpoolId = params.carpoolid;
  const participantId = params.participantid;
  if (!carpoolId || !participantId) {
    throw new Response("bad", { status: 400 });
  }
  return null;
}

export default function CarPool() {
  const socket = useContext(wsContext);
  // TODO: implement a store for the carpool state

  const cars = [];
  return (
    <div>
      <button onClick={() => socket.emit("something", "ping")}>
        Send ping
      </button>
      {cars.map((car) => {
        return (
          <div>
            <div>seat1</div>
            <div>seat2</div>
            <div>seat3</div>
          </div>
        );
      })}
    </div>
  );
}
