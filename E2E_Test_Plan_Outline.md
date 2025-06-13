# Inner DNA: End-to-End Test Plan Outline

This document outlines the end-to-end (E2E) testing strategy for the Inner DNA application.

## 1. Authentication & User Account Management

### 1.1. User Registration
    - **TC1.1.1:** Successful registration with valid, unique credentials.
        - Expected: User account created, user potentially auto-logged in or redirected to login.
    - **TC1.1.2:** Attempt registration with an existing email.
        - Expected: Appropriate error message displayed, no new account created.
    - **TC1.1.3:** Attempt registration with invalid email format.
        - Expected: Validation error message for email field.
    - **TC1.1.4:** Attempt registration with password not meeting complexity/length requirements.
        - Expected: Validation error message for password field.
    - **TC1.1.5:** Attempt registration with mismatched password and confirm password fields (if applicable).
        - Expected: Validation error.

### 1.2. User Login
    - **TC1.2.1:** Successful login with valid credentials.
        - Expected: User logged in, redirected to dashboard/assessment start, token received.
    - **TC1.2.2:** Attempt login with invalid password.
        - Expected: Appropriate error message.
    - **TC1.2.3:** Attempt login with non-existent email.
        - Expected: Appropriate error message.
    - **TC1.2.4:** Attempt login with empty email or password.
        - Expected: Validation error.

### 1.3. User Logout
    - **TC1.3.1:** Successful logout for an authenticated user.
        - Expected: User logged out, session/token cleared, redirected to home/login page.

### 1.4. Password Reset Flow (If Implemented)
    - **TC1.4.1:** Request password reset for an existing email.
        - Expected: Success message, email sent (verify email content if possible).
    - **TC1.4.2:** Attempt password reset for a non-existent email.
        - Expected: Generic success/error message to prevent user enumeration.
    - **TC1.4.3:** Use password reset link (valid and expired/invalid).
        - Expected: Valid link allows password change; invalid link shows error.
    - **TC1.4.4:** Successfully change password via reset link.
        - Expected: Password updated, user can log in with new password.

### 1.5. Protected Route Access
    - **TC1.5.1:** Attempt to access assessment phases (e.g., `/assessment/foundation`) when not logged in.
        - Expected: Redirected to login page or appropriate error displayed.
    - **TC1.5.2:** Attempt to access results page (e.g., `/assessment/results`) when not logged in.
        - Expected: Redirected to login page or appropriate error.
    - **TC1.5.3:** Access protected routes successfully after login.
        - Expected: Page loads correctly.

## 2. Core Assessment Flow

*(These tests should be repeated for scenarios designed to result in different Enneagram types to ensure comprehensive coverage of calculations and content display, e.g., Type 1, Type 4, Type 9 outcomes)*

### 2.1. Welcome Page
    - **TC2.1.1:** Verify all key UI elements are present (logo, tagline, hero image/animation, CTA buttons).
    - **TC2.1.2:** Click "Start Assessment" (or similar CTA).
        - Expected (if not logged in): Redirect to login/registration or prompt to do so.
        - Expected (if logged in): Navigate to the first phase of the assessment (Foundation Stones).
    - **TC2.1.3:** (If applicable) "Learn More" or scroll-to-feature links function correctly.

### 2.2. Phase 1: Foundation Stones
    - **TC2.2.1:** Select one stone from each of the 9 sets.
        - Expected: Selections are visually indicated, progress updates.
    - **TC2.2.2:** Attempt to select more than one stone per set.
        - Expected: Not possible, or previous selection is replaced.
    - **TC2.2.3:** Attempt to proceed without selecting a stone in a set.
        - Expected: Prevented, or error message displayed.
    - **TC2.2.4:** After 9 selections, verify correct Enneagram Core Type is determined (requires oracle/known input-output).
        - Expected: Core type displayed or used for next phase.
    - **TC2.2.5:** Navigate to Phase 2 (Building Blocks).
        - Expected: Smooth transition, correct data (core type) passed.

### 2.3. Phase 2: Building Blocks
    - **TC2.3.1:** Based on determined Core Type, select one block from each of the 4 pairs.
        - Expected: Selections visually indicated.
    - **TC2.3.2:** Verify correct Wing and Arrow points (Growth/Stress) are determined based on selections.
    - **TC2.3.3:** Navigate to Phase 3 (Color Palettes).
        - Expected: Smooth transition.

