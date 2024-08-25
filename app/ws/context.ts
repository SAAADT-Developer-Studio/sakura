import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export interface ClientToServerEvents {
  selectSeat: (
    data: {
      carId: string;
      seat: number;
      participantId: string;
    },
    callback: (res: { status: "success" } | { status: "error"; message: string }) => void,
  ) => void;
  deselectSeat: (
    data: {
      carId: string;
      seat: number;
      participantId: string;
    },
    callback: (res: { status: "success" } | { status: "error"; message: string }) => void,
  ) => void;
  something: (msg: string) => void;
}
export interface ServerToClientEvents {
  connected: (message: string) => void;
  seatChange: (data: { seat: number; participant: unknown }) => void;
}

export type CustomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const wsContext = createContext<CustomSocket | undefined>(undefined);

export function useSocket() {
  const ws = useContext(wsContext);
  return ws;
}
