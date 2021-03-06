import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";

const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");

  const navigate = useNavigate();
  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const users = useSelector(selectAllUsers);

  const onTitleChanged = (e) => {
    setTitle(e.target.value);
  };

  const onContentChanged = (e) => {
    setContent(e.target.value);
  };

  const onAuthorChanged = (e) => {
    setAuthorId(e.target.value);
  };

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, body: content, userId: authorId }).unwrap();
        setTitle("");
        setContent("");
        setAuthorId("");
        navigate("/");
      } catch (error) {
        console.error("Failed to save the post: ", error);
      }
    }
  };

  const canSave = [title, content, authorId].every(Boolean) && !isLoading;

  const options = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="author">Select Author</label>
        <select
          name="author"
          id="author"
          value={authorId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {options}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
