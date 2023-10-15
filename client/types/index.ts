import { DrawProps } from "@/hooks/useDraw";
import type { IUser } from "@/store/userStore";

export interface Draw {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
}

type Point = { x: number; y: number };

export interface RoomJoinedData {
  user: IUser;
  roomId: string;
  members: IUser[];
}

export interface Notification {
  title: string;
  message: string;
}

export interface DrawOptions extends DrawProps {
  strokeColor: string;
  strokeWidth: number[];
  dashGap: number[];
}
