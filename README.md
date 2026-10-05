# 🏛️ CivicDex (Community Hero V1.1)

> Full-stack municipal civic issue verification, spatial neighborhood clustering, and community action platform.

[![Platform: Web](https://img.shields.io/badge/Platform-Web%20%7C%20Dashboard-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Stack: React + Node.js](https://img.shields.io/badge/Stack-React%20%7C%20Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database: Firebase Firestore](https://img.shields.io/badge/Database-Firestore-FFA611?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)](LICENSE)

---

## ⚡ Overview

**CivicDex** serves as the administrative and community-facing desktop web portal companion to Community Hero. It aggregates incoming mobile civic reports, clusters incidents spatially using KNN proximity models, flags duplicates, and provides municipal officers with a real-time resolution workflow.

---

## 🏛️ System Architecture

```text
 ┌──────────────────────┐      ┌────────────────────────┐      ┌──────────────────────┐
 │ Citizen Reports      │ ──►  │ CivicDex Web Hub       │ ──►  │ Firebase Firestore   │
 │ Spatial GPS Data     │      │ KNN Clustering Engine  │      │ Incident Status DB   │
 └──────────────────────┘      └────────────────────────┘      └──────────────────────┘
```

For full technical specifications, see [docs/architecture.md](docs/architecture.md) and [CivicDex_Advanced_Architecture.md](CivicDex_Advanced_Architecture.md).

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/pranav520214/community-hero-v1-1-civicdex.git
cd community-hero-v1-1-civicdex

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📄 License

Distributed under the [Apache-2.0 License](LICENSE).
