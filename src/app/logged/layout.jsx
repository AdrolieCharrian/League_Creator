import {Inter} from "next/font/google";
import "../globals.css";
import {PrismaClient} from "@prisma/client";
import Link from "next/link";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export default function RootLayout({children}) {
  return (
    <div>
      <toolbar>
        <div>
          <p>IMG</p>
          <p>User</p>
        </div>
        <div>
          <Link href={"/logged/profile"}>Profile</Link>
          <Link href={"/logged/leagues"}>My Leagues</Link>
          <Link href={"/logged/teams"}>My Teams</Link>
        </div>
      </toolbar>
      {children}
    </div>
  );
}