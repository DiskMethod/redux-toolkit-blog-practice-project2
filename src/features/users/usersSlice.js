import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(USERS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUsersStatus = (state) => state.users.status;

export const getUsersError = (state) => state.users.error;

export const selectAllUsers = (state) => state.users.users;

export const selectUserById = (id) => (state) =>
  state.users.users.find((user) => user.id === (Number(id) || id));

export default usersSlice.reducer;
