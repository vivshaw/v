# Product Requirements Document (PRD) Template

<instructions>
   This template guides creation of a comprehensive Product Requirements Document including detailed requirements, technical specifications, and a structured list of epics with user stories that will guide execution.
</instructions>

## Product Vision & Goals

<section>
  - id: goals-context
    title: Goals and Background Context
    instruction: |
      Review the project brief from @docs/brief.md and synthesize the key information. This section establishes the foundation for all requirements and scope decisions.
    sections:
      - id: vision-statement
        title: Product Vision
        type: statement
        instruction: One compelling sentence that captures the ultimate aspiration for this product
      - id: goals
        title: Strategic Goals
        type: priority-list
        instruction: |
          Prioritized list of measurable outcomes the product will deliver:
          - Business goals (revenue, cost reduction, market position)
          - User goals (problems solved, value delivered)
          - Technical goals (platform capabilities, scalability targets)
        examples:
          - "Increase user engagement by 40% through gamification mechanics"
          - "Reduce development cycle time by 50% with automated workflows"
          - "Achieve sub-100ms response times for 95% of API calls"
      - id: background
        title: Background & Market Context
        type: structured-content
        instruction: |
          Provide essential context in 2-3 concise paragraphs covering:
          - Problem landscape and current solutions
          - Market opportunity and timing
          - Competitive positioning
          - Key insights from user research
</section>

## Requirements Specification

