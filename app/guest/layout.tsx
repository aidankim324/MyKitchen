import type { ReactNode } from "react";
import { GuestHeader } from "@/components/guest/GuestHeader";

type GuestLayoutProps = {
  children: ReactNode;
};

export default function GuestLayout({
  children,
}: GuestLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <GuestHeader />

      <div id="guest-main-content">
        {children}
      </div>
    </div>
  );
}
