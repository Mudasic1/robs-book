import React, { useState } from "react";
import axios from "axios";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAuth } from "./AuthContext";
import clsx from "clsx";

interface Props {
  chapterId: string;
}

const PersonalizeButton: React.FC<Props> = ({ chapterId }) => {
  const { siteConfig } = useDocusaurusContext();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [personalized, setPersonalized] = useState(false);

  const apiUrl = siteConfig.customFields?.apiUrl as string;

  const handlePersonalize = async () => {
    if (!isAuthenticated) {
      alert("Please login to personalize content.");
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const contentElement = document.querySelector("article .markdown"); // Generic selector for Docusaurus content
      if (!contentElement) {
        console.error("Content not found");
        return;
      }

      const currentContent = contentElement.innerHTML; // sending HTML for now, ideally markdown

      const token = localStorage.getItem("physical_ai_token");
      const res = await axios.post(
        `${apiUrl}/personalize/content`,
        {
          chapter_id: chapterId,
          current_content: currentContent, // sending content implies we want to rewrite THIS content
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Direct DOM manipulation for demo purposes (React way would be replacing state-driven content)
      // Since Docusaurus is static text mostly, this is a "hackathon" way to swap content dynamically.
      contentElement.innerHTML = res.data.personalized_content;
      setPersonalized(true);
    } catch (error) {
      console.error(error);
      alert("Failed to personalize content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={clsx("feature-button", { active: personalized })}
      onClick={handlePersonalize}
      disabled={loading || personalized}
    >
      {loading
        ? "⏳ Personalizing..."
        : personalized
        ? "✅ Personalized for You"
        : "🎯 Personalize for Me"}
    </button>
  );
};

export default PersonalizeButton;
