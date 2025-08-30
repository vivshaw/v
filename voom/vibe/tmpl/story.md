# User Story Template

<instructions>
    This template guides creation of a detailed user story that provides complete context for developer agents to implement features and QA agents to verify completion. Stories should be self-contained with all necessary information for autonomous execution.
</instructions>

<section>
  - id: status
    title: Story Status
    type: status-tracker
    choices: [Draft, Ready, In Progress, In Review, Testing, Done, Blocked]
    instruction: Track the current status and workflow state
    template: |
      **Current Status:** {{status}}
      **Assigned To:** {{assignee}}
      **Blocked By:** {{blocker_description}}
      **Target Completion:** {{target_date}}
</section>

## Story Definition

<section>
  - id: story
    title: User Story
    type: story-format
    template: |
      **As a** {{role}},
      **I want** {{action}},
      **so that** {{benefit}}.
    instruction: |
      Define the story using standard format. Be specific about:
      - Role: The specific user type or system component
      - Action: The exact functionality or capability needed
      - Benefit: The measurable value or outcome achieved
    examples:
      - "As a player, I want to save my game progress at any checkpoint, so that I can resume playing from that exact position later"
      - "As a system administrator, I want automated health checks every 5 minutes, so that I can detect and resolve issues before users are impacted"
</section>

<section>
  - id: acceptance-criteria
    title: Acceptance Criteria
    type: criteria-checklist
    instruction: |
      Copy acceptance criteria from the PRD and enhance with implementation specifics.
      Each criterion must be:
      - Testable and verifiable
      - Specific and unambiguous
      - Complete (covers happy path, edge cases, errors)
      - Numbered for easy reference in tasks
    template: |
      - [ ] AC1: {{criterion_1}}
      - [ ] AC2: {{criterion_2}}
      - [ ] AC3: {{criterion_3}}
    examples:
      - "AC1: Game saves complete within 2 seconds with visual confirmation"
      - "AC2: Failed saves display error message with retry option"
      - "AC3: Save files are validated for corruption before writing"
</section>

## Implementation Plan

<section>
  - id: dependencies
    title: Dependencies & Prerequisites
    instruction: |
      Identify all dependencies that must be in place before work can begin:
      - Prerequisite stories that must be completed
      - External services or APIs that must be available
      - Design assets that must be provided
      - Technical infrastructure requirements
    sections:
      - id: story-dependencies
        title: Story Dependencies
        type: dependency-list
        template: "Depends on: {{prerequisite_story_ids}}"
      - id: technical-dependencies
        title: Technical Dependencies
        type: requirement-list
        instruction: Libraries, services, infrastructure needed
      - id: design-dependencies
        title: Design Dependencies
        type: asset-list
        instruction: Mockups, assets, specifications needed
</section>

<section>
  - id: tasks-subtasks
    title: Implementation Tasks
    type: task-breakdown
    instruction: |
      Break down the story into specific, actionable tasks for implementation.
      Each task should:
      - Map to specific acceptance criteria (reference AC numbers)
      - Be completable in 30-60 minutes
      - Include clear success criteria
      - Be ordered by dependency
    template: |
      - [ ] **Task 1:** {{task_description}} (AC: {{ac_numbers}})
        - [ ] Subtask 1.1: {{subtask_description}}
        - [ ] Subtask 1.2: {{subtask_description}}
        Success: {{success_criteria}}
        
      - [ ] **Task 2:** {{task_description}} (AC: {{ac_numbers}})
        - [ ] Subtask 2.1: {{subtask_description}}
        Success: {{success_criteria}}
    examples:
      - "Task 1: Implement save game data serialization (AC: 1, 3)"
      - "Task 2: Create save/load UI components (AC: 1, 2)"
      - "Task 3: Add error handling and retry logic (AC: 2)"
</section>

## Technical Context

<section>
  - id: architecture-context
    title: Architecture & Design Context
    instruction: |
      Provide essential technical context from architecture documents.
      Include only information directly relevant to this story.
      This section should eliminate the need to read full architecture docs.
    sections:
      - id: relevant-components
        title: Relevant Components
        type: component-list
        instruction: |
          List existing components/modules this story will interact with:
          - Component name and location
          - Key interfaces or APIs
          - Important constraints or patterns
      - id: patterns-standards
        title: Patterns & Standards
        type: standard-list
        instruction: |
          Document patterns that must be followed:
          - Design patterns (MVC, Observer, etc.)
          - Coding standards specific to this area
          - Error handling patterns
          - Logging requirements
      - id: data-flow
        title: Data Flow
        type: flow-description
        instruction: Describe how data moves through the system for this feature
</section>

<section>
  - id: dev-notes
    title: Developer Notes
    instruction: |
      Critical implementation guidance and context. Include:
      - Specific technical approaches to use or avoid
      - Known gotchas or edge cases to handle
      - Performance considerations
      - Security requirements
      - Integration points with existing code
    sections:
      - id: implementation-approach
        title: Recommended Approach
        instruction: Suggest the technical approach without being prescriptive
      - id: code-locations
        title: Relevant Code Locations
        type: file-list
        instruction: |
          List specific files/modules to reference or modify:
          - File path and purpose
          - Key functions or classes
          - Existing patterns to follow
      - id: constraints-warnings
        title: Constraints & Warnings
        type: warning-list
        instruction: Critical things to avoid or be careful about
