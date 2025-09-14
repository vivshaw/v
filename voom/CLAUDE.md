# VOOM - Browser-Based DOOM Clone

Open-source DOOM clone built in TypeScript, running entirely in the browser. No backend required.

## Project Setup

- **Package Manager**: yarn
- **Assets**: All sprites/textures in @assets/ (public domain only)
- **Agents**: Use Claude ProjectManager and Dev agents as necessary
- **Tech Stack**: TypeScript and Vite, reference @vibe/technical.md for tech stack

## Universal Rules

1. **Quality Gates**

   - Code must typecheck before task completion
   - All tests must pass - no exceptions
   - Run `yarn typecheck` and `yarn test` after changes

2. **Implementation Standards**

   - Build complete features - no "TODO: implement later" comments
   - Use existing patterns from codebase
   - Prefer editing files over creating new ones

3. **File Management**
   - Check if files exist before creating
   - Follow existing directory structure
