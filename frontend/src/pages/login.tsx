import React, { useState } from "react";
import Layout from "@theme/Layout";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory } from "@docusaurus/router";

export default function Login() {
  const { siteConfig } = useDocusaurusContext();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const apiUrl = siteConfig.customFields?.apiUrl as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      login(res.data.access_token);
      history.push("/docs/intro");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid email or password");
    }
  };

  return (
    <Layout title="Login" description="Login to Physical AI Textbook">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Welcome Back
          </h2>
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-button">
              Login
            </button>
          </form>
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontSize: "0.9em",
            }}
          >
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
