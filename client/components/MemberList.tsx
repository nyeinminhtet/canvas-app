"use client";

import { useEffect } from "react";

import type { Notification } from "@/types";
import { socket } from "@/lib/socket";
import { useMembersStore } from "@/store/membersStore";
import { ScrollArea } from "./ui/ui/scroll-area";
import { useToast } from "./ui/ui/use-toast";

export default function MemberList() {
  const { toast } = useToast();

  const [members, setMembers] = useMembersStore((state) => [
    state.members,
    state.setMembers,
  ]);

  console.log(members);

  useEffect(() => {
    socket.on("update-members", (members) => {
      setMembers(members);
    });

    socket.on("send-notification", ({ title, message }: Notification) => {
      toast({
        title,
        description: message,
      });
    });

    return () => {
      socket.off("update-members");
      socket.off("send-notification");
    };
  }, [toast, setMembers]);

  return (
    <div className="my-6 select-none">
      <h2 className="pb-2.5 font-medium">Members</h2>

      <ScrollArea className="h-48">
        <ul className="flex flex-col gap-1 rounded-md px-1">
          {members.map(({ id, username }) => (
            <li key={id}>{username}</li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
