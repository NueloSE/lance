import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AcceptBidModal } from "./accept-bid-modal";
import { type Bid, type Job } from "@/lib/api";

const mockBid: Bid = {
  id: "bid-1",
  job_id: "job-1",
  freelancer_address: "GD...FREELANCER",
  proposal: "I can do this job perfectly.",
  status: "pending",
  created_at: new Date().toISOString(),
};

const mockJob: Job = {
  id: "job-1",
  title: "Test Job",
  description: "Test Description",
  budget_usdc: 1000 * 10_000_000, // 1000 USDC in micro units
  milestones: 3,
  client_address: "GD...CLIENT",
  status: "open",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("AcceptBidModal", () => {
  it("renders correctly when open", () => {
    render(
      <AcceptBidModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        bid={mockBid}
        job={mockJob}
        isPending={false}
      />
    );

    expect(screen.getByText(/Accept Freelancer Bid/i)).toBeDefined();
    expect(screen.getByText(/GD/i)).toBeDefined();
    expect(screen.getByText(/1,000/i)).toBeDefined();
    expect(screen.getByText(/perfectly/i)).toBeDefined();
  });

  it("calls onConfirm when clicking the confirm button", () => {
    const onConfirm = vi.fn();
    render(
      <AcceptBidModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        bid={mockBid}
        job={mockJob}
        isPending={false}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /Confirm & Accept/i });
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the cancel button", () => {
    const onClose = vi.fn();
    render(
      <AcceptBidModal
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        bid={mockBid}
        job={mockJob}
        isPending={false}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when isPending is true", () => {
    render(
      <AcceptBidModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        bid={mockBid}
        job={mockJob}
        isPending={true}
      />
    );

    const acceptButton = screen.getByRole("button", { name: /Accepting.../i });
    expect(acceptButton).toBeDefined();
    expect(acceptButton).toBeDisabled();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeDisabled();
  });
});