import React from "react";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import { useParams, Link, Outlet } from "react-router-dom";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

const SinglePostPage = () => {
  const { postId } = useParams();
  const post = useSelector(selectPostById(postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <>
      <article>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <p className="postCredit">
          <Link to="edit">Edit Post</Link>
          <PostAuthor id={post.userId} />
          <TimeAgo timestamp={post.date} />
        </p>
        <ReactionButtons post={post} />
      </article>
      <Outlet />
    </>
  );
};

export default SinglePostPage;
