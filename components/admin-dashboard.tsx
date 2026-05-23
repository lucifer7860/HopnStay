"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, BarChart3, Building2, ServerCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Analytics = {
  totalClicks: number;
  clicksByProvider: Array<{ provider: string; clicks: number }>;
  clicksByHotel: Array<{ hotelId: string; hotelName: string | null; clicks: number }>;
  recentClicks: Array<{ id: string; hotelId: string; hotelName: string | null; provider: string; source: string | null; createdAt: string }>;
  clicksByDay: Array<{ date: string; clicks: number }>;
  topHotels: Array<{ hotelId: string; hotelName: string | null; clicks: number }>;
  topProviders: Array<{ provider: string; clicks: number }>;
  estimatedAffiliateValue: { label: string; currency: string; amount: number };
};

type ProviderHealth = {
  travelpayoutsEnabled: boolean;
  apiKeyConfigured: boolean;
  affiliateMarkerConfigured: boolean;
  liveRequestSucceeded: boolean;
  normalizedResultsCount: number;
  fallbackAvailable: boolean;
  warnings: string[];
};

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [health, setHealth] = useState<ProviderHealth | null>(null);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    async function load() {
      const [analyticsResponse, healthResponse] = await Promise.all([
        fetch("/api/admin/affiliate-analytics"),
        fetch("/api/admin/provider-health")
      ]);
      if (analyticsResponse.status === 403 || healthResponse.status === 403) {
        setForbidden(true);
        return;
      }
      if (analyticsResponse.ok) setAnalytics(await analyticsResponse.json());
      if (healthResponse.ok) setHealth(await healthResponse.json());
    }
    load();
  }, []);

  if (forbidden) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with an admin account to view affiliate analytics and provider health.</p>
        <Link href="/login" className="mt-5 inline-flex">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Admin panel</h1>
        <p className="mt-2 text-sm text-muted-foreground">Affiliate analytics, provider health, and catalog management for partner-only hotel comparison.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Activity className="h-5 w-5" />} label="Total outbound clicks" value={analytics ? analytics.totalClicks.toLocaleString() : "..."} />
        <MetricCard
          icon={<BarChart3 className="h-5 w-5" />}
          label="Estimated affiliate value"
          value={
            analytics
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: analytics.estimatedAffiliateValue.currency }).format(
                  analytics.estimatedAffiliateValue.amount
                )
              : "..."
          }
          note={analytics?.estimatedAffiliateValue.label}
        />
        <MetricCard icon={<ServerCog className="h-5 w-5" />} label="Travelpayouts" value={health?.travelpayoutsEnabled ? "Enabled" : "Disabled"} />
        <MetricCard icon={<Building2 className="h-5 w-5" />} label="Normalized live results" value={health ? String(health.normalizedResultsCount) : "..."} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top providers</CardTitle>
          </CardHeader>
          <CardContent>
            <List items={analytics?.topProviders.map((item) => ({ label: item.provider, value: item.clicks }))} empty="No provider clicks yet." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <List items={analytics?.topHotels.map((item) => ({ label: item.hotelName || item.hotelId, value: item.clicks }))} empty="No hotel clicks yet." />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Last 30 days click trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-1">
              {(analytics?.clicksByDay || []).map((day) => {
                const max = Math.max(...(analytics?.clicksByDay || []).map((item) => item.clicks), 1);
                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-primary" style={{ height: `${Math.max((day.clicks / max) * 130, day.clicks ? 8 : 2)}px` }} title={`${day.date}: ${day.clicks}`} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provider Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <HealthRow label="Enabled" value={health?.travelpayoutsEnabled} />
            <HealthRow label="API key configured" value={health?.apiKeyConfigured} />
            <HealthRow label="Affiliate marker configured" value={health?.affiliateMarkerConfigured} />
            <HealthRow label="Live request status" value={health?.liveRequestSucceeded} />
            <HealthRow label="Fallback available" value={health?.fallbackAvailable} />
            {health?.warnings?.length ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Warnings
                </div>
                <ul className="space-y-1">
                  {health.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent outbound clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {analytics?.recentClicks.length ? (
              analytics.recentClicks.map((click) => (
                <div key={click.id} className="flex flex-col gap-1 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-slate-950">{click.hotelName || click.hotelId}</div>
                    <div className="text-sm text-muted-foreground">
                      {click.provider} from {click.source || "site"}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(click.createdAt).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No outbound clicks yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{label}</div>
          <span className="text-primary">{icon}</span>
        </div>
        <div className="mt-3 text-2xl font-bold text-slate-950">{value}</div>
        {note ? <div className="mt-1 text-xs text-muted-foreground">{note}</div> : null}
      </CardContent>
    </Card>
  );
}

function List({ items, empty }: { items?: Array<{ label: string; value: number }>; empty: string }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-md border p-3">
          <span className="font-medium text-slate-800">{item.label}</span>
          <Badge variant="secondary">{item.value} clicks</Badge>
        </div>
      ))}
    </div>
  );
}

function HealthRow({ label, value }: { label: string; value: boolean | undefined }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <Badge variant={value ? "secondary" : "outline"}>{value ? "Yes" : "No"}</Badge>
    </div>
  );
}
