import React from "react";

import DisconnectedDialog from "@/components/DisconnectedDialog";
import DrawingCanvas from "@/components/DrawingCanvas";

const RoomPage = () => {
  return (
    <>
      <DisconnectedDialog />
      <DrawingCanvas />
    </>
  );
};

export default RoomPage;
