# Specification

## Summary
**Goal:** Let users select a custom currency in the transaction form and ensure add/edit transaction saves succeed with clearer error reporting.

**Planned changes:**
- Add a “Custom” (or “Custom…”) option to the Currency dropdown in the Add/Edit Transaction dialog.
- When “Custom” is selected, show fields to capture a user-defined currency identifier (code/name) and an optional symbol, and require/show the exchange-rate section like other non-INR currencies.
- Ensure the INR preview calculation continues to work for Custom currency using Amount × Exchange Rate.
- Fix the add/update transaction save flow by aligning frontend calls (especially optional fields) with the backend Candid signatures to prevent runtime failures.
- Improve save-failure toasts to include a safe, stringified underlying error message when available, for both add and update flows, while keeping an English summary.

**User-visible outcome:** Users can choose “Custom” currency and enter its details when adding/editing a transaction, successfully save transactions, and see clearer error messages if saving fails.
