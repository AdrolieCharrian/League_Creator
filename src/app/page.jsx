import {PrismaClient} from "@prisma/client";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import HomeComponent from "./components/homeComponent";
import { auth } from "auth";

const prisma = new PrismaClient();

export default async function Home() {
  const token = cookies().get("access-token");
  const user = token ? jwt.decode(token.value) : null;
  const session = await auth();

  return (
    <main className="min-h-screen">
      <HomeComponent session={session} name={session.user.name} image={session.user.image}/>
    </main>
  );
}
