import React from "react";
import logo from "./logo-mon.png";

const Nav = () => {
  return (
    <div className="nav-bar">
      <div className="logo-container">
        <img src={logo} alt="logo" />
        <div className="logo">
          Market<span>Monitor</span>
        </div>
      </div>
      <div className="links">
        <a href="https://codepen.io/rzencoder/" aria-label="Link to Codepen">
          <i className="fa fa-codepen" aria-hidden="true"></i>
        </a>
        <a
          href="https://github.com/rzencoder/Market-Monitor"
          aria-label="Link to Github"
        >
          <i className="fa fa-github" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  );
};

export default Nav;
