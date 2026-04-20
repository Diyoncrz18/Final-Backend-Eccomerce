"use client";
import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * AuthTransition
 * Wrap auth pages for enter/exit animation.
 * Usage: <AuthTransition>{(navigate) => <YourPage navigate={navigate} />}</AuthTransition>
 *
 * `navigate(href)` triggers a smooth exit animation BEFORE pushing the route.
 */
export default function AuthTransition({
  children,
}: {
  children: (navigate: (href: string) => void) => ReactNode;
}) {
  const [phase, setPhase] = useState<"entering" | "idle" | "exiting">("entering");
  const router = useRouter();

  // Mark idle after enter animation completes
  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 600);
    return () => clearTimeout(t);
  }, []);

  const navigate = (href: string) => {
    if (phase === "exiting") return; // guard double-click
    setPhase("exiting");
    setTimeout(() => router.push(href), 440);
  };

  const animation =
    phase === "entering"
      ? "authEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) both"
      : phase === "exiting"
      ? "authExit 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94) both"
      : "none";

  return (
    <>
      <div style={{ animation }}>{children(navigate)}</div>

      <style jsx global>{`
        @keyframes authEnter {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes authExit {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          to {
            opacity: 0;
            transform: translateY(-14px) scale(0.985);
            filter: blur(3px);
          }
        }
      `}</style>
    </>
  );
}