### 2.4. Phase 3: Color Palettes
    - **TC2.4.1:** Select exactly two color palettes.
        - Expected: Selections visually indicated. Distribution slider appears.
    - **TC2.4.2:** Attempt to select fewer or more than two palettes before slider interaction.
        - Expected: Prevented or handled gracefully.
    - **TC2.4.3:** Input distribution percentages (e.g., 70/30, 50/50).
        - Expected: Input accepted, total auto-adjusts or validates to 100%.
    - **TC2.4.4:** Verify correct Operating State Focus analysis based on selections and distribution.
    - **TC2.4.5:** Navigate to Phase 4 (Detail Elements).
        - Expected: Smooth transition.

### 2.5. Phase 4: Detail Elements
    - **TC2.5.1:** Distribute all 10 tokens into the 3 subtype containers.
        - Expected: Visual feedback of token placement, count updates.
    - **TC2.5.2:** Attempt to distribute more than 10 tokens.
        - Expected: Prevented.
    - **TC2.5.3:** Attempt to proceed with fewer than 10 tokens distributed.
        - Expected: Prevented or error message.
    - **TC2.5.4:** Verify correct Instinctual Stacking determined.
    - **TC2.5.5:** Navigate to submit/results.
        - Expected: Smooth transition.

### 2.6. General Assessment Flow
    - **TC2.6.1:** (If applicable) Start an assessment, close the browser/tab, reopen and log back in.
        - Expected: Assessment state is persisted, user can continue from where they left off.
    - **TC2.6.2:** Verify smooth visual transitions and animations between phases and selections (no jank).
    - **TC2.6.3:** Use "Previous" navigation buttons to go back and change selections; verify subsequent calculations update correctly.

## 3. Assessment Profile Submission

### 3.1. Successful Submission
    - **TC3.1.1:** After completing all phases, click "Submit" or "View Results".
        - Expected: `isSubmittingProfile` state true, loading indicator shown.
        - Expected: Successful API call to `/api/assessment/profile` (POST).
        - Expected: Client navigates to Results Page.
    - **TC3.1.2:** Verify (via DB check or subsequent fetch) that all selections (Foundation, Blocks, Colors, Tokens) and determined traits (Core Type, Wing, Arrows, State Focus, Instinctual Stack) are correctly saved in the user's `AssessmentProfile`.

### 3.2. Submission Errors
    - **TC3.2.1:** Simulate network error during submission.
        - Expected: Client displays appropriate error message (e.g., from `submissionError` state). Loading indicator stops.
    - **TC3.2.2:** Simulate server-side error (500) during submission.
        - Expected: Client displays appropriate error message.
    - **TC3.2.3:** Simulate validation error from backend (e.g., invalid data format if possible).
        - Expected: Client displays specific error if provided, or generic error.

## 4. Results Page Display

### 4.1. Profile Fetching
    - **TC4.1.1:** Navigate to Results Page directly by a user with a completed profile.
        - Expected: `fetchUserProfile` action triggered, loading state shown.
        - Expected: Profile data fetched successfully and displayed.
    - **TC4.1.2:** Navigate to Results Page by a user with no completed profile.
        - Expected: Message "Please complete the assessment..." or redirect.
    - **TC4.1.3:** Simulate error during profile fetch.
        - Expected: Appropriate error message displayed.

### 4.2. Dynamic Tower Visualization
    - **TC4.2.1 (for each core type):** Verify foundation color matches `determinedCoreType.colorHex`.
    - **TC4.2.2 (for various wing outcomes):** Verify visual representation of the wing (if any distinct visual).
    - **TC4.2.3 (for various arrow outcomes):** Verify visual representation of arrows (if any).
    - **TC4.2.4 (for various color selections/distributions):** Verify tower layers reflect chosen state colors/gradients correctly.
    - **TC4.2.5 (for various token distributions):** Verify detail elements/accents correctly represent the instinctual stacking.

