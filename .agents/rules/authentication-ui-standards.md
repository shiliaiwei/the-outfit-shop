# Authentication & Login UI Standards

## 1. Permanent Ban on Auto-Login & Quick-Credential Shortcuts
- **Strict Rule:** Never render auto-login shortcuts, "Quick 1-Click Role Login" buttons, "Demo Sign-in" chips, or "Or Manual Credentials" dividing labels in authentication interfaces.
- **Form Purity:** All login forms must present clean, unpolluted input fields without hardcoded dummy default values (`username: ""` and `password: ""`).

## 2. Professional Full-Word Typography & Phrasing
- **No Incomplete Words:** Always use full, clear English words rather than abbreviations or developer jargon.
- **Required Label & Field Wording:**
  - Label: `Username or Email Address` (not `Username / Email` or `User`)
  - Placeholder: `e.g. administrator or user@outfit.tech`
  - Label: `Security Password` (not `Passcode` or `Pass`)
  - Placeholder: `Enter your security password`
  - Action Button: `Authenticate and Sign In` (not `Sign in` or `Quick Log`)
  - Header Subtitle: `Enter your authorized username or email address and password to access the platform.`

## 3. Graceful Background Fallback Architecture
- Authentication handlers in `authService` must transparently resolve session tokens for development without displaying test buttons or exposing credentials on the UI surface.
