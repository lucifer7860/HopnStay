import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AffiliateDealButton } from "@/components/affiliate-deal-button";

describe("AffiliateDealButton", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 201 })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("disables invalid URLs", () => {
    render(<AffiliateDealButton hotelId="hotel_1" provider="mock" bookingUrl="javascript:alert(1)" />);
    const button = screen.getByRole("button", { name: /deal unavailable/i });
    expect(button).toBeDisabled();
  });

  it("tracks valid URL clicks then redirects", async () => {
    const redirect = vi.fn();
    render(
      <AffiliateDealButton
        hotelId="hotel_1"
        hotelName="Test Hotel"
        provider="mock"
        bookingUrl="https://partners.example.com/deal?hotel=1"
        source="unit-test"
        redirect={redirect}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /view deal/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(redirect).toHaveBeenCalledWith("https://partners.example.com/deal?hotel=1"));
  });
});
