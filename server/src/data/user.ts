import { User } from "@/types";

let users: User[] = [];

const getUser = (id: string) => users.find((user) => user.id === id);

const addUser = (user: User) => users.push(user);

const removeUser = (id: string) => {
  users = users.filter((user) => user.id !== id);
};

const getRoomMembers = (roomId: string) =>
  users
    .filter((user) => user.roomId === roomId)
    .map(({ id, username }) => ({
      id,
      username,
    }));
export { getUser, addUser, removeUser, getRoomMembers };
