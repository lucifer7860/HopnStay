"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WishlistButton({ hotelId }: { hotelId: string }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!session) {
    return (
      <Link href="/login" aria-label="Sign in to save hotel">
        <Button variant="outline" size="icon">
          <Heart className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Link>
    );
  }

  async function save() {
    if (saving || saved) return;
    setSaving(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelId })
      });
      if (response.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button variant={saved ? "secondary" : "outline"} size="icon" onClick={save} disabled={saving} aria-label={saved ? "Hotel saved" : "Save hotel"}>
      <Heart className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} aria-hidden="true" />
    </Button>
  );
}
