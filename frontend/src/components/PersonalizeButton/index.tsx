import React, { useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL || "https://your-backend.vercel.app";

export default function PersonalizeButton({ chapterId }) {
  const [personalized, setPersonalized] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePersonalize = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/personalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chapter_id: chapterId }),
      });
      const data = await response.json();

      if (data.personalized_content) {
        // Replace content in DOM
        const contentEl = document.querySelector(".markdown");
        if (contentEl) {
          contentEl.innerHTML = data.personalized_content;
        }
        setPersonalized(true);
      }
    } catch (error) {
      console.error("Personalization error:", error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handlePersonalize}
      disabled={loading || personalized}
      style={{
        padding: "10px 20px",
        background: personalized ? "#4caf50" : "#667eea",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: loading ? "wait" : "pointer",
        fontWeight: "bold",
        marginBottom: "1rem",
      }}
    >
      {loading
        ? "⏳ Personalizing..."
        : personalized
        ? "✅ Personalized"
        : "🎯 Personalize for Me"}
    </button>
  );
}
