import { Outlet, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { connect } from "~/ws/client";

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io-client";

import { wsContext } from "~/ws/context";

export default function CarpoolIdRoot() {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const params = useParams();
  const carpoolId = params.carpoolid;

  useEffect(() => {
    if (!carpoolId) return;
    const connection = connect(carpoolId);
    setSocket(connection);
    return () => {
      connection.close();
    };
  }, [carpoolId]);
  useEffect(() => {
    if (!socket) return;
    socket.on("event", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <wsContext.Provider value={socket}>
      <Outlet />
    </wsContext.Provider>
  );
}
