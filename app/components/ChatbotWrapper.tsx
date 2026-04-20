"use client";
import { usePathname } from "next/navigation";
import AIChatbot from "./AIChatbot";

/**
 * Renders the AI chatbot only on user-facing pages,
 * excluding the /admin section entirely.
 */
export default function ChatbotWrapper() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAdminPage || isAuthPage) return null;
  return <AIChatbot />;
}
