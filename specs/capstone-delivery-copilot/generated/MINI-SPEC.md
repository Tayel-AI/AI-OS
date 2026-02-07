# Mini-Spec — Delivery Copilot

**Customer/Org:** Internal (Tayel)  
**Target release:** Week 1 end

## Problem statement
I need a repeatable way to turn a vague request into a mini-spec, backlog, and weekly status updates to run delivery like a pro.

## Success criteria
- Generate MINI-SPEC.md, BACKLOG.md, STATUS.md from one intake file
- Docs are clear enough that another person can follow them

## Scope (IN)
- CLI tool to generate delivery docs
- Input validation for intake.yml
- Outputs stored in specs/capstone-delivery-copilot/generated

## Scope (OUT)
- LLM integration (phase 2)
- GitHub issue creation (phase 2)

## Constraints
- No secrets in repo
- Small PRs

## Stakeholders
- Tayel

## Risks & assumptions (starter)
- Risk: unclear acceptance criteria → Mitigation: add testable AC per issue
- Risk: agent-generated changes introduce regressions → Mitigation: CI + small PRs
