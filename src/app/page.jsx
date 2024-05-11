import {PrismaClient} from "@prisma/client";
import Link from "next/link";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function getLeagueUsers() {
  const userList = await prisma.leagues.findMany({
    include: {
      league_players: true,
      score: false,
      sports_custom: true,
      sports_league: true,
      teams: true,
    },
  });
  return userList;
}

export default async function Home() {
  const userList = await getLeagueUsers();

  const token = cookies().get("access-token");
  const user = token ? jwt.decode(token.value) : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-3">
      <p className="mx-auto">Logged in as: {user.email}</p>
      <div className="flex flex-col justify-center space-y-3">
        {" "}
        {/* Cambiamos a flex-col y usamos espacio */}
        <Link href={"/login"}>Login</Link>
        <Link href={"/league"}>League</Link>
        <Link href={"/league_parti"}>League parto</Link>
        <Link href={"/app/leagues"}>Leagues</Link>
      </div>
    </main>
  );
}
