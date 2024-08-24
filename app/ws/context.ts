import { createContext } from "react";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io-client";

export const wsContext = createContext<
  Socket<DefaultEventsMap, DefaultEventsMap> | undefined
>(undefined);
