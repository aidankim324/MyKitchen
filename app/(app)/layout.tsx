import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { AppHeader } from "@/components/layout/AppHeader";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({
  children,
}: AppLayoutProps) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <AppHeader />

      <div
        id="main-content"
        tabIndex={-1}
        className="outline-none"
      >
        {children}
      </div>
    </div>
  );
}
