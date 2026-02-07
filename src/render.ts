export type Intake = {
  project_name: string;
  customer: string;
  problem_statement: string;
  success_criteria: string[];
  constraints?: string[];
  scope_in: string[];
  scope_out?: string[];
  stakeholders?: string[];
  timeline: { target_release: string };
};

export function renderMiniSpec(i: Intake): string {
  return `# Mini-Spec — ${i.project_name}

**Customer/Org:** ${i.customer}  
**Target release:** ${i.timeline.target_release}

## Problem statement
${i.problem_statement}

## Success criteria
${i.success_criteria.map((x) => `- ${x}`).join("\n")}
`;
}

export function renderBacklog(i: Intake): string {
  return `# Backlog — ${i.project_name}

## Must-have issues
${i.scope_in
  .map((item, idx) => `### ISSUE-${String(idx + 1).padStart(3, "0")}: ${item}\n`)
  .join("")}
`;
}
