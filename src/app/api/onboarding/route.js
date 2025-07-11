import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const {
    mode,
    currency,
    initialBalance,
    dailyLimit,
    fimcpPhone,
    consent
  } = await req.json();

  if (!mode || !currency) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const payload = {
    mode,
    currency,
    completed: true,
    ...(initialBalance !== null && initialBalance !== undefined && initialBalance !== "" ? { initialBalance } : {}),
    ...(dailyLimit !== null && dailyLimit !== undefined && dailyLimit !== "" ? { dailyLimit } : {}),
    ...(fimcpPhone ? { fimcpPhone } : {}),
    ...(typeof consent === "boolean" ? { consent } : {}),
  };

  try {
    await prisma.onboarding.upsert({
      where: { userId: session.user.id },
      update: payload,
      create: {
        user: { connect: { id: session.user.id } },
        ...payload
      }
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("Onboarding upsert error:", error);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }
}