</section>

<section>
  - id: testing-requirements
    title: Testing Requirements
    instruction: |
      Define comprehensive testing requirements for this story.
      Testing should validate all acceptance criteria.
    sections:
      - id: unit-tests
        title: Unit Testing
        instruction: |
          Specify unit test requirements:
          - Test file naming and location conventions
          - Coverage requirements (e.g., 80% minimum)
          - Key scenarios that must be tested
          - Mock/stub requirements
        template: |
          **Test Location:** {{test_directory_path}}
          **Naming Convention:** {{test_file_pattern}}
          **Framework:** {{test_framework}}
          **Coverage Target:** {{coverage_percent}}%
      - id: integration-tests
        title: Integration Testing
        instruction: Integration points that need testing
      - id: test-scenarios
        title: Test Scenarios
        type: scenario-list
        instruction: |
          List specific scenarios that must be tested:
          - Happy path scenarios
          - Edge cases
          - Error conditions
          - Performance boundaries
</section>

## Definition of Done

<section>
  - id: done-checklist
    title: Definition of Done
    type: completion-checklist
    instruction: Checklist that must be complete before story is considered done
    template: |
      - [ ] All acceptance criteria met and verified
      - [ ] All tasks and subtasks completed
      - [ ] Code reviewed and approved
      - [ ] Unit tests written and passing ({{coverage_target}}% coverage)
      - [ ] Integration tests passing
      - [ ] Documentation updated (inline code comments, API docs if applicable)
      - [ ] No critical linting errors
      - [ ] Performance benchmarks met
      - [ ] Security review completed (if applicable)
      - [ ] Accessibility requirements met (if applicable)
      - [ ] Deployment ready (migrations, configs, etc.)
</section>

## Implementation Record

<section>
  - id: dev-agent-record
    title: Developer Agent Execution Record
    instruction: This section is populated by the development agent during implementation
    sections:
      - id: agent-info
        title: Agent Information
        template: |
          **Agent Model:** {{agent_model_name_version}}
          **Execution ID:** {{execution_id}}
          **Start Time:** {{start_timestamp}}
          **End Time:** {{end_timestamp}}
          **Total Duration:** {{duration}}
      
      - id: implementation-summary
        title: Implementation Summary
        instruction: Brief summary of what was implemented and how
        
      - id: files-changed
        title: Files Modified
        type: change-list
        instruction: Complete list of files created, modified, or deleted
        template: |
          | File | Change Type | Description |
          |------|-------------|-------------|
          {{file_changes}}        

      
      - id: decisions-made
        title: Technical Decisions
        type: decision-list
        instruction: Document any significant technical decisions made during implementation
        
      - id: issues-encountered
        title: Issues & Resolutions
        type: issue-list
        instruction: Problems encountered and how they were resolved
        
      - id: performance-notes
        title: Performance Considerations
        instruction: Any performance optimizations or concerns noted
        
      - id: security-notes
        title: Security Considerations
        instruction: Security measures implemented or concerns identified
        
      - id: remaining-work
        title: Remaining Work
        instruction: Any work that couldn't be completed or needs follow-up
</section>

## Quality Assurance

<section>
  - id: qa-execution
    title: QA Execution Record
    instruction: This section is populated by the QA agent during verification
    sections:
      - id: qa-agent-info
        title: QA Agent Information
        template: |
          **QA Agent Model:** {{qa_model_name_version}}
          **Review Date:** {{qa_timestamp}}
          **Review Duration:** {{qa_duration}}
      
      - id: acceptance-verification
        title: Acceptance Criteria Verification
        type: verification-checklist
        instruction: Status of each acceptance criterion
        template: |
          | AC # | Description | Status | Notes |
          |------|-------------|--------|-------|
          {{ac_verification_table}}
      
      - id: test-results
        title: Test Execution Results
        template: |
          **Tests Run:** {{total_tests}}
          **Passed:** {{passed_tests}}
          **Failed:** {{failed_tests}}
          **Skipped:** {{skipped_tests}}
          **Coverage:** {{test_coverage}}%
      
      - id: bugs-found
        title: Issues Discovered
        type: bug-list
        instruction: List any bugs or issues found during QA
        template: |
          | Issue | Severity | Description | Status |
          |-------|----------|-------------|--------|
          {{bug_table}}
      
      - id: qa-recommendations
        title: QA Recommendations
        instruction: Suggestions for improvements or follow-up actions
      
      - id: qa-signoff
        title: QA Sign-off
        template: |
          **Status:** {{pass_fail}}
          **Signed By:** {{qa_agent}}
          **Comments:** {{qa_comments}}
</section>

## Notes & Comments

<section>
  - id: additional-notes
    title: Additional Notes
    instruction: Any other relevant information, links, or context
    sections:
      - id: references
        title: References
        type: link-list
        instruction: Links to relevant documentation, designs, or discussions
      - id: future-considerations
        title: Future Considerations
        instruction: Ideas for future enhancements or related work
      - id: lessons-learned
        title: Lessons Learned
        instruction: Key learnings from implementing this story
</section>
