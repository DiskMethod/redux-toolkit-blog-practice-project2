import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const navStyle = useCallback(({ isActive }) => {
    return {
      color: isActive ? "#fc0876" : "",
      textDecoration: isActive ? "underline" : "none",
    };
  }, []);

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
        </ul>
      </nav>
    </header>
  );
};

export default Header;
