"use server";
import jwt from "jsonwebtoken";
import {redirect} from "next/navigation";
import prisma from "@/app/lib/prisma";
import {cookies} from "next/headers";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";

export const login = async (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    console.log("User not found");
    return;
  }
  console.log("User found", user);

  //if user exists desctructure password in DB
  const {salt, hash} = JSON.parse(user.password);

  //assign to a new hash variable the result
  const computedHash = bcrypt.hashSync(password, salt);

  //if the DB hash and the reencrypted hash match, log in
  if (hash !== computedHash) {
    console.log("Invalid password");
    return;
  }
  console.log("Logged in");

  // Generate JWT token
  const token = jwt.sign(
    {
      id_user: user.id_user,
      name: user.name,
      email: user.email,
    },
    "1234"
  );
  console.log(token);

  // Set token in cookie
  cookies().set("access-token", token);
  console.log("Token Set: ", token);

  redirect("/");
};

export const register = async (formData) => {
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const confirm = formData.get("confirm-password");

  if (password == confirm) {
    try {
      //create deafault salt
      const salt = bcrypt.genSaltSync(10);
      //create new hash with the password feom request (pass+salt)
      const hash = bcrypt.hashSync(password, salt);
      //convert to string
      const passwordString = JSON.stringify({hash, salt});

      const user = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: passwordString,
        },
      });
      console.log(NextResponse.json({user}));
      console.log("Created User");
    } catch (error) {
      console.error(error);
      return NextResponse.error("Error al crear el usuario");
    }
    redirect("/login");
  } else {
    console.error("passwords don't match");
  }
};

export const logout = () => {
  const cookies = cookies().get("access-token");
  cookies().delete(cookies);
};