<section>
  - id: requirements
    title: Product Requirements
    instruction: |
      Define comprehensive requirements that translate goals into specific capabilities. Requirements should be:
      - Testable and verifiable
      - Traced to specific goals
      - Prioritized (P0/P1/P2)
      - Include rationale for each requirement
    elicit: true
    sections:
      - id: functional
        title: Functional Requirements
        type: structured-list
        prefix: FR
        instruction: |
          Core functionality the system must provide. Each requirement includes:
          - Unique identifier (FR###)
          - Clear description
          - Priority (P0=Must Have, P1=Should Have, P2=Nice to Have)
          - Acceptance criteria
          - Related epic/story reference
        template: |
          **{{id}}:** {{description}}
          - **Priority:** {{priority}}
          - **Rationale:** {{rationale}}
          - **Acceptance:** {{acceptance_criteria}}
          - **Epic:** {{epic_reference}}
        examples:
          - "FR001: Users must be able to create and manage multiple game saves with automatic cloud sync [P0]"
          - "FR002: System must support real-time multiplayer with up to 4 concurrent players [P1]"
      - id: non-functional
        title: Non-Functional Requirements
        type: structured-list
        prefix: NFR
        instruction: |
          Quality attributes and constraints. Categories include:
          - Performance (response time, throughput)
          - Scalability (user limits, data volumes)
          - Security (authentication, authorization, data protection)
          - Reliability (uptime, fault tolerance)
          - Usability (accessibility, learning curve)
          - Compatibility (browsers, devices, integrations)
        template: |
          **{{id}}:** {{description}}
          - **Category:** {{category}}
          - **Target:** {{measurable_target}}
          - **Verification:** {{how_to_verify}}
        examples:
          - "NFR001: Page load time must be under 2 seconds on 3G connections [Performance]"
          - "NFR002: System must maintain 99.9% uptime excluding scheduled maintenance [Reliability]"
          - "NFR003: Application must meet WCAG 2.1 AA accessibility standards [Usability]"
</section>

## User Experience Design

<section>
  - id: ui-goals
    title: User Interface & Experience Goals
    instruction: |
      Define the user experience vision and design principles that will guide implementation.
      This is not detailed design specs but strategic direction for the design team.
    sections:
      - id: design-principles
        title: Design Principles
        type: principle-list
        instruction: Core principles that guide all design decisions
        examples:
          - "Minimalist: Every element must justify its presence"
          - "Responsive: Seamless experience across all devices"
          - "Accessible: Usable by everyone regardless of ability"
      - id: user-flows
        title: Key User Flows
        type: flow-list
        instruction: |
          Critical user journeys that must be optimized:
          - Entry points and onboarding
          - Core task completion paths
          - Error recovery flows
        template: |
          **{{flow_name}}:**
          - Start: {{entry_point}}
          - Steps: {{key_steps}}
          - Success: {{success_state}}
          - Fallback: {{error_handling}}
      - id: interaction-patterns
        title: Interaction Patterns
        type: pattern-list
        instruction: Consistent interaction patterns across the product
      - id: visual-direction
        title: Visual Direction
        type: descriptive
        instruction: High-level visual style and brand alignment
</section>

## Technical Architecture

<section>
  - id: technical-assumptions
    title: Technical Architecture & Constraints
    instruction: |
      Document all technical decisions that constrain implementation. These become requirements for the development team.
      Check for existing technical preferences in project documentation.
    sections:
      - id: architecture-overview
        title: System Architecture
        instruction: |
          Define the high-level technical architecture:
          - Service architecture pattern (Monolith, Microservices, Serverless, Hybrid)
          - Data architecture (databases, caching, queuing)
          - Integration architecture (APIs, events, messaging)
        template: |
          **Pattern:** {{architecture_pattern}}
          **Rationale:** {{why_this_architecture}}
          **Key Components:**
          {{component_list}}
      - id: technology-stack
        title: Technology Stack
        type: stack-definition
        instruction: Specify all technology choices with rationale
        template: |
          **Frontend:**
          - Framework: {{frontend_framework}}
          - State Management: {{state_solution}}
          - Styling: {{styling_approach}}
          
          **Backend:**
          - Runtime: {{backend_runtime}}
          - Framework: {{backend_framework}}
          - Database: {{database_choice}}
          
          **Infrastructure:**
          - Hosting: {{hosting_platform}}
          - CI/CD: {{cicd_tools}}
          - Monitoring: {{monitoring_stack}}
      - id: development-standards
        title: Development Standards
        sections:
          - id: code-standards
            title: Code Standards
            type: standard-list
            instruction: Coding conventions, linting rules, formatting standards
          - id: testing-requirements
            title: Testing Strategy
            instruction: |
              Define comprehensive testing approach:
              - Unit testing coverage targets
              - Integration testing scope
              - E2E testing requirements
              - Performance testing thresholds
              - Security testing requirements
            template: |
              **Coverage Target:** {{coverage_percent}}%
              **Testing Levels:** {{testing_pyramid}}
              **Automation:** {{automation_approach}}
          - id: documentation-standards
            title: Documentation Requirements
            type: requirement-list
            instruction: Code documentation, API docs, user guides
      - id: constraints
        title: Technical Constraints & Dependencies
        instruction: Hard constraints that must be respected
        sections:
          - id: platform-constraints
            title: Platform Constraints
            type: constraint-list
            examples:
              - "Must run in modern browsers (Chrome 90+, Firefox 88+, Safari 14+)"
              - "Backend must deploy to AWS Lambda with 512MB memory limit"
          - id: integration-requirements
            title: Integration Requirements
            type: integration-list
            instruction: Third-party services, APIs, and libraries
          - id: performance-budgets
            title: Performance Budgets
            type: budget-table
            template: |
              | Metric | Budget | Measurement Point |
              |--------|--------|------------------|
              {{performance_budgets}}
</section>

## Implementation Roadmap

<section>
  - id: epic-list
    title: Epic Overview
    instruction: |
      High-level epic list showing the implementation sequence. Epics should:
      - Represent major feature areas or capabilities
      - Be ordered by priority and dependencies
      - Include rough effort estimates
      - Map to business goals
    template: |
      | # | Epic Title | Goal Alignment | Priority | Estimated Stories | Dependencies |
      |---|------------|---------------|----------|-------------------|--------------|
      {{epic_overview_table}}
</section>

<section>
  - id: epic-details
    title: Epic {{epic_number}}: {{epic_title}}
    repeatable: true
    instruction: |
      Detailed breakdown of each epic into user stories with acceptance criteria.
      
      CRITICAL REQUIREMENTS FOR STORY CREATION:
      - Stories must be sequenced logically with clear dependencies
      - Each story delivers a complete "vertical slice" of functionality
      - Stories are sized for 2-4 hour implementation sessions
      - Focus on "what" not "how" - leave implementation details to developers
      - Every story must deliver clear user or business value
    sections:
      - id: epic-overview
        title: Epic Overview
        template: |
          **Goal:** {{epic_goal}}
          **Value Proposition:** {{epic_value}}
          **Success Metrics:** {{epic_metrics}}
          **Dependencies:** {{epic_dependencies}}
      - id: story
        title: Story {{epic_number}}.{{story_number}}: {{story_title}}
        repeatable: true
        template: |
          **As a** {{user_type}},
          **I want** {{action}},
          **so that** {{benefit}}.
          
          **Priority:** {{story_priority}}
          **Effort:** {{story_points}} points
          **Dependencies:** {{prerequisite_stories}}
        sections:
          - id: acceptance-criteria
            title: Acceptance Criteria
            type: criteria-list
            instruction: |
              Define precise, testable criteria that determine story completion:
              - Functional behavior specifications
              - Edge cases and error handling
              - Performance requirements
              - UI/UX requirements where applicable
              - Data validation rules
              - Security considerations
            template: "AC{{number}}: {{criterion}}"
            examples:
              - "AC1: User can save game progress with confirmation message displayed within 500ms"
              - "AC2: System prevents saving when disk space is below 100MB and shows appropriate error"
              - "AC3: Saved games are encrypted using AES-256 before storage"
          - id: technical-notes
            title: Technical Considerations
            type: note-list
            instruction: Important technical context without prescribing implementation
          - id: design-requirements
            title: Design Requirements
            type: requirement-list
            instruction: Specific design assets or patterns needed for this story
</section>

## Appendices

<section>
  - id: design-assets
    title: Design Asset Requirements
    instruction: Comprehensive list of design deliverables needed
    sections:
      - id: ui-components
        title: UI Components
        type: component-list
        instruction: Reusable components and patterns
      - id: screens
        title: Screen Designs
        type: screen-list
        instruction: Complete list of screens/views needed
      - id: assets
        title: Visual Assets
        type: asset-list
        instruction: Icons, images, animations, etc.
      - id: content
        title: Content Requirements
        type: content-list
        instruction: Copy, messaging, help text
</section>

<section>
  - id: glossary
    title: Glossary
    instruction: Define project-specific terms and acronyms
    type: definition-list
    template: |
      **{{term}}:** {{definition}}
</section>

<section>
  - id: references
    title: References & Resources
    instruction: Links to supporting documents, research, and tools
    sections:
      - id: internal-docs
        title: Internal Documents
        type: link-list
      - id: external-resources
        title: External Resources
        type: link-list
      - id: tools
        title: Tools & Platforms
        type: tool-list
</section>