# API Error Triage & Backend AI Handoff Standard

## 1. Mandatory Rule for Every API Error & Endpoint Issue
Whenever an API endpoint fails, returns an error status code, or lacks support for a frontend feature:
1. **Always explicitly identify whether the issue is Frontend, Backend, or Both**.
2. **Always explain the exact fix needed on each side**.
3. **Always output a complete, standalone, ready-to-copy Prompt for the Backend AI Agent / Engineer**.

## 2. Zero Unhandled Crashes
* The frontend must never crash on network or API failures.
* Always wrap API calls with `try / catch` or `Promise.allSettled()`, supply sensible fallback mock data, and alert the user with Sonner toasts.
