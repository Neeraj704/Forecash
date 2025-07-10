import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return new Response(JSON.stringify({ error: "Email already in use." }), { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return new Response(JSON.stringify({ id: user.id, email: user.email }), {
    status: 201,
  });
}