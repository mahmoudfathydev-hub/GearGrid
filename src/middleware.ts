import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 1. Redirect unauthenticated users to login page (except for login/signup pages)
  if (!user) {
    if (url.pathname !== "/login" && url.pathname !== "/signup") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // User is authenticated - get role from metadata or database
  let role = user.user_metadata?.role;

  // If role not in metadata, check database
  if (!role) {
    const { data: profile } = await supabase
      .from("User")
      .select("role")
      .eq("email", user.email!)
      .single();
    role = profile?.role;
  }

  // 2. Redirect authenticated users based on role
  if (role === "admin") {
    // Admin users: redirect to dashboard, block access to home page
    if (
      url.pathname === "/" ||
      url.pathname === "/login" ||
      url.pathname === "/signup"
    ) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } else if (role === "user") {
    // Regular users: redirect to home page, block access to dashboard
    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname === "/login" ||
      url.pathname === "/signup"
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
