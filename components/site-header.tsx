"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, Heart, Hotel, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Hotel className="h-5 w-5" aria-hidden="true" />
          </span>
          HopnStay
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/search" className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-muted sm:inline-flex">
            Search
          </Link>
          {session?.user?.role === "ADMIN" ? (
            <Link href="/admin" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-muted">
              <BarChart3 className="mr-2 inline h-4 w-4" aria-hidden="true" />
              Admin
            </Link>
          ) : null}
          {session ? (
            <>
              <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-muted">
                <Heart className="mr-2 inline h-4 w-4" aria-hidden="true" />
                Saved
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </>
          ) : status === "loading" ? null : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
