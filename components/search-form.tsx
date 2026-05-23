"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, CalendarDays, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaults = {
  city: "Bangalore",
  checkin: "2026-06-10",
  checkout: "2026-06-12",
  guests: "2",
  rooms: "1"
};

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState(defaults);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="rounded-lg border bg-white p-4 shadow-soft">
      <div className={compact ? "grid gap-3 md:grid-cols-6" : "grid gap-3 md:grid-cols-12"}>
        <div className={compact ? "md:col-span-2" : "md:col-span-4"}>
          <Label htmlFor="city">City</Label>
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="city"
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              className="pl-9"
              placeholder="Where are you going?"
              required
            />
          </div>
        </div>
        <div className={compact ? "md:col-span-1" : "md:col-span-2"}>
          <Label htmlFor="checkin">Check-in</Label>
          <div className="relative mt-1">
            <CalendarDays className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input id="checkin" type="date" value={form.checkin} onChange={(event) => updateField("checkin", event.target.value)} className="pl-9" />
          </div>
        </div>
        <div className={compact ? "md:col-span-1" : "md:col-span-2"}>
          <Label htmlFor="checkout">Check-out</Label>
          <div className="relative mt-1">
            <CalendarDays className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input id="checkout" type="date" value={form.checkout} onChange={(event) => updateField("checkout", event.target.value)} className="pl-9" />
          </div>
        </div>
        <div className={compact ? "md:col-span-1" : "md:col-span-1"}>
          <Label htmlFor="guests">Guests</Label>
          <div className="relative mt-1">
            <Users className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input id="guests" type="number" min="1" value={form.guests} onChange={(event) => updateField("guests", event.target.value)} className="pl-9" />
          </div>
        </div>
        <div className={compact ? "md:col-span-1" : "md:col-span-1"}>
          <Label htmlFor="rooms">Rooms</Label>
          <div className="relative mt-1">
            <BedDouble className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input id="rooms" type="number" min="1" value={form.rooms} onChange={(event) => updateField("rooms", event.target.value)} className="pl-9" />
          </div>
        </div>
        <div className={compact ? "md:col-span-6" : "md:col-span-2"}>
          <Label className="invisible hidden md:block">Search</Label>
          <Button type="submit" className="mt-1 w-full">
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
