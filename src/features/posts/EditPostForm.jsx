import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import {
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
} from "./postsSlice";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector(selectPostById(postId));
  const { refetch } = useGetPostsQuery();

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);

  const [editPost, { isLoadingEditPost }] = useUpdatePostMutation();
  const [deletePost, { isLoadingDeletePost }] = useDeletePostMutation();

  const onTitleChanged = (e) => {
    setTitle(e.target.value);
  };

  const onContentChanged = (e) => {
    setContent(e.target.value);
  };

  const onEditPostClicked = async () => {
    if (canEdit) {
      try {
        await editPost({ title, body: content, postId }).unwrap();
        refetch();
        setTitle("");
        setContent("");
        navigate(`/post/${postId}`);
      } catch (error) {
        console.error("Failed to edit the post: ", error);
      }
    }
  };

  const onDeletePostClicked = async () => {
    try {
      await deletePost({ postId }).unwrap();
      setTitle("");
      setContent("");
      navigate("/");
    } catch (error) {
      console.error("Failed to edit the post: ", error);
    }
  };

  const canEdit =
    [title, content].every(Boolean) &&
    !isLoadingEditPost &&
    !isLoadingDeletePost;

  return (
    <section>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onEditPostClicked} disabled={!canEdit}>
          Save Post
        </button>
        <button type="button" onClick={() => navigate(`/post/${postId}`)}>
          Close Edit
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
