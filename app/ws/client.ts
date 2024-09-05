import io, { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "~/ws/context";

export function connect(carpoolid: string) {
  return io({ extraHeaders: { carpoolid } }) as Socket<ServerToClientEvents, ClientToServerEvents>;
}
