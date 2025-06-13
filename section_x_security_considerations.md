```markdown
## Section X: Security Considerations

This section outlines critical security considerations for the Inner DNA Assessment System. Implementing these measures is essential to protect user data, ensure system integrity, and maintain user trust.

### X.1 Data Security & Privacy

Protecting user data, especially Personally Identifiable Information (PII) and sensitive personality assessment results, is paramount.

*   **X.1.1 Data at Rest:**
    *   All user data stored in MongoDB, particularly sensitive profile details (e.g., Enneagram types, assessment answers, results) and any PII, must be encrypted. Consider field-level encryption for granular control or Transparent Data Encryption (TDE) if supported and appropriate for the MongoDB hosting environment.
    *   Encryption keys must be managed securely, separate from the data and application code, using a dedicated key management system.

*   **X.1.2 Data in Transit:**
    *   All communication between the client (browser) and the server, as well as any server-to-server communication (e.g., to external services like email providers), must be encrypted using HTTPS/TLS (TLS 1.2 or higher).
    *   Non-HTTPS traffic should be redirected to HTTPS.

*   **X.1.3 PII Handling:**
    *   **Definition:** PII includes, but is not limited to, email addresses (for login/account management), names (if collected), IP addresses, and any combination of data that could uniquely identify an individual. Personality assessment results, while not traditionally PII, should be treated with equivalent sensitivity.
    *   **Secure Handling:** Access to PII must be strictly controlled and limited to authorized personnel or processes on a need-to-know basis.
    *   **Anonymization/Pseudonymization:** For analytics or research purposes (if planned), user data should be anonymized or pseudonymized to remove direct identifiers. Ensure re-identification is not reasonably possible with the remaining dataset.

*   **X.1.4 Data Retention & Deletion:**
    *   Clear policies for data retention periods must be established. Data should not be kept longer than necessary for its intended purpose or legal requirements.
    *   Users must have the right to request the deletion of their personal data. A secure and verifiable process for data deletion must be implemented.

*   **X.1.5 Compliance (General):**
    *   The system should adhere to general data privacy best practices, drawing from principles found in regulations like GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act). This includes:
        *   **Data Minimization:** Collect only the data essential for the functioning of the assessment and user experience.
        *   **Purpose Limitation:** Use collected data only for the specified purposes communicated to the user.
        *   **Transparency:** Clearly inform users about data collection, usage, and their rights.

### X.2 Authentication & Authorization (Expanding on Sec 1.4 - JWT)

Robust authentication and authorization are critical to ensure only legitimate users can access their data and system functionalities.

*   **X.2.1 JWT Best Practices:**
    *   **Token Storage:** JSON Web Tokens (JWTs) should be stored securely. HttpOnly cookies with `Secure` and `SameSite=Strict` (or `Lax` if cross-site functionality is essential) attributes are preferred over localStorage to mitigate XSS risks.
    *   **Token Expiration:** Implement short-lived access tokens (e.g., 15-60 minutes) and longer-lived refresh tokens (e.g., 7-30 days, or session-based). Refresh tokens should be securely stored (e.g., HttpOnly cookie) and allow for obtaining new access tokens without re-authentication.
    *   **Secure Refresh Mechanisms:** Refresh token rotation should be implemented: upon use, issue a new refresh token and invalidate the used one to detect token theft.
    *   **Strong Signature Algorithms:** Use strong, asymmetric signature algorithms like RS256 (RSA) or EdDSA (Edwards-curve Digital Signature Algorithm) for JWTs, as they are more secure than symmetric algorithms like HS256 if the key were ever compromised on the server. The private key must be securely managed.
    *   **Token Claims:** Include necessary claims like `sub` (subject/user ID), `exp` (expiration time), `iat` (issued at), and `iss` (issuer). Avoid storing sensitive information directly in JWT payloads unless encrypted.

*   **X.2.2 Password Policies:**
    *   For direct email/password registration:
        *   **Strong Passwords:** Enforce minimum length (e.g., 12 characters), complexity (uppercase, lowercase, numbers, symbols). Consider integrating a password strength meter.
        *   **Hashing:** Passwords must be hashed using a strong, salted, and adaptive hashing algorithm (e.g., Argon2, scrypt, or bcrypt). Store only the hash, never the plaintext password.

*   **X.2.3 Social Login (OAuth/OIDC):**
    *   Implement OAuth/OIDC flows securely:
        *   Validate the `state` parameter to prevent CSRF attacks during the authentication flow.
        *   Verify the signature and claims (e.g., `iss`, `aud`) of tokens received from identity providers.
        *   Request only the minimal necessary scopes (e.g., `openid`, `email`, `profile`).
        *   Securely store provider access/refresh tokens if long-term access to provider APIs is needed (encrypt at rest).

*   **X.2.4 Rate Limiting:**
    *   Implement rate limiting on all authentication-related endpoints (login, registration, password reset, token refresh) to protect against brute-force and denial-of-service attacks (as referenced in `server/rateLimiter.ts`).

*   **X.2.5 Access Control:**
    *   Implement role-based access control (RBAC) or permission-based access control on the backend. Even if initially only "user" and "guest" roles exist, a framework for future expansion (e.g., "admin") should be considered.
    *   Ensure users can only access their own data and resources.

### X.3 Input Validation & Output Encoding

Proper input validation and output encoding are crucial to prevent injection attacks and cross-site scripting (XSS).

*   **X.3.1 Server-Side Validation:**
    *   All data received from clients (API requests, form submissions) must be strictly validated on the server before being processed or stored. This includes validation of format, type, length, range, and business rules.
    *   Use allow-lists for validation criteria where possible (i.e., define what is allowed rather than trying to block what is disallowed).
    *   Utilize established validation libraries to ensure comprehensive checks.

*   **X.3.2 Frontend Validation:**
    *   Frontend validation should be implemented for user experience improvement (immediate feedback) but must not be relied upon as a security measure. All security-critical validation occurs server-side.

*   **X.3.3 Protection Against Injection:**
    *   **NoSQL Injection:** For MongoDB interactions, use Object Data Mappers (ODMs like Mongoose) or parameterized queries/prepared statements if the driver supports them. Avoid constructing database queries by concatenating user-supplied strings. Sanitize inputs where dynamic query construction is unavoidable.
    *   **Cross-Site Scripting (XSS):** Implement measures described in X.3.4 (Output Encoding) and X.4.3 (Content Security Policy).

*   **X.3.4 Output Encoding:**
    *   All data that originates from users or the database and is displayed in the UI must be context-aware output encoded.
    *   Use capabilities of the frontend framework (e.g., React's default JSX encoding) to prevent XSS. When directly manipulating the DOM or rendering HTML from data, use appropriate encoding libraries or techniques for HTML attributes, HTML content, JavaScript contexts, and CSS contexts.

### X.4 API Security

Protecting API endpoints is vital as they are the primary interface for data exchange.

*   **X.4.1 Endpoint Authorization:**
    *   Ensure all API endpoints, especially those that handle sensitive data or perform state-changing actions, implement robust authorization checks after successful authentication. Verify that the authenticated user has the necessary permissions to perform the requested operation on the target resource.

*   **X.4.2 CSRF Protection:**
    *   If cookie-based authentication is used (including for refresh tokens stored in cookies), implement Cross-Site Request Forgery (CSRF) protection for all state-changing requests (POST, PUT, DELETE). This typically involves using anti-CSRF tokens (e.g., double submit cookie pattern, synchronizer token pattern).

*   **X.4.3 Secure Headers:**
    *   Implement the following HTTP security headers to provide an additional layer of defense:
        *   `Content-Security-Policy` (CSP): Define a strict CSP to mitigate XSS and data injection attacks by specifying allowed sources for scripts, styles, images, etc. Start with a restrictive policy and gradually open it as needed.
        *   `Strict-Transport-Security` (HSTS): `Strict-Transport-Security: max-age=<seconds>; includeSubDomains` to enforce HTTPS usage.
        *   `X-Content-Type-Options: nosniff`: Prevents browsers from MIME-sniffing responses away from the declared content type.
        *   `X-Frame-Options: DENY` or `SAMEORIGIN`: Protects against clickjacking attacks.
        *   `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer`: Controls how much referrer information is sent.
        *   `Permissions-Policy` (formerly `Feature-Policy`): Restrict usage of sensitive browser features if not needed.

### X.5 Server-Side Security (Node.js/Express context)

Server-side components must be hardened to prevent compromise.

*   **X.5.1 Dependency Management:**
    *   Regularly scan server-side dependencies (e.g., using `npm audit`, Snyk, or GitHub Dependabot) for known vulnerabilities.
    *   Update dependencies promptly, especially those with security patches. Prioritize updates based on vulnerability severity.

*   **X.5.2 Secure Logging:**
    *   Implement comprehensive logging for security-relevant events (e.g., successful/failed login attempts, significant errors, access control decisions, administrative actions).
    *   Avoid logging sensitive data such as passwords, full session tokens, or excessive PII in plaintext. If necessary, sensitive data in logs should be masked or encrypted.
    *   Protect log files from unauthorized access or modification.

*   **X.5.3 Error Handling:**
    *   Ensure that server-side errors do not expose sensitive system information, stack traces, or debugging details to the client.
    *   Return generic error messages to the client (e.g., "An internal server error occurred") while logging detailed error information on the server for diagnostics.

*   **X.5.4 Principle of Least Privilege:**
    *   The Node.js application process should run with the minimum necessary permissions required for its operation. Avoid running as root. Use a dedicated, unprivileged user account.
    *   Database credentials used by the application should also have the minimum necessary permissions.

### X.6 Development & Deployment Security Practices

Security must be integrated throughout the software development lifecycle (SDLC).

*   **X.6.1 Secrets Management:**
    *   All secrets (API keys, database credentials, JWT signing keys, OAuth client secrets) must be managed securely.
    *   Use environment variables for injecting secrets into the application at runtime.
    *   For production environments, consider using a dedicated secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
    *   Never hardcode secrets directly into the source code or commit them to version control.

*   **X.6.2 Code Reviews:**
    *   Incorporate security considerations into the code review process. Reviewers should look for common vulnerabilities (OWASP Top 10) and adherence to secure coding practices.
    *   Consider using static application security testing (SAST) tools to automatically identify potential vulnerabilities in code.

*   **X.6.3 Regular Security Audits:**
    *   Conduct periodic security testing, such as vulnerability assessments and penetration testing, especially before major releases or after significant architectural changes.
    *   Engage third-party security specialists for comprehensive audits if resources permit.

*   **X.6.4 HTTPS by Default in All Environments:**
    *   Use HTTPS in all environments, including development and staging, not just production. This helps identify mixed content issues early and ensures consistency. Use self-signed certificates for local development if necessary.
```
