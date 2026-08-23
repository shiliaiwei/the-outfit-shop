# OUTFIT Master Workspace Agent Guidelines

## Mandatory Pre-Push & Pre-Merge CI/CD Checkpoint

Before executing any `git push` or `git merge` to any remote or branch:

1. **Strict Typecheck**:
   ```bash
   cd outfit-shop && npx tsc --noEmit
   ```
   Must complete with **0 errors**.

2. **Production Build & Audit**:
   ```bash
   cd outfit-shop && npm run build
   ```
   Must complete with **exit code 0** and successfully generate all 46+ routes.

3. **Referenced Rules**:
   - [.agents/rules/git-workflow.md](.agents/rules/git-workflow.md)
   - [.agents/rules/brand-select-dropdowns.md](.agents/rules/brand-select-dropdowns.md)
   - [.agents/rules/authentication-ui-standards.md](.agents/rules/authentication-ui-standards.md)
   - [.agents/rules/icon-design-standards.md](.agents/rules/icon-design-standards.md)
   - [.agents/skills/liquid-glass-design-system/SKILL.md](.agents/skills/liquid-glass-design-system/SKILL.md)
