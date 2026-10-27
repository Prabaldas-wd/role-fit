import type { ExtractedJob } from "../types";

/**
 * Runs inside the job-posting tab via chrome.scripting.executeScript.
 * Must be fully self-contained: it is serialized, so it cannot reference
 * anything outside its own body.
 */
export function extractJobFromPage(): ExtractedJob {
  const MAX_CHARS = 20000;
  const clean = (s: string | null | undefined) =>
    (s ?? "").replace(/\n{3,}/g, "\n\n").trim();

  // Prefer the user's selection, then common JD containers, then <main>.
  const selection = clean(window.getSelection()?.toString());
  const selectors = [
    "[class*='job-description' i]",
    "[class*='jobdescription' i]",
    "[id*='job-description' i]",
    "[data-testid*='description' i]",
    "[class*='description' i]",
    "main",
    "article",
  ];
  let description = selection;
  if (!description) {
    for (const sel of selectors) {
      const el = document.querySelector<HTMLElement>(sel);
      const text = clean(el?.innerText);
      if (text.length > 200) {
        description = text;
        break;
      }
    }
  }

  const title =
    clean(document.querySelector("h1")?.textContent) ||
    clean(document.querySelector<HTMLMetaElement>("meta[property='og:title']")?.content) ||
    null;
  const company =
    clean(document.querySelector<HTMLMetaElement>("meta[property='og:site_name']")?.content) ||
    null;

  return {
    title,
    company,
    description: description.slice(0, MAX_CHARS),
    url: location.href,
  };
}

export async function extractFromActiveTab(): Promise<ExtractedJob> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab found.");
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractJobFromPage,
  });
  const job = result?.result as ExtractedJob | undefined;
  if (!job?.description) {
    throw new Error("Couldn't find a job description on this page. Paste it instead.");
  }
  return job;
}
