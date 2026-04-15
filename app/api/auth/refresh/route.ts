import { cookies } from "next/headers";
import {
  decrypt,
  REFRESH_TOKEN,
  setCookie,
  USER_SESSION_KEY,
} from "@/services/auth";
import { RefreshTokensResponse, UserSession } from "@/types/auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

  console.log({ xyz: refreshToken });

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  console.log(`${process.env.BASE_URL}/auth/refresh-token/`);

  try {
    const res = await fetch(`${process.env.BASE_URL}/auth/refresh-token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = data.message || data.detail || "Session expired";
      console.log({ errorMessage });

      cookieStore.delete(USER_SESSION_KEY);
      cookieStore.delete(REFRESH_TOKEN);
      return Response.json({ error: errorMessage }, { status: 401 });
    }

    const sessionCookie = cookieStore.get(USER_SESSION_KEY)?.value;
    const userSession = sessionCookie
      ? await decrypt<UserSession>(sessionCookie)
      : null;

    console.log({ xyz2: userSession });

    if (!userSession) {
      return Response.json({ error: "No session cookie" }, { status: 401 });
    }

    const { access_token, refresh_token }: RefreshTokensResponse = data;

    console.log({ access_token, refresh_token });

    const user = userSession?.data.user;

    await setCookie({
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    return Response.json({
      ok: true,
      accessToken: access_token,
      refreshToken: refresh_token,
    });
  } catch (error) {
    console.error({ fetchError: error });
    return Response.json(
      { error: "Unable to reach auth server" },
      { status: 503 },
    );
  }
}
