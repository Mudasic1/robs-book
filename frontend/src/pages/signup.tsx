import React, { useState } from "react";
import Layout from "@theme/Layout";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory } from "@docusaurus/router";

export default function Signup() {
  const { siteConfig } = useDocusaurusContext();
  const { login } = useAuth();
  const history = useHistory();
  const rawApiUrl = siteConfig.customFields?.apiUrl as string;
  const apiUrl = rawApiUrl.replace(/\/$/, "");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    software_background: "",
    hardware_background: "",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${apiUrl}/auth/signup`, formData);
      login(res.data.access_token);
      history.push("/docs/intro");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <Layout title="Sign Up" description="Join the Physical AI Course">
      <div className="auth-container">
        <div className="auth-form-wrapper" style={{ maxWidth: "500px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Create Account
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
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                className="auth-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Software Experience (Languages, Frameworks)</label>
              <textarea
                name="software_background"
                className="auth-input"
                value={formData.software_background}
                onChange={handleChange}
                placeholder="e.g. Python, JS, React..."
                rows={3}
              />
            </div>
            <div>
              <label>Hardware/Robotics Experience</label>
              <textarea
                name="hardware_background"
                className="auth-input"
                value={formData.hardware_background}
                onChange={handleChange}
                placeholder="e.g. Arduino, ROS, None..."
                rows={3}
              />
            </div>
            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontSize: "0.9em",
            }}
          >
            Already have an account? <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
