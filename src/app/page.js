import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Landing from "@/components/Landing"; // 👇 move client code here

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (!session.user.onboardingCompleted) redirect("/onboarding");
    redirect("/dashboard");
  }

  return <Landing />; // ⬅️ pure client component
}