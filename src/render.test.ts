import { describe, it, expect } from "vitest";
import { renderMiniSpec, renderBacklog } from "./render";

describe("renderers", () => {
  it("renders a mini spec with title and success criteria", () => {
    const out = renderMiniSpec({
      project_name: "Delivery Copilot",
      customer: "Internal",
      problem_statement: "Test problem statement long enough",
      success_criteria: ["A", "B"],
      scope_in: ["X"],
      timeline: { target_release: "Week 1" }
    });

    expect(out).toContain("# Mini-Spec — Delivery Copilot");
    expect(out).toContain("- A");
    expect(out).toContain("- B");
  });

  it("renders backlog issues from scope_in", () => {
    const out = renderBacklog({
      project_name: "Delivery Copilot",
      customer: "Internal",
      problem_statement: "Test problem statement long enough",
      success_criteria: ["A"],
      scope_in: ["First item", "Second item"],
      timeline: { target_release: "Week 1" }
    });

    expect(out).toContain("ISSUE-001");
    expect(out).toContain("First item");
    expect(out).toContain("ISSUE-002");
    expect(out).toContain("Second item");
  });
});