### 4.3. Written Report Sections
    - **TC4.3.1 (for each core type):** Verify "Core Type Analysis" section displays correct description, fear, desire, motto, etc., from `EnneagramType` seed data.
    - **TC4.3.2 (for representative wing combinations):** Verify "Wing Influence" section displays correct name, description, strengths, challenges from `Wing` seed data.
    - **TC4.3.3 (for each core type):** Verify "Arrows" section displays correct stress/growth type numbers and descriptions from `Arrow` seed data.
    - **TC4.3.4 (for representative state selections):** Verify "Operating States" section displays correct state names, type-specific descriptions (for user's core type), and distribution from `OperatingState` seed data and user profile.
    - **TC4.3.5 (for representative instinctual stackings):** Verify "Instinctual Variant Stack" section displays correct stack name, primary/secondary/blind instincts, general description, and type-specific subtype name/description for the user's core type from `InstinctualStacking` seed data.
    - **TC4.3.6:** Verify placeholder replacements (e.g., `[Primary Type]`) are correctly filled.

## 5. Content Verification (Driven by Seed Data)

*(This overlaps with 4.3 but focuses on systematic content checking)*
    - **TC5.1.1 - TC5.1.9 (for each Enneagram Type 1-9):**
        - During Foundation phase, ensure stone prompts are accurate (if type-specific).
        - On Results Page, verify all fields from `EnneagramType` schema are correctly displayed in relevant sections.
    - **TC5.2.1 - TC5.2.18 (for each Wing combination):**
        - Verify `name`, `description`, `strengths`, `challenges` on Results Page.
    - **TC5.3.1 - TC5.3.9 (for each Arrow set):**
        - Verify `stressDescription`, `growthDescription` on Results Page.
    - **TC5.4.1 - TC5.4.X (for each Operating State and each Type):**
        - Verify type-specific descriptions on Results Page.
    - **TC5.5.1 - TC5.5.X (for each Instinctual Stacking and each Type):**
        - Verify type-specific subtype names and descriptions on Results Page.

## 6. Responsiveness & UI

### 6.1. Visual Layout
    - **TC6.1.1 (Desktop):** Test all pages on a standard desktop resolution (e.g., 1920x1080, 1440x900). Verify layout integrity, no overlaps, all elements accessible.
    - **TC6.1.2 (Tablet):** Test all pages on tablet resolutions/emulators (e.g., 768x1024, iPad). Verify responsive layout changes, touch target sizes.
    - **TC6.1.3 (Mobile):** Test all pages on mobile resolutions/emulators (e.g., 375x667, 414x896). Verify mobile-specific layouts, navigation (e.g., hamburger menu), readability.

### 6.2. UI Consistency
    - **TC6.2.1:** Spot-check various pages for adherence to GDS (typography, colors, spacing, button styles, etc.).
    - **TC6.2.2:** Verify interactive elements (buttons, inputs, custom selectors) have consistent hover, focus, and active states.

## 7. Error Handling & Edge Cases

### 7.1. API Failures
    - **TC7.1.1:** Test behavior when `contentService` calls fail (e.g., fetching Enneagram Type details for Results Page).
        - Expected: Graceful error message, no app crash.
    - **TC7.1.2:** Test behavior when `assessmentService.saveAssessmentProfile` fails (covered in 3.2).
    - **TC7.1.3:** Test behavior when `assessmentService.getAssessmentProfile` fails (covered in 4.1).

### 7.2. Unexpected Data
    - **TC7.2.1:** (Difficult to test E2E without backend manipulation) Test how client handles missing optional fields in API responses if possible.
        - Expected: No crashes, sensible fallbacks or hidden sections.

### 7.3. Navigation Issues
    - **TC7.3.1:** Attempt to manually navigate to assessment URLs in a non-logical order (e.g., Phase 3 before Phase 1).
        - Expected: Redirect to current valid phase, or to start, or an error message.
    - **TC7.3.2:** Use browser back/forward buttons extensively during assessment.
        - Expected: State remains consistent, or app correctly handles navigation.

---

This outline provides a comprehensive starting point. Specific test cases with detailed steps, expected results, and preconditions would be derived from this for actual test execution.Successfully created `E2E_Test_Plan_Outline.md`.

Now, I will create the `Potential_Refinement_Areas.md` list.
