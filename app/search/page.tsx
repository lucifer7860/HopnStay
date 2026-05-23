import type { Metadata } from "next";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { getSearchMetadata } from "@/lib/seo";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  return getSearchMetadata(first(resolvedSearchParams.city));
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialParams = {
    city: first(resolvedSearchParams.city),
    checkin: first(resolvedSearchParams.checkin),
    checkout: first(resolvedSearchParams.checkout),
    guests: first(resolvedSearchParams.guests),
    rooms: first(resolvedSearchParams.rooms)
  };

  return (
    <div className="space-y-6">
      <SearchForm compact />
      <SearchResults initialParams={initialParams} />
    </div>
  );
}
