# 🌍 Nivaran | Civic Resolution Platform

> **Empowering citizens to report. Enabling authorities to resolve.**  
> A unified, cross-platform ecosystem designed to bridge the gap between public grievances, government administrators, university officials, and industry partners.

---

## 🎯 The Vision
Traditional civic issue reporting is fragmented, opaque, and slow. **Nivaran** (The Civic Platform) re-engineers this pipeline. By combining mobile geo-tagging for citizens with a high-performance, AI-ready web dashboard for administrators, we provide a transparent, end-to-end resolution engine. 

Built as a **high-performance Monorepo** (Turborepo + pnpm workspaces), the codebase ensures seamless dependency sharing, unified type safety, and an exceptional developer experience.

---

## 🧩 The Ecosystem

### 📱 1. The Citizen App (`apps/mobile`)
A native-feeling mobile application allowing citizens to snap photos of civic issues, automatically detect exact GPS coordinates, and track the real-time resolution status of their reports.

### 🌐 2. The Command Center (`rootAdminDashboardWeb`)
An ultra-fast web dashboard for City Admins and Authorities. Features interactive geographic mapping of issues, queue management, analytics visualization, and comprehensive audit logs.

### 🧠 3. The Core API (`apps/api`)
The central nervous system. A robust REST API handling stateless authentication, geospatial data processing, AI embeddings, secure media management, and data validation.

---

## 💻 Technical Arsenal

| Domain | Technologies Used |
| :--- | :--- |
| **Backend API** | Node.js, Express, TypeScript, Zod, JWT |
| **Database & ORM** | PostgreSQL, Prisma ORM, `pgvector` (AI), `postgis` (Geo) |
| **Mobile App** | React Native, Expo, EAS, React Navigation, React Native Maps |
| **Admin Web** | React 19, Vite, TypeScript, Tailwind CSS, React Router DOM |
| **Maps & Charts** | Leaflet, React-Leaflet, Recharts |
| **Infrastructure** | Turborepo, pnpm workspaces, Cloudinary (Media) |

---

## 🚀 Zero-to-Live: Local Setup Guide

### Phase 1: Prerequisites
Ensure your local machine has the following tools armed and ready:
* **Node.js** (v18+) & **pnpm** (v11+)
* **PostgreSQL Database** (Local or cloud via Supabase/Neon). *Note: Must have `postgis` and `pgvector` extensions enabled.*
* **Cloudinary Account** (For image API keys).
* **Expo Go App** installed on your physical mobile device.

### Phase 2: Core Initialization
```bash
# 1. Clone the repository
git clone <repository-url>
cd civic-platform

# 2. Install all monorepo dependencies instantly via pnpm
pnpm install
