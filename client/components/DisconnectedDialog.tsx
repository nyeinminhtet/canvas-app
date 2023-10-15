"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/ui/dialog";
import { socket } from "@/lib/socket";

const DisconnectedDialog = () => {
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    socket.on("disconnected", () => {
      dialogTriggerRef.current?.click();
    });
    return () => {
      socket.off("disconnected");
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger ref={dialogTriggerRef} className="hidden"></DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>You were disconnected!</DialogTitle>
          <DialogDescription>
            You were out of the browser for a while and lost the connection.
            Please create a new room or join a room to draw again.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DisconnectedDialog;
