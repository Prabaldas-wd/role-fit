import type { Decision, Recommendation } from "../types";

interface Props {
  rec: Recommendation;
  decision: Decision;
  onDecide: (d: Decision) => void;
}

export default function RecommendationCard({ rec, decision, onDecide }: Props) {
  return (
    <article className={`card card--${decision}`}>
      <div className="card__meta">
        <span className={`badge badge--${rec.action}`}>{rec.action.replace("_", " ")}</span>
        <span>{rec.section}</span>
        {rec.requires_confirmation && <span className="badge">needs confirmation</span>}
      </div>
      <p className={rec.suggested_bullet ? "card__original card__original--replaced" : "card__original"}>
        {rec.original_bullet}
      </p>
      {rec.suggested_bullet && <p className="card__suggested">{rec.suggested_bullet}</p>}
      <p className="card__reason">{rec.reason}</p>
      <div className="card__actions">
        <button onClick={() => onDecide("accepted")} disabled={decision === "accepted"}>
          Accept
        </button>
        <button onClick={() => onDecide("rejected")} disabled={decision === "rejected"}>
          Reject
        </button>
        {decision !== "pending" && <button onClick={() => onDecide("pending")}>Undo</button>}
      </div>
    </article>
  );
}
