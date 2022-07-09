import React from "react";
import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();

  const onReactionClicked = (reaction) => {
    dispatch(reactionAdded(post.id, reaction));
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={onReactionClicked.bind(null, name)}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
