import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice";

const PostAuthor = ({ id }) => {
  const author = useSelector(selectUserById(id));

  return <span>by {author ? author.name : "Unknown author"}</span>;
};

export default PostAuthor;
