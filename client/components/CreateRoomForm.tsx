"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { useToast } from "./ui/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/ui/form";
import { Input } from "./ui/ui/input";
import { Button } from "./ui/ui/button";
import { createRoomSchema } from "@/lib/validations/CreateRoomScehma";
import { zodResolver } from "@hookform/resolvers/zod";
import CopyButton from "./CopyButton";
import { socket } from "@/lib/socket";
import { RoomJoinedData } from "@/types";
import { useUserStore } from "@/store/userStore";
import { useMembersStore } from "@/store/membersStore";

interface Props {
  roomId: string;
}

type CreatRoomForm = z.infer<typeof createRoomSchema>;

const CreateRoomForm = ({ roomId }: Props) => {
  const [loading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const setUser = useUserStore((state) => state.setUser);
  const setMember = useMembersStore((state) => state.setMembers);

  const form = useForm<CreatRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = ({ username }: CreatRoomForm) => {
    setIsLoading(true);
    socket.emit("create-room", { roomId, username });
  };

  useEffect(() => {
    socket.on("room-joined", ({ user, roomId, members }: RoomJoinedData) => {
      setUser(user);
      setMember(members);
      router.replace(`/${roomId}`);
    });

    function handleErrorMessage({ message }: { message: string }) {
      toast({
        title: "Failed to join room!",
        description: message,
      });
    }

    socket.on("room-not-found", handleErrorMessage);
    socket.on("Invalid-data", handleErrorMessage);

    return () => {
      socket.off("room-joinde"), socket.off("room-not-found");
      socket.off("invalid-data", handleErrorMessage);
    };
  }, [router, setMember, setUser, toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" text-foreground">Username</FormLabel>
              <FormControl>
                <Input placeholder="jey" {...field} />
              </FormControl>

              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Room ID</p>

          <div
            className="flex h-10 w-full items-center
           justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground"
          >
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create a Room"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateRoomForm;
