import { getProviderHealth } from "@/services/providerHealth";

describe("providerHealth", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  it("reports disabled Travelpayouts with fallback available", async () => {
    process.env.TRAVELPAYOUTS_ENABLED = "false";
    const health = await getProviderHealth();
    expect(health.travelpayoutsEnabled).toBe(false);
    expect(health.fallbackAvailable).toBe(true);
    expect(health.warnings.join(" ")).toContain("disabled");
  });

  it("reports missing API key safely", async () => {
    process.env.TRAVELPAYOUTS_ENABLED = "true";
    process.env.TRAVELPAYOUTS_API_KEY = "";
    process.env.TRAVELPAYOUTS_TOKEN = "";
    process.env.TRAVELPAYOUTS_AFFILIATE_MARKER = "marker_1";
    const health = await getProviderHealth();
    expect(health.apiKeyConfigured).toBe(false);
    expect(JSON.stringify(health)).not.toContain("marker_1");
  });

  it("handles live request failure without exposing secrets", async () => {
    process.env.TRAVELPAYOUTS_ENABLED = "true";
    process.env.TRAVELPAYOUTS_API_KEY = "secret-key";
    process.env.TRAVELPAYOUTS_AFFILIATE_MARKER = "secret-marker";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));

    const health = await getProviderHealth();
    expect(health.liveRequestSucceeded).toBe(false);
    expect(health.warnings.join(" ")).toContain("failed");
    expect(JSON.stringify(health)).not.toContain("secret-key");
    expect(JSON.stringify(health)).not.toContain("secret-marker");
  });
});
