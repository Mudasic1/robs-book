import React from "react";
import { useAuth } from "../../components/AuthContext";
import { useHistory } from "@docusaurus/router";
import { JSX } from "react/jsx-runtime";

export default function NavbarUserMenu(): JSX.Element {
  const { user, isAuthenticated, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <a href="/login" className="navbar__link">
          Login
        </a>
        <a
          href="/signup"
          className="navbar__link"
          style={{
            padding: "6px 12px",
            background: "var(--ifm-color-primary)",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <div className="navbar__item dropdown dropdown--hoverable">
      <button
        className="navbar__link"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 12px",
          fontSize: "inherit",
        }}
      >
        👤 {user?.sub || "User"}
      </button>
      <ul className="dropdown__menu">
        <li>
          <a className="dropdown__link" href="/profile">
            Profile
          </a>
        </li>
        <li>
          <button
            className="dropdown__link"
            onClick={handleLogout}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
