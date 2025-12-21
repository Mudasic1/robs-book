import React, { useState } from "react";
import axios from "axios";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAuth } from "./AuthContext";

export default function TranslateButton() {
  const { siteConfig } = useDocusaurusContext();
  const { isAuthenticated } = useAuth();
  const apiUrl = siteConfig.customFields?.apiUrl as string;
  const [loading, setLoading] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [originalContent, setOriginalContent] = useState("");

  const handleTranslate = async () => {
    if (!isAuthenticated) {
      alert("Please log in to use translation feature.");
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      // Get the main content area
      const contentElement = document.querySelector(
        ".markdown, article, .theme-doc-markdown"
      );
      if (!contentElement) {
        alert("No content found to translate");
        setLoading(false);
        return;
      }

      // Save original content
      if (contentElement instanceof HTMLElement) {
        setOriginalContent(contentElement.innerHTML);
      }

      const content = contentElement.textContent || "";

      const token = localStorage.getItem("physical_ai_token");
      const response = await axios.post(
        `${apiUrl}/personalize/translate`,
        { content, target_language: "ur" },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      // Replace content with translation
      if (contentElement instanceof HTMLElement) {
        contentElement.innerHTML = `<div dir="rtl" style="text-align: right; font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;">${response.data.translated_content}</div>`;
      }

      setTranslated(true);
    } catch (error) {
      console.error("Translation error:", error);
      alert("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      {!translated ? (
        <button
          onClick={handleTranslate}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#25c2a0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Translating to Urdu..." : "🌐 Translate to Urdu"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ color: "#25c2a0", fontWeight: "bold" }}>
            ✓ Translated to Urdu
          </span>
          <button
            onClick={handleReload}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Show Original
          </button>
        </div>
      )}
    </div>
  );
}
