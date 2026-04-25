"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getStoredUser, isAuthenticated } from "../../services/api";

const isBrowser = typeof window !== "undefined";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function validateSession() {
      if (!isAuthenticated() || !getStoredUser().email) {
        router.replace("/login");
        return;
      }

      const user = await getCurrentUser();
      if (!user && active) {
        router.replace("/login");
        return;
      }

      if (active) {
        setReady(true);
      }
    }

    if (isBrowser) {
      void validateSession();
    }

    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
