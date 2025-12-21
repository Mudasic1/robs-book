import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAuth } from "./AuthContext";
// import { FaRobot } from 'react-icons/fa'; // Assuming react-icons installed, else use text

const ChatModal = () => {
  const { siteConfig } = useDocusaurusContext();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAskButton, setShowAskButton] = useState(false);
  const [buttonPos, setButtonPos] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = siteConfig.customFields?.apiUrl as string;

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 10) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setButtonPos({
            top: window.scrollY + rect.bottom + 10,
            left: window.scrollX + rect.left + rect.width / 2 - 40,
          });
          setSelectedText(text);
          setShowAskButton(true);
        }
      } else {
        setShowAskButton(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleAskClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent deselection
    setIsOpen(true);
    setShowAskButton(false);
    setQuestion("");
    setAnswer("");
  };

  // ...

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Please log in to ask the AI Tutor.");
      window.location.href = "/login";
      return;
    }

    if (!question) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("physical_ai_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        `${apiUrl}/chat/ask`,
        {
          question,
          selected_text: selectedText,
          chapter_id: "current-chapter",
        },
        { headers }
      );

      setAnswer(res.data.answer);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setAnswer(
          'Authentication expired. <a href="/login">Please login again.</a>'
        );
        localStorage.removeItem("physical_ai_token");
      } else {
        setAnswer("Error getting answer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Suggested prompts for better UX
  const suggestedPrompts = [
    "Summarize this",
    "Explain this concept",
    "Give me an example",
    "Quiz me on this",
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    setQuestion(prompt);
  };

  // Persistent button logic
  const toggleModal = () => {
    setIsOpen(!isOpen);
    setShowAskButton(false);
  };

  return (
    <>
      {/* Persistent Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleModal}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 1000,
            padding: "15px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            cursor: "pointer",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s",
          }}
          title="Open AI Tutor"
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🤖
        </button>
      )}

      {/* Context specific button */}
      {showAskButton && !isOpen && (
        <button
          className="ask-ai-button"
          style={{ top: buttonPos.top, left: buttonPos.left }}
          onClick={handleAskClick}
        >
          ✨ Ask from AI
        </button>
      )}

      {isOpen && (
        <div className="chat-modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="chat-modal-content"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <h3>Ask AI Tutor</h3>

            {selectedText && (
              <div
                style={{
                  background: "#f0f0f0",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "10px",
                  fontSize: "0.9em",
                  borderLeft: "3px solid #667eea",
                  color: "#333",
                }}
              >
                <strong>Selected Context:</strong>
                <br />"{selectedText.substring(0, 150)}
                {selectedText.length > 150 ? "..." : ""}"
              </div>
            )}

            {/* Suggested prompts */}
            {selectedText && (
              <div style={{ marginBottom: "10px" }}>
                <small style={{ color: "#666" }}>Quick actions:</small>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    marginTop: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      style={{
                        padding: "5px 10px",
                        fontSize: "0.85em",
                        border: "1px solid #667eea",
                        background: "white",
                        color: "#667eea",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              style={{
                width: "100%",
                padding: "10px",
                minHeight: "80px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  background: "#ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  background: "#667eea",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Asking..." : "Ask Question"}
              </button>
            </div>

            {answer && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                  color: "#333",
                }}
              >
                <strong>AI Answer:</strong>
                <div
                  dangerouslySetInnerHTML={{
                    __html: answer.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
