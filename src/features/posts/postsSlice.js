import { nanoid, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return b.date.localeCompare(a.date);
  },
});

const initialState = postsAdapter.getInitialState();

const fixReponseData = (responseData) => {
  const newResponse = responseData.reduce((acc, curr) => {
    acc.push({ ...curr });
    return acc;
  }, []);

  let min = 1;
  const fixedResponseData = newResponse.map((post) => {
    if (!post?.date) {
      post.date = sub(new Date(), { minutes: (min += 1) }).toISOString();
    }
    if (!post?.reactions) {
      post.reactions = {
        thumbsUp: 0,
        wow: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      };
    }
    return post;
  });
  return fixedResponseData;
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        const loadedPosts = fixReponseData(responseData);
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        return [
          { type: "Post", id: "LIST" },
          ...result.ids.map((id) => ({ type: "Post", id })),
        ];
      },
    }),
    getPostsByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData) => {
        const loadedPosts = fixReponseData(responseData);
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        return [...result.ids.map((id) => ({ type: "Post", id }))];
      },
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          id: nanoid(),
          userId: Number(initialPost.userId),
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
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.postId}`,
        method: "PATCH",
        body: {
          title: initialPost.title,
          body: initialPost.body,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: Number(arg.postId) || arg.postId },
      ],
    }),
    deletePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
        body: { postId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: Number(arg.postId) || arg.postId },
      ],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: { reactions },
      }),
      onQueryStarted: async (
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              const post = draft.entities[postId];
              if (post) {
                post.reactions = reactions;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

export const selectPostsData = createSelector(
  [selectPostsResult],
  (postsResult) => postsResult.data
);

export const { selectAll: selectAllPosts, selectIds: selectPostIds } =
  postsAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);

export const selectPostById = (id) => (state) =>
  selectPostsData(state)?.entities[Number(id) || id];

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;
