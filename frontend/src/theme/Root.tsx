import React from "react";
import { AuthProvider } from "../components/AuthContext";
import ChatModal from "../components/ChatModal";

// Default implementation, that you can customize
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ChatModal />
    </AuthProvider>
  );
}
