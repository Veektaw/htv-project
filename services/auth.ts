import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { EncryptData, UserSession, UserSessionData } from "@/types/auth";

export const USER_SESSION_KEY = "session";
// const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";

const EXPIRY_TIME = 900;

const secretKey = process.env.SECRET_KEY!;

const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: EncryptData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_TIME} sec from now`)
    .sign(key);
}

export async function decrypt<T>(input: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as T;
  } catch {
    return null;
  }
}

export async function setCookie(data: {
  user: UserSessionData;
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = await cookies();

  const expires = new Date(Date.now() + EXPIRY_TIME * 1000);
  const session = await encrypt({ data, expires });

  cookieStore.set(USER_SESSION_KEY, session, {
    expires,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  cookieStore.set(REFRESH_TOKEN, data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    // path: "/api/auth/refresh", // scope it, optional but good practice
  });
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(USER_SESSION_KEY)?.value;

  if (!session) return null;

  return await decrypt<UserSession>(session);
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(REFRESH_TOKEN)?.value ?? null;
}

export async function updateSession(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(USER_SESSION_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

  const userSession = sessionCookie
    ? await decrypt<UserSession>(sessionCookie)
    : null;

  const path = request.nextUrl.pathname;
  const isSignIn = path === "/sign-in";

  console.log({ path });

  // No session — redirect to sign in
  if ((!refreshToken || !userSession) && !isSignIn) {
    return NextResponse.redirect(
      new URL(`/sign-in?redirect=${path}`, request.url),
    );
  }

  if (!refreshToken || !userSession) {
    return NextResponse.next();
  }

  const isAdmin = userSession.data.user.role === "admin";
  const isAdminRoute = path.split("/")[1] === "admin";

  // Has session — redirect away from sign in
  if (isSignIn && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isSignIn && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    userSession.data.user.must_change_password &&
    path !== "/create-new-password"
  ) {
    return NextResponse.redirect(new URL("/create-new-password", request.url));
  }

  if (
    !userSession.data.user.must_change_password &&
    path === "/create-new-password"
  ) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  if (!isAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdmin && !isAdminRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Slide the session expiry forward
  const newExpires = new Date(Date.now() + EXPIRY_TIME * 1000);
  const res = NextResponse.next();

  res.cookies.set({
    name: USER_SESSION_KEY,
    value: await encrypt({ data: userSession.data, expires: newExpires }),
    httpOnly: true,
    expires: newExpires,
  });

  return res;
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set(USER_SESSION_KEY, "", { expires: new Date(0) });
  cookieStore.set(REFRESH_TOKEN, "", { expires: new Date(0) });
}

export async function getUser(): Promise<UserSessionData | undefined> {
  const session = await getUserSession();

  if (!session?.data) {
    return redirect("/sign-in");
  }

  return session.data.user;
}
