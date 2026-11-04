# Mobile layout update

- Fluid authentication, profile, discovery, connection and request cards with smaller phone padding.
- Feed navigation stacks below the card on phones.
- Compact account header and viewport-contained menu with larger tap targets.
- Footer flows after content instead of covering forms and chat controls.
- Phone chat separates the connection list from the conversation, with an All conversations link; desktop retains the sidebar.
- Conversation uses dynamic viewport sizing and a scrollable message region, with the composer outside that region.
- Long profile text, skills and messages wrap; form controls use 16px text.

Validation: production frontend build and focused Chat.jsx ESLint passed. Browser checks used temporary local API fixtures with long names, skills, biographies and messages; no database records were changed. Signup, feed, profile, connections, requests, inbox and conversation were checked at 320, 390, 768 and 1280 viewport widths with no document horizontal overflow. Mobile conversation navigation and account menu bounds were also checked. Physical phone keyboards and the deployed Vercel site have not been verified.

Vercel must deploy the mobile layout commit before these changes appear on the live site.
