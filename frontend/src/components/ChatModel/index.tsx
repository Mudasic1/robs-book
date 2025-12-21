import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const API_URL =
  process.env.REACT_APP_API_URL || "https://your-backend.vercel.app";

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonPos, setButtonPos] = useState({ top: 0, left: 0 });
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 10) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setButtonPos({
          top: rect.top + window.scrollY - 50,
          left: rect.left + rect.width / 2 - 50,
        });
        setSelectedText(text);
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          question,
          selected_text: selectedText,
          chapter_id: window.location.pathname,
        }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error: Unable to get answer. Please try again.");
    }
    setLoading(false);
  };

  const openModal = () => {
    setIsOpen(true);
    setShowButton(false);
  };

  return (
    <>
      {showButton && (
        <button
          className={styles.floatingButton}
          style={{
            position: "absolute",
            top: buttonPos.top,
            left: buttonPos.left,
          }}
          onClick={openModal}
        >
          Ask 🤖
        </button>
      )}

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>

            <h2>Ask AI Tutor 🤖</h2>

            {selectedText && (
              <div className={styles.selectedText}>
                <strong>Selected Text:</strong>
                <p>{selectedText}</p>
              </div>
            )}

            <textarea
              className={styles.input}
              placeholder="Ask your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
            />

            <button
              className={styles.askBtn}
              onClick={handleAsk}
              disabled={loading || !question.trim()}
            >
              {loading ? "⏳ Thinking..." : "Ask Question"}
            </button>

            {answer && (
              <div className={styles.answer}>
                <strong>Answer:</strong>
                <p>{answer}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
