import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const {
      theme,
      language,
      currency,
      mode,
      initialBalance,
      dailyLimit,
      fimcpPhone, // ✅ key expected here
      features,
      setGoalNow,
      goals,
      assistantMode,
      assistantTone,
      enable2FA,
      accessibility,
    } = body;

    const safeFloat = (val) =>
      val === undefined || val === null || val === "" ? null : parseFloat(val);

    console.log("Final Data Passed:", {
      theme, language, currency, mode, initialBalance, dailyLimit,
      fimcpPhone, features, setGoalNow, assistantMode,
      assistantTone, enable2FA, accessibility,
    });

    await prisma.onboardingPreference.upsert({
      where: { userId: session.user.id },
      update: {
        theme,
        language,
        currency,
        mode,
        initialBalance: safeFloat(initialBalance),
        dailyLimit: safeFloat(dailyLimit),
        fimcpPhone,
        features,
        setGoalNow,
        assistantMode,
        assistantTone,
        enable2FA,
        accessibility,
        completed: true,
      },
      create: {
        userId: session.user.id,
        theme,
        language,
        currency,
        mode,
        initialBalance: safeFloat(initialBalance),
        dailyLimit: safeFloat(dailyLimit),
        fimcpPhone,
        features,
        setGoalNow,
        assistantMode,
        assistantTone,
        enable2FA,
        accessibility,
        completed: true,
      },
    });

    if (setGoalNow && goals?.length > 0) {
      for (const goal of goals) {
        await prisma.goal.create({
          data: {
            name: goal.name,
            target: parseFloat(goal.target),
            userId: session.user.id,
          },
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error("OnboardingPreference Error:", e);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
