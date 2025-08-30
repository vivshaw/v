# Project Brief Template

<instructions>
    This template guides creation of a comprehensive Project Brief that serves as the foundational document for product development. The brief establishes shared understanding of the problem space, solution approach, and success criteria.
</instructions>

## Executive Summary

<section>
  - id: executive-summary
    title: Executive Summary
    instruction: |
      Create a compelling overview that captures the essence of the project. Include:
      - Product vision statement (1-2 sentences)
      - Core problem being solved
      - Target audience and market segment
      - Unique value proposition
      - Expected impact and outcomes
    template: |
      **Vision:** {{product_vision}}
      **Problem:** {{core_problem}}
      **Target Users:** {{target_audience}}
      **Value Proposition:** {{unique_value}}
</section>

## Problem Definition

<section>
  - id: problem-statement
    title: Problem Statement
    instruction: |
      Articulate the problem with clarity, evidence, and urgency. Address:
      - Current state analysis and specific pain points
</section>

## Solution Overview

<section>
  - id: proposed-solution
    title: Proposed Solution
    instruction: |
      Describe the solution strategy comprehensively. Include:
      - Solution concept and core mechanics
      - Key features and capabilities
      - Technical approach and architecture
      - Differentiation from competitors
      - Innovation and unique aspects
      - Risk factors and mitigation strategies
    template: |
      ### Solution Concept
      {{solution_description}}
      
      ### Key Differentiators
      {{differentiators_list}}
      
      ### Technical Approach
      {{technical_overview}}
</section>

<section>
  - id: success-metrics
    title: Success Metrics & KPIs
    instruction: |
      Define measurable success criteria. Include:
      - Business metrics (revenue, cost savings, market share)
      - User metrics (adoption, engagement, retention)
      - Technical metrics (performance, reliability, scalability)
      - Quality metrics (NPS, satisfaction scores)
      - Timeline and milestone targets
    sections:
      - id: business-kpis
        title: Business KPIs
        type: metric-list
      - id: user-kpis
        title: User KPIs
        type: metric-list
      - id: technical-kpis
        title: Technical KPIs
        type: metric-list
</section>

## Scope Definition

<section>
  - id: mvp-scope
    title: MVP Scope Definition
    instruction: |
      Define the minimum viable product with precision. Be explicit about boundaries and priorities.
    sections:
      - id: core-features
        title: Core Features (Must Have for Launch)
        type: priority-list
        instruction: List only features absolutely essential for initial value delivery
      - id: nice-to-have
        title: Nice to Have (Post-MVP)
        type: bullet-list
        instruction: Features that enhance value but aren't critical for launch
      - id: out-of-scope
        title: Explicitly Out of Scope
        type: bullet-list
        instruction: Features intentionally excluded from initial releases
      - id: mvp-success-criteria
        title: MVP Success Criteria
        instruction: Define specific, measurable criteria that indicate MVP success
</section>

## Constraints & Considerations

<section>
  - id: constraints
    title: Constraints & Dependencies
    instruction: |
      Identify limitations and dependencies that impact the project:
      - Technical constraints and limitations
      - Resource constraints (budget, team, time)
      - Regulatory and compliance requirements
      - Third-party dependencies
      - Platform and technology constraints
    sections:
      - id: technical-constraints
        title: Technical Constraints
        type: bullet-list
      - id: resource-constraints
        title: Resource Constraints
        type: bullet-list
      - id: dependencies
        title: External Dependencies
        type: risk-list
</section>
