const undoPoints: Record<string, string[]> = {};

const addUndoPoint = (roomId: string, undoPoint: string) => {
  const room = undoPoints[roomId];
  if (room) {
    return room.push(undoPoint);
  }
  undoPoints[roomId] = [undoPoint];
};

const getLastUndoPoint = (roomId: string) => {
  const roomUndoPoint = undoPoints[roomId];
  if (!roomUndoPoint) return;
  return roomUndoPoint[roomUndoPoint.length - 1];
};

const deleteLastUndoPoint = (roomId: string) => {
  const room = undoPoints[roomId];
  if (!room) return;
  undoPoints[roomId].pop();
};

export { addUndoPoint, getLastUndoPoint, deleteLastUndoPoint };
