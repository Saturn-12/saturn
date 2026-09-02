# IdeaVault persistence status

IdeaVault now supports two persistence paths without changing its visual identity. Authenticated users use the project database through protected tRPC procedures. Visitors who do not sign in use a local guest vault backed by browser localStorage.

| Area | Status |
|---|---|
| Existing light pink IdeaVault design preserved | Complete |
| Database-enabled full-stack scaffold | Complete |
| User-owned ideas, statuses, stars, resources, images, and board positions schema | Complete |
| User-owned Connections schema and procedures | Complete |
| Typed Drizzle helpers and protected tRPC CRUD | Complete |
| S3-backed image references for newly uploaded images | Complete |
| Guest mode without Google sign-in | Complete |
| Local guest ideas, statuses, stars, positions, and Connections persistence | Complete |
| Guest vault reset affordance | Complete |
| Prevent unauthenticated protected-query redirects | Complete |
| TypeScript checks, Vitest suite, production build, database table verification | Complete |
| New delivery checkpoint | Pending |

## Firebase readiness

Firebase remains a valid future option, especially if you want multi-device sync, Firebase Authentication with anonymous accounts, or Firestore real-time collaboration. It is not enabled in this pass because it requires a Firebase project configuration and client credentials. The current guest adapter keeps the UI persistence boundary clean so a Firestore adapter can replace localStorage later without redesigning the IdeaVault experience.
