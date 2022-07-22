import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({ id }) => {
  const author = useSelector(selectUserById(id));

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${id}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};

export default PostAuthor;
