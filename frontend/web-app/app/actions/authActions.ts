import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { cookies, headers } from "next/headers";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export const getSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }

    return session.user;
  } catch (e) {
    return null;
  }
};

export const getUserToken = async () => {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  } as NextApiRequest;

  return await getToken({ req });
};
