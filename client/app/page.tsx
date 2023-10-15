import { nanoid } from "nanoid";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/ui/card";
import CreateRoomForm from "@/components/CreateRoomForm";
import JoinRoomButton from "@/components/JoinRoomButton";
import ThemeMenuButton from "@/components/ThemeMenuButton";

// type DrawLine = {
//   prevPoint: Point | null;
//   currentPoint: Point;
//   color: "string";
// };

// export default function Home() {
//   const [color, setColor] = useState("#000");

//   const { canvasRef, onMouseDown, clear } = useDraw(createLine);

//   function createLine({ prevPoint, currentPoint, ctx }: Draw) {
//     socket.emit("draw-line", { prevPoint, currentPoint, color });
//     drawLine({ prevPoint, currentPoint, ctx, color });
//   }

//   useEffect(() => {
//     const ctx = canvasRef.current?.getContext("2d");

//     socket.emit("client-ready");

//     socket.on("get-canvas-state", () => {
//       if (!canvasRef.current?.toDataURL()) return;
//       socket.emit("canvas-state", canvasRef.current.toDataURL());
//     });

//     socket.on("canvas-state-from-server", (state: string) => {
//       const img = new Image();
//       img.src = state;
//       img.onload = () => {
//         ctx?.drawImage(img, 0, 0);
//       };
//     });

//     socket.on("draw-line", ({ prevPoint, currentPoint, color }: DrawLine) => {
//       if (!ctx) return;
//       drawLine({ prevPoint, currentPoint, ctx, color });
//     });

//     socket.on("clear", clear);

//     return () => {
//       socket.off("get-canvas-state");
//       socket.off("canvas-state-from-server");
//       socket.off("draw-line");
//       socket.off("clear");
//     };
//   }, [canvasRef, clear]);

//   return (
//     <div className=" w-screen bg-white h-screen flex gap-5  justify-center items-center">
//       <div className="flex flex-col gap-2">
//         <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
//         <button
//           type="button"
//           className="p-2 rounded-md border border-black text-black hover:opacity-70"
//           onClick={() => socket.emit("clear")}
//         >
//           Clear
//         </button>
//       </div>
//       <canvas
//         onMouseDown={onMouseDown}
//         ref={canvasRef}
//         width={500}
//         height={500}
//         className="border border-black rounded-md"
//       />
//     </div>
//   );
// }
export default function Home() {
  const roomId = nanoid();

  return (
    <div className=" h-screen  flex flex-col items-center justify-center">
      <ThemeMenuButton className="fixed right-[5vw] top-5 flex-1 md:right-5" />

      <Card className="w-[90vw] max-w-[400px]">
        <CardHeader className="flex flex-col justify-center items-center">
          <CardTitle className="text-2xl">Canvas Drawing</CardTitle>
          <CardDescription className="text-center">
            Draw on the same canvas with your friends in real-time.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <CreateRoomForm roomId={roomId} />

          <div className="flex items-center space-x-2 ">
            <div className="w-full h-[1px] bg-slate-900" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="w-full h-[1px] bg-slate-900" />
          </div>

          <JoinRoomButton />
        </CardContent>
      </Card>
    </div>
  );
}
