import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { increaseCount, getCount } from "../features/posts/postsSlice";

const Header = () => {
  const navStyle = useCallback(({ isActive }) => {
    return {
      color: isActive ? "#fc0876" : "",
      textDecoration: isActive ? "underline" : "none",
    };
  }, []);

  const dispatch = useDispatch();
  const count = useSelector(getCount);

  return (
    <header className="header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <NavLink style={navStyle} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink style={navStyle} to="post">
              Post
            </NavLink>
          </li>
          <li>
            <NavLink style={navStyle} to="user">
              User
            </NavLink>
          </li>
        </ul>
        <button onClick={() => dispatch(increaseCount())}>{count}</button>
      </nav>
    </header>
  );
};

export default Header;
