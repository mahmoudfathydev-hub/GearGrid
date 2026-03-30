import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log('🔍 MIDDLEWARE TRIGGERED FOR:', request.nextUrl.pathname);
  
  // Simple test: Block all dashboard access regardless of auth
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('🚫 BLOCKING DASHBOARD ACCESS');
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('error', 'dashboard_blocked');
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
