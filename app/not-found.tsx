import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="rounded-lg border bg-white p-10 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The page you requested is not available.</p>
      <Link href="/" className="mt-5 inline-flex">
        <Button>Back to search</Button>
      </Link>
    </div>
  );
}
