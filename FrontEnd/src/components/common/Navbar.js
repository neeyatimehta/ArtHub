import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../../helpers/auth";
import { decoded, token } from "../../helpers/token";
import Logout from "../../pages/Logout";

const Navbar = () => {
  const [user, setUser] = useState(false);

  const [isLoggedIn, setLoggedIn] = useState(() => {
    // Initialize state based on the presence of a token in localStorage
    return localStorage.getItem("token") !== null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn ? setUser(true) : setUser(false);
  }, [isLoggedIn]);

  return (
    <>
      <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container-fluid">
          <a class="navbar-brand fw-normal" href="/">
            Art Gallery Auction
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="collapse navbar-collapse justify-content-end"
            id="navbarNavAltMarkup"
          >
            <div class="navbar-nav ">
              <li className="nav-item">
              <NavLink to="/" activeClassName="selected" className={"nav-link"}>
                Home
              </NavLink>
              </li>
              <li className="nav-item">
              <NavLink to="/browse-arts" className={"nav-link"}>
                Browse Arts
              </NavLink>
              </li>

              {user && (
                <>
                  <li class="nav-item dropdown ">
                    <a
                      class="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Category
                    </a>
                    <ul class="dropdown-menu fw-9" aria-labelledby="navbarDropdown">
                      <li className="">
                        <NavLink className={"dropdown-item"} to="/category">
                          View All Category
                        </NavLink>
                      </li>
                      <li className="">
                        <NavLink
                          className={"dropdown-item"}
                          to="/category/create"
                        >
                          Create New Category
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li class="nav-item dropdown">
                    <a
                      class="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      My Arts
                    </a>
                    <ul class="dropdown-menu  fw-9" aria-labelledby="navbarDropdown">
                      <li className="">
                        <NavLink className={"dropdown-item"} to="/arts/view">
                          View My Arts
                        </NavLink>
                      </li>
                      <li className="">
                        <NavLink className={"dropdown-item"} to="/arts/create">
                          Upload New Art
                        </NavLink>
                      </li>

                      <li className="">
                        <NavLink to="/bid-details" className={" dropdown-item"}>
                          Bidding Details
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              {user ? (
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {decoded?.firstName}
                  </a>
                  <ul class="dropdown-menu fw-9" aria-labelledby="navbarDropdown">
                  <li className="">
                      <NavLink
                        className={"dropdown-item"}
                        to="/user/view"
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li className="">
                      <NavLink
                        className={"dropdown-item"}
                        to="/user/preferences"
                      >
                        Preferences
                      </NavLink>
                    </li>
                    <li>
                      <Logout />
                    </li>
                  </ul>
                </li>
              ) : (
                <NavLink to="/login" className={"nav-link"}>
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
