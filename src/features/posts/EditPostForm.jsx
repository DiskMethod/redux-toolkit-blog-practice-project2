import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectPostById } from "./postsSlice";
import { editPost } from "./postsSlice";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector(selectPostById(postId));

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [requestStatus, setRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const onTitleChanged = (e) => {
    setTitle(e.target.value);
  };

  const onContentChanged = (e) => {
    setContent(e.target.value);
  };

  const onEditPostClicked = async () => {
    if (canEdit) {
      try {
        setRequestStatus("pending");
        await dispatch(editPost({ title, body: content, postId })).unwrap();
        setTitle("");
        setContent("");
        navigate(`/post/${postId}`);
      } catch (error) {
        console.error("Failed to edit the post: ", error);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const canEdit = [title, content].every(Boolean) && requestStatus === "idle";

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
      </form>
    </section>
  );
};

export default EditPostForm;
