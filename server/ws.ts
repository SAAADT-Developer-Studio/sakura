import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "~/ws/context";
import { prisma } from "~/db.server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface SocketData {
  carpoolId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InterServerEvents {}

export function registerSocketsServer(httpServer: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
  );

  io.on("connection", (socket) => {
    const carpoolId = socket.handshake.headers.carpoolid;
    if (typeof carpoolId === "string") {
      socket.data.carpoolId = carpoolId;
      socket.join(carpoolId);
    } else {
      throw new Error("Missing carpoolid");
    }

    console.log(socket.id, "connected");
    socket.emit("connected", "connected!");

    registerSelectSeatHandler(socket, io);
  });
}

type CustomSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
type CustomSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

function registerSelectSeatHandler(socket: CustomSocket, io: CustomSocketServer) {
  socket.on("selectSeat", async (data, callback) => {
    console.log("selectSeat", data);
    const { participantId, carId, seat } = data;
    const carpoolId = socket.data.carpoolId;

    try {
      await prisma.carParticipant.create({
        data: { seat, participantId, carId },
      });
      console.log("created");
      callback({ status: "success" });
      io.to(carpoolId).emit("seatSelected", { participant: {}, seat });
    } catch (err) {
      let message = "Something went wrong";
      if (err instanceof PrismaClientKnownRequestError) {
        console.log("prisma error", err);
        if (err.code === "P2002") {
          message = "Seat is taken";
        }
      }
      callback({ status: "error", message });
    }
  });
}
