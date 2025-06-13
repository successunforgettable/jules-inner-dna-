## Version Control (Git) Setup & Branching Strategy

Effective version control is fundamental to collaborative and organized development. This section outlines the Git repository setup and branching strategy for the Inner DNA Assessment System.

### 1. Git Repository Initialization

*   **Initialization:** A Git repository will be initialized at the root of the monorepo (`inner-dna-app/`). This can be done using the command `git init`.
*   **Initial Commit:** The first commit should include the initial project structure, configuration files (e.g., root `package.json`, `pnpm-workspace.yaml`), and a preliminary `.gitignore` file.

*   **`.gitignore` File:** A comprehensive `.gitignore` file will be created at the root of the monorepo to exclude unnecessary files and directories from version control. Its content should include:

    ```gitignore
    # Dependencies
    node_modules/
    **/node_modules/

    # Build artifacts
    dist/
    **/dist/
    build/
    **/build/
    .vite/
    coverage/

    # Log files
    *.log
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    pnpm-debug.log*

    # Environment variables
    .env
    .env.*
    !.env.example
    # (allow .env.example for template sharing, but ignore actual .env files)

    # OS-specific files
    .DS_Store
    Thumbs.db

    # Editor-specific files
    .idea/
    .vscode/
    *.suo
    *.ntvs*
    *.njsproj
    *.sln
    *.sw?

    # Test results (if applicable and not stored elsewhere)
    junit.xml
    test-results/

    # Next.js specific (if ever considered, good to have)
    # .next/
    # out/
    ```

### 2. Branching Strategy: Gitflow Model

A Gitflow-based branching model is recommended to manage the development lifecycle effectively. This provides a robust framework for feature development, releases, and hotfixes.

*   **`main` Branch:**
    *   This branch represents the official production-ready code.
    *   It should always be stable and deployable.
    *   Direct commits to `main` are prohibited.
    *   Code gets into `main` by merging `release` branches or `hotfix` branches.
    *   Each commit on `main` should be tagged with a version number (e.g., `v1.0.0`, `v1.0.1`).

*   **`develop` Branch:**
    *   This is the primary integration branch for ongoing development. All completed features and non-hotfix bug fixes are merged into `develop`.
    *   It should ideally be stable enough for internal releases or QA, but it's where the latest development changes reside.
    *   Nightly builds or CI/CD processes may be run against this branch.

*   **`feature/<feature-name>` Branches:**
    *   **Purpose:** For developing new features or specific modules (e.g., `feature/auth-setup`, `feature/phase1-foundation-stones`, `feature/results-visualization`).
    *   **Branched from:** `develop`.
    *   **Merged into:** `develop` (typically via a Pull/Merge Request after code review and successful tests).
    *   **Naming:** Use descriptive names, potentially including an issue tracker ID (e.g., `feature/PROJ-123-user-profile`).
    *   These branches are local to developers or shared for collaborative feature work and should be deleted after merging.

*   **`release/<version>` Branches:**
    *   **Purpose:** To prepare for a new production release. This branch is used for final testing, last-minute bug fixes, and updating documentation or version numbers. No new features are added here.
    *   **Branched from:** `develop` (when `develop` has reached a stable point with all features for the planned release).
    *   **Merged into:** `main` (once ready for production, this merge is tagged with the release version) AND back into `develop` (to ensure any fixes made in the release branch are incorporated into future development).
    *   **Naming:** Typically named after the version being released (e.g., `release/v1.0.0`, `release/v1.1.0`).
    *   This branch exists only during the release preparation phase.

*   **`hotfix/<issue-description-or-id>` Branches:**
    *   **Purpose:** To address critical bugs discovered in the production version (`main` branch) that require immediate fixing.
    *   **Branched from:** `main` (from the specific tagged version where the bug exists).
    *   **Merged into:** `main` (this merge is tagged with a new patch version, e.g., `v1.0.1`) AND back into `develop` (to ensure the hotfix is included in ongoing development).
    *   **Naming:** Use descriptive names indicating the fix (e.g., `hotfix/login-issue`, `hotfix/PROJ-456-critical-payment-bug`).

### 3. Commit Strategy

*   **Atomic Commits:** Each commit should represent a single logical change. This makes it easier to understand changes, review code, and revert if necessary.
*   **Conventional Commit Messages:** Adopting a convention for commit messages is highly recommended for clarity and to enable automated changelog generation or semantic versioning if desired. A common format is:
    ```
    <type>(<scope>): <subject>

    <body>

    <footer>
    ```
    *   **Examples:**
        *   `feat(auth): implement JWT generation for user login`
        *   `fix(stones): correct selection logic for foundation phase`
        *   `docs(gds): update color token definitions in variables.css`
        *   `refactor(server): improve error handling in assessment controller`
        *   `chore(deps): upgrade express to v4.18.2`
        *   `test(client): add unit tests for PrimaryButton component`

This structured approach to version control will help maintain a clean and manageable codebase throughout the project lifecycle.
