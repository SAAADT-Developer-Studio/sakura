import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io-client";

import { connect } from "~/ws/client";
import { wsContext } from "~/ws/context";

export default function CarpoolRoot() {
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  useEffect(() => {
    const connection = connect();
    setSocket(connection);
    return () => {
      connection.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("event", (data) => {
      console.log(data);
    });
  }, [socket]);
  return (
    <main className="flex justify-center pt-10 h-full">
      <wsContext.Provider value={socket}>
        <Outlet />
      </wsContext.Provider>
    </main>
  );
}
