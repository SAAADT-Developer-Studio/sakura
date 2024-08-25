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
    registerDeseelectSeatHandler(socket, io);
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
      io.to(carpoolId).emit("seatChange", { participant: {}, seat });
    } catch (err) {
      let message = "Something went wrong";
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          message = "Seat is taken";
        }
      }
      callback({ status: "error", message });
    }
  });
}

function registerDeseelectSeatHandler(socket: CustomSocket, io: CustomSocketServer) {
  socket.on("deselectSeat", async (data, callback) => {
    console.log("deselectSeat", data);
    const { carId, seat } = data;
    const carpoolId = socket.data.carpoolId;

    try {
      await prisma.carParticipant.delete({
        where: { carId_seat: { carId, seat } },
      });
      console.log("created");
      callback({ status: "success" });
      io.to(carpoolId).emit("seatChange", { participant: {}, seat });
    } catch (err) {
      const message = "Something went wrong";
      callback({ status: "error", message });
    }
  });
}
