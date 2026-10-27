import { fireEvent, render, screen } from "@testing-library/react";
import RecommendationCard from "./RecommendationCard";
import type { Recommendation } from "../types";

const rec: Recommendation = {
  id: "rec-001",
  section: "Experience",
  action: "rewrite",
  original_bullet: "Contributed to CI/CD pipelines.",
  suggested_bullet: "Troubleshot frontend build failures within CI/CD workflows.",
  reason: "Makes the contribution more specific.",
  related_requirement: "CI/CD",
  supporting_evidence: [],
  requires_confirmation: true,
};

describe("RecommendationCard", () => {
  it("shows original and suggested text and reports decisions", () => {
    const onDecide = vi.fn();
    render(<RecommendationCard rec={rec} decision="pending" onDecide={onDecide} />);

    expect(screen.getByText(rec.original_bullet)).toBeInTheDocument();
    expect(screen.getByText(rec.suggested_bullet!)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Accept"));
    expect(onDecide).toHaveBeenCalledWith("accepted");
  });
});
