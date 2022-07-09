import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
  posts: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action) => {
        state.posts.push(action.payload);
      },
      prepare: (title, content, userId) => ({
        payload: {
          id: nanoid(),
          title,
          body: content,
          userId,
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
          },
        },
      }),
    },
    reactionAdded: {
      reducer: (state, action) => {
        const { postId, reaction } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        post.reactions[reaction] += 1;
      },
      prepare: (postId, reaction) => ({
        payload: { postId, reaction },
      }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
          };
          return post;
        });
        state.posts = loadedPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push({
          ...action.payload,
          id: nanoid(),
          userId: Number(action.payload.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
          },
        });
      });
  },
});
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return [...response.data];
  } catch (error) {
    return error.message;
  }
});

export const addNewPost = createAsyncThunk("posts/addNewPost", async (post) => {
  try {
    const response = await axios.post(POSTS_URL, post);
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const selectAllPosts = (state) => state.posts.posts;

export const getPostsStatus = (state) => state.posts.status;

export const getPostsError = (state) => state.posts.error;

export const selectPostById = (id) => (state) =>
  state.posts.posts.find((post) => post.id === id);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
