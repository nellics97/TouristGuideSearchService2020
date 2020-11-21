import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/users/${auth.userId}`}>My profile</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/users" exact>
            All users
          </NavLink>
        </li>
      )}
      <li>
        <NavLink to="/events">All events</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/events/user/${auth.userId}`}>My events</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/events/new">New event</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/chat/5fb7e8a15513d04750b9adf8`}>PROBA</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
