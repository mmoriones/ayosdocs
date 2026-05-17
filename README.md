<div align="center">
  <img src="app/src/app/icon.svg" width="100" height="100" alt="AyosDocs Logo">
  <h1>AyosDocs</h1>
  <p>Helping Filipinos navigate government bureaucracy through interactive, step-by-step guides.</p>
  <a href="https://ayosdocs.com"><strong>Visit Live Site »</strong></a>
  <br />
  <br />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Terraform-1.0+-623CE4?style=for-the-badge&logo=terraform" alt="Terraform" />
  <img src="https://img.shields.io/badge/Ansible-Latest-EE0000?style=for-the-badge&logo=ansible" alt="Ansible" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
</div>

---

## 📖 What is AyosDocs?

AyosDocs is a full-stack workflow platform designed to simplify the complex world of Philippine government documentation. From getting your first Passport to starting a business, we provide the roadmap to get it done without the headache.

### ✨ Key Features

- 🗺️ **Interactive Guides:** Comprehensive requirements, fees, and procedures for NBI, SSS, DFA, and more.
- ✅ **Progress Tracking:** Interactive checklists that save your progress as you complete requirements.
- 📦 **Life Event Bundles:** Grouped requirements for goals like "Starting a Business" or "Getting Married".
- 📊 **Real-time Monitoring:** Built-in observability stack to ensure 99.9% uptime and performance tracking.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [Tailwind CSS 4](https://tailwindcss.com/) |
| **Backend** | Next.js Server Actions & API Routes |
| **Database** | [MongoDB](https://www.mongodb.com/) (Mongoose) |
| **Infrastructure** | [Terraform](https://www.terraform.io/) (AWS + Cloudflare), [Ansible](https://www.ansible.com/) |
| **Monitoring** | [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/), cAdvisor |
| **Deployment** | Docker & Docker Compose |

---

## 🏗️ Architecture

AyosDocs follows a modern, containerized architecture optimized for stability and observability.

<div align="center">
  <img src="docs/prod_architecture.png" alt="Production Architecture" style="border-radius: 10px; border: 1px solid #ddd; max-width: 800px;">
</div>

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 22+
- **Docker & Compose**
- **Terraform & Ansible** (for infrastructure)

### 2. Quick Installation
```bash
# Clone the repository
git clone https://github.com/mmoriones/ayosdocs.git
cd ayosdocs

# Install dependencies
npm install

# Setup local environment (requires Ansible Vault password)
npm run setup-env
```

### 3. Provision & Deploy
For a detailed end-to-end guide on provisioning AWS and deploying the stack, see our **[Deployment Guide](docs/DEPLOYMENT.md)**.

```bash
# Infrastructure (Local)
cd infra/terraform && terraform apply

# Configuration (Local)
cd infra/ansible && ansible-playbook -i inventory.ini setup-server.yml --ask-vault-pass
```

---

## 📊 Monitoring & Maintenance

We prioritize "Operations as Code." Our stack includes a pre-configured observability suite.

- **Metrics:** App performance is exposed via `/api/metrics`.
- **Dashboards:** Access Grafana via SSH Tunnel (`localhost:3000`).
- **Backups:** Automated daily backups to Cloudflare R2 at 3:00 AM.

---
