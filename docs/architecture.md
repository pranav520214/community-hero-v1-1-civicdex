# CivicDex (Community Hero V1.1) Municipal Web Platform Architecture

## 1. System Architecture

```text
 ┌────────────────────────────────────────┐
 │       Citizen & Municipal Web UI       │
 │       (React, Next.js, Tailwind)       │
 └───────────────────┬────────────────────┘
                     │ Incident Ingestion & Filtering
                     ▼
 ┌────────────────────────────────────────┐
 │           CivicDex API Hub             │
 │  • Spatial KNN Neighborhood Indexing   │
 │  • Automated Duplicate Detection       │
 └───────────────────┬────────────────────┘
                     │ Verification & Updates
                     ▼
 ┌────────────────────────────────────────┐
 │        Firebase Firestore Backend      │
 │  • Role-Based Access (Citizens/Officers│
 │  • Verified Incident Resolution State  │
 └────────────────────────────────────────┘
```

## 2. Security Boundaries
- Secrets, credentials, and local keystores are excluded from source control.
- Firebase security rules enforce write permission restrictions on resolved issues.
