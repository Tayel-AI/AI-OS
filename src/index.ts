#!/usr/bin/env node
import { renderMiniSpec, renderBacklog } from "./render.js";
import { Command } from "commander";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "zod";

const IntakeSchema = z.object({
  project_name: z.string().min(3),
  customer: z.string().min(2),
  problem_statement: z.string().min(10),
  success_criteria: z.array(z.string().min(3)).min(1),
  constraints: z.array(z.string().min(3)).default([]),
  scope_in: z.array(z.string().min(3)).min(1),
  scope_out: z.array(z.string().min(3)).default([]),
  stakeholders: z.array(z.string().min(2)).default([]),
  timeline: z.object({
    target_release: z.string().min(4)
  })
});

type Intake = z.infer<typeof IntakeSchema>;

function loadIntake(intakePath: string): Intake {
  const raw = readFileSync(intakePath, "utf-8");
  const data = yaml.load(raw);
  const parsed = IntakeSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Intake file validation failed:");
    console.error(parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function renderMiniSpec(i: Intake): string {
  return `# Mini-Spec — ${i.project_name}

**Customer/Org:** ${i.customer}  
**Target release:** ${i.timeline.target_release}

## Problem statement
${i.problem_statement}

## Success criteria
${i.success_criteria.map((x) => `- ${x}`).join("\n")}

## Scope (IN)
${i.scope_in.map((x) => `- ${x}`).join("\n")}

## Scope (OUT)
${(i.scope_out.length ? i.scope_out : ["(none)"]).map((x) => `- ${x}`).join("\n")}

## Constraints
${(i.constraints.length ? i.constraints : ["(none)"]).map((x) => `- ${x}`).join("\n")}

## Stakeholders
${(i.stakeholders.length ? i.stakeholders : ["(none)"]).map((x) => `- ${x}`).join("\n")}

## Risks & assumptions (starter)
- Risk: unclear acceptance criteria → Mitigation: add testable AC per issue
- Risk: agent-generated changes introduce regressions → Mitigation: CI + small PRs
`;
}

function renderBacklog(i: Intake): string {
  return `# Backlog — ${i.project_name}

## Must-have issues
${i.scope_in
      .map(
        (item, idx) => `### ISSUE-${String(idx + 1).padStart(3, "0")}: ${item}
**Acceptance criteria**
- Clear Given/When/Then
- Tests added/updated
- Docs updated if needed
`
      )
      .join("\n")}

## Nice-to-have
- Add LLM-mode generator (phase 2)
- Add GitHub issue creation (phase 2)
`;
}

function renderStatusTemplate(i: Intake): string {
  return `# Weekly Status — ${i.project_name}

**Week of:** YYYY-MM-DD  
**Owner:** Tayel

## Progress
- ✅ Completed:
- 🚧 In progress:
- ⛔ Blocked:

## Risks / Issues
- Risk:
- Mitigation:

## Metrics (optional)
- Lead time:
- Defects found:
- Agent usage notes:

## Next week plan
- 
`;
}

const program = new Command();

program
  .name("ai-os")
  .description("Delivery Copilot (v0): generate delivery docs from an intake.yml")
  .version("0.1.0");

program
  .command("generate")
  .description("Generate Mini-Spec, Backlog, and Status template")
  .requiredOption("-i, --intake <path>", "Path to intake.yml")
  .option("-o, --out <dir>", "Output directory", "specs/capstone-delivery-copilot/generated")
  .action((opts) => {
    const intake = loadIntake(opts.intake);
    const outDir = path.resolve(process.cwd(), opts.out);

    ensureDir(outDir);

    writeFileSync(path.join(outDir, "MINI-SPEC.md"), renderMiniSpec(intake), "utf-8");
    writeFileSync(path.join(outDir, "BACKLOG.md"), renderBacklog(intake), "utf-8");
    writeFileSync(path.join(outDir, "STATUS.md"), renderStatusTemplate(intake), "utf-8");

    console.log("✅ Generated:");
    console.log(`- ${path.join(outDir, "MINI-SPEC.md")}`);
    console.log(`- ${path.join(outDir, "BACKLOG.md")}`);
    console.log(`- ${path.join(outDir, "STATUS.md")}`);
  });

program.parse(process.argv);
