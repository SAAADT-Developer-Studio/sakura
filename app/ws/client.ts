import io, { Socket } from "socket.io-client";
import { getHostname } from "~/utils/getHostname";
import { ClientToServerEvents, ServerToClientEvents } from "~/ws/context";

export function connect(carpoolid: string) {
  const hostname = getHostname();
  return io(hostname, { extraHeaders: { carpoolid } }) as Socket<
    ServerToClientEvents,
    ClientToServerEvents
  >;
}
