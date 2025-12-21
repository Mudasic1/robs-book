import React, { useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL || "https://your-backend.vercel.app";

export default function TranslateButton({ chapterId }) {
  const [translated, setTranslated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState("");

  const handleTranslate = async () => {
    setLoading(true);
    const contentEl = document.querySelector(".markdown") as HTMLElement;

    if (!translated) {
      setOriginalContent(contentEl.innerHTML);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chapter_id: chapterId,
            target_language: "urdu",
          }),
        });
        const data = await response.json();

        if (data.translated_content) {
          contentEl.innerHTML = data.translated_content;
          contentEl.style.direction = "rtl";
          contentEl.style.fontFamily = "'Noto Nastaliq Urdu', serif";
          setTranslated(true);
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    } else {
      contentEl.innerHTML = originalContent;
      contentEl.style.direction = "ltr";
      contentEl.style.fontFamily = "inherit";
      setTranslated(false);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleTranslate}
      disabled={loading}
      style={{
        padding: "10px 20px",
        background: "#ff9800",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: loading ? "wait" : "pointer",
        fontWeight: "bold",
        marginBottom: "1rem",
        marginLeft: "10px",
      }}
    >
      {loading ? "⏳ Translating..." : translated ? "🇺🇸 English" : "🇵🇰 اردو"}
    </button>
  );
}
