### 🚉 BVG Berlin Transit Dashboard

A simple real-time dashboard displaying upcoming departures from selected Berlin stations. Built with Vite + Preact + Tailwind + shadcn/ui, using public BVG data.

### 📦 Features

Live departure info from configured stations (refreshed every 90s)
Grouped by station and line
Prioritized view: S-Bahn → U-Bahn → Tram → Bus → Others
Color-coded and icon-labeled transport types
Styled with shadcn/ui and Tailwind CSS

### 🚀 Setup

Install deps:
```shell
npm install
Configure stations in src/config/stations.ts:
export const stations = ["900120003", "900000100"]; // station IDs
npm run dev
```