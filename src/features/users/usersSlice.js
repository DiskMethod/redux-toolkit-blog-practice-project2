import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: "0", name: "Dude Lebowski" },
  { id: "1", name: "Neil Young" },
  { id: "2", name: "Lucas Chagas" },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const selectAllUsers = (state) => state.users;

export const selectUserById = (id) => (state) =>
  state.users.find((user) => user.id === id);

export default usersSlice.reducer;
