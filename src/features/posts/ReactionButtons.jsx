import React from "react";
import { useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

const ReactionButtons = ({ post }) => {
  const [reactionAdded] = useAddReactionMutation();

  const onReactionClicked = (reaction) => {
    const newReactions = {
      ...post.reactions,
      [reaction]: post.reactions[reaction] + 1,
    };
    reactionAdded({ postId: post.id, reactions: newReactions });
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
