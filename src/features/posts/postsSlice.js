import {
  createSlice,
  createAsyncThunk,
  nanoid,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  count: 0,
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded: {
      reducer: (state, action) => {
        const { postId: id, reaction } = action.payload;
        const post = state.entities[id];
        post.reactions[reaction] += 1;
      },
      prepare: (postId, reaction) => ({
        payload: { postId, reaction },
      }),
    },
    increaseCount: (state, action) => {
      state.count += 1;
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
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, {
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
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const { postId: id, body, title } = action.payload;
        const post = state.entities[id];
        if (!post) {
          console.error("Post not found in client cache");
        } else {
          post.body = body;
          post.title = title;
          post.date = new Date().toISOString();
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const { postId: id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(POSTS_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (post, { rejectWithValue }) => {
    try {
      const response = await axios.post(POSTS_URL, post);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async (newPost, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${POSTS_URL}/${newPost.postId}`,
        newPost
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await axios.delete(`${POSTS_URL}/${postId}`);
      return { postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const selectAllPosts = (state) => state.posts.posts;

export const getPostsStatus = (state) => state.posts.status;

export const getPostsError = (state) => state.posts.error;

export const getCount = (state) => state.posts.count;

export const { selectAll: selectAllPosts, selectIds: selectPostIds } =
  postsAdapter.getSelectors((state) => state.posts);

export const selectPostById = (id) => (state) => state.posts.entities[id];

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_, userId) => userId],
  (posts, userId) =>
    posts.filter((post) => post.userId === (Number(userId) || userId))
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
