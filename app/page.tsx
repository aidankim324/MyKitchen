import { auth } from "@clerk/nextjs/server";
import { LandingPageClient } from "@/components/landing/LandingPageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <LandingPageClient
      isSignedIn={Boolean(userId)}
    />
  );
}
