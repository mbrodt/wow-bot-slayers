import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// List of admin user IDs (Madsen, Hardz)
const ADMIN_USER_IDS = [
  "f39af20b-df28-47d8-aeff-d17fd704fd2d",
  "6eec63ea-cb86-4b41-bde3-600f007066c6",
];

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if the request is for the admin page
    if (request.nextUrl.pathname === "/admin") {
      if (!user || !ADMIN_USER_IDS.includes(user.id)) {
        // If the user is not an admin, redirect to the homepage
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return response;
  } catch (e) {
    console.log("e:", e);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
