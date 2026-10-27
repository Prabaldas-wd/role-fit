import { extractJobFromPage } from "./extractJob";

describe("extractJobFromPage", () => {
  it("reads title and description from common containers", () => {
    const body = "We are looking for a React + TypeScript engineer. ".repeat(10);
    document.body.innerHTML = `
      <h1>Frontend Engineer</h1>
      <div class="job-description">${body}</div>`;
    // jsdom lacks innerText; approximate with textContent.
    Object.defineProperty(HTMLElement.prototype, "innerText", {
      configurable: true,
      get() {
        return this.textContent;
      },
    });

    const job = extractJobFromPage();
    expect(job.title).toBe("Frontend Engineer");
    expect(job.description).toContain("React + TypeScript");
  });
});
