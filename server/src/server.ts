import express from "express";
import http from "http";
import cors from "cors";
import { ZodError } from "zod";
import { Server, Socket } from "socket.io";

import { DrawOptions, JoinRoomData } from "./types";
import { joinRoomSchema } from "./libs/RoomValidation";
import { addUser, getRoomMembers, getUser, removeUser } from "./data/user";
import {
  addUndoPoint,
  deleteLastUndoPoint,
  getLastUndoPoint,
} from "./data/undoPoints";

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server);

function isRoomCreated(roomId: string) {
  const rooms = [...io.sockets.adapter.rooms];
  return rooms?.some((room) => room[0] === roomId);
}

function validateJoinRoomData(socket: Socket, joinRoomData: JoinRoomData) {
  try {
    return joinRoomSchema.parse(joinRoomData);
  } catch (error) {
    if (error instanceof ZodError) {
      socket.emit("invalid-data", {
        message:
          "The entities you provided are not correct and cannot be processed.",
      });
    }
  }
}

function joinRoom(socket: Socket, roomId: string, username: string) {
  socket.join(roomId);
  const user = {
    id: socket.id,
    username: username,
  };

  addUser({ ...user, roomId });
  const members = getRoomMembers(roomId);

  socket.emit("room-joined", { user, roomId, members });
  socket.to(roomId).emit("update-members", members);
  socket.to(roomId).emit("send-notification", {
    title: "New member arrived!",
    message: `${username} joined the party.`,
  });
}

function leaveRoom(socket: Socket) {
  const user = getUser(socket.id);
  if (!user) return;
  const { username, roomId } = user;

  removeUser(socket.id);
  const members = getRoomMembers(roomId);

  socket.to(roomId).emit("update-members", members);
  socket.to(roomId).emit("send-notification", {
    title: "Member departure!",
    message: `${username} left the party.`,
  });
  socket.leave(roomId);
}

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("create-room", (joinRoomData: JoinRoomData) => {
    const validate = validateJoinRoomData(socket, joinRoomData);

    if (!validate) return;
    const { username, roomId } = validate;
    joinRoom(socket, roomId, username);
  });

  socket.on("join-room", (joinRoomData: JoinRoomData) => {
    const validataData = validateJoinRoomData(socket, joinRoomData);
    if (!validataData) return;

    const { username, roomId } = validataData;
    if (isRoomCreated(roomId)) {
      return joinRoom(socket, roomId, username);
    }

    socket.emit("room-not-found", {
      message:
        "Oops! The Room ID you entered doesn't exist or hasn't been created yet.",
    });
  });

  socket.on("client-ready", (roomId: string) => {
    const members = getRoomMembers(roomId);

    if (members.length === 1) return socket.emit("client-load");

    const adminMember = members[0];
    if (!adminMember) return;

    socket.to(adminMember.id).emit("get-canvas-state");
  });

  socket.on(
    "send-canvas-state",
    ({ canvasState, roomId }: { canvasState: string; roomId: string }) => {
      const members = getRoomMembers(roomId);
      const lastMember = members[members.length - 1];

      if (!lastMember) return;

      socket.to(lastMember.id).emit("canvas-state-from-server", canvasState);
    }
  );

  socket.on(
    "draw",
    ({ drawOptions, roomId }: { drawOptions: DrawOptions; roomId: string }) => {
      socket.to(roomId).emit("update-canvas-state", drawOptions);
    }
  );

  socket.on("clear-canvas", (roomId: string) => {
    socket.to(roomId).emit("clear-canvas");
  });

  socket.on(
    "undo",
    ({ canvasState, roomId }: { canvasState: string; roomId: string }) => {
      socket.to(roomId).emit("undo-canvas", canvasState);
    }
  );

  socket.on("get-last-undo-point", (roomId: string) => {
    const lastUndoPoint = getLastUndoPoint(roomId);
    socket.emit("last-undo-point-from-server", lastUndoPoint);
  });

  socket.on(
    "add-undo-point",
    ({ roomId, undoPoint }: { roomId: string; undoPoint: string }) => {
      addUndoPoint(roomId, undoPoint);
    }
  );

  socket.on("delete-last-undo-point", (roomId: string) => {
    deleteLastUndoPoint(roomId);
  });

  socket.on("leave-room", () => {
    leaveRoom(socket);
  });

  socket.on("disconnect", () => {
    socket.emit("disconnected");
    leaveRoom(socket);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
