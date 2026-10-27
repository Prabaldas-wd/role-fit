import { useState } from "react";
import { analyze } from "../lib/api";
import { extractFromActiveTab } from "../lib/extractJob";
import type { AnalyzeResponse, Decision } from "../types";
import RecommendationCard from "./RecommendationCard";

export default function App() {
  const [jobTitle, setJobTitle] = useState("");
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExtract() {
    setError(null);
    try {
      const job = await extractFromActiveTab();
      setJobTitle(job.title ?? "");
      setJd(job.description);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleAnalyze() {
    setError(null);
    setLoading(true);
    try {
      const res = await analyze({
        job_description: jd,
        resume_text: resume,
        target_role: jobTitle || undefined,
      });
      setResult(res);
      setDecisions({});
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <header>
        <h1>RoleFit</h1>
        <p className="tagline">Every resume, tailored to the role.</p>
      </header>

      <section>
        <h2>Current job</h2>
        <button onClick={handleExtract}>Extract from page</button>
        <input
          placeholder="Job title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <textarea
          placeholder="Job description (extracted or pasted)"
          rows={8}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
      </section>

      <section>
        <h2>Resume</h2>
        <textarea
          placeholder="Paste your resume text"
          rows={8}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <p className="notice">
          Clicking Analyze sends the job description and resume text to the RoleFit backend.
        </p>
        <button onClick={handleAnalyze} disabled={loading || !jd.trim() || !resume.trim()}>
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      {result && (
        <section>
          <h2>Recommendations</h2>
          {result.recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              decision={decisions[rec.id] ?? "pending"}
              onDecide={(d) => setDecisions((prev) => ({ ...prev, [rec.id]: d }))}
            />
          ))}

          {result.gaps_to_confirm.length > 0 && (
            <>
              <h2>Gaps to confirm</h2>
              <ul>
                {result.gaps_to_confirm.map((g) => (
                  <li key={g.requirement}>
                    <strong>{g.requirement}</strong>: {g.reason}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </main>
  );
}
