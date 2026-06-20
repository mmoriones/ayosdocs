<div align="center">
 <img src="https://raw.githubusercontent.com/mmoriones/ayosdocs/master/app/public/ayosdocs.webp" width="100" height="100" alt="AyosDocs Logo">
 <h1>AyosDocs</h1>
 <p>Helping Filipinos navigate government bureaucracy through interactive, step-by-step guides.</p>
 <a href="https://ayosdocs.com"><strong>Visit Live Site »</strong></a>
 <br />
 <br />
 <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
 <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
 <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
 <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
 <img src="https://img.shields.io/badge/AWS_Bedrock-232F3E?style=for-the-badge&logo=amazonwebservices" alt="AWS Bedrock" />
 <img src="https://img.shields.io/badge/Terraform-1.0+-623CE4?style=for-the-badge&logo=terraform" alt="Terraform" />
 <img src="https://img.shields.io/badge/Ansible-Latest-EE0000?style=for-the-badge&logo=ansible" alt="Ansible" />
 <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
</div>

---

## What is AyosDocs?

AyosDocs is a full-stack workflow platform designed to simplify the complex world of Philippine government documentation. From getting your first Passport to starting a business, we provide the roadmap to get it done without the headache.

### Key Features

- **Interactive Guides:** Comprehensive requirements, fees, and procedures for NBI, SSS, DFA, and more.
- **Progress Tracking:** Interactive checklists that save your progress as you complete requirements.
- **Life Event Bundles:** Grouped requirements for goals like "Starting a Business" or "Getting Married".
- **AI Assistant:** Ask questions about any guide via chat — powered by Claude 3 Haiku on AWS Bedrock with RAG over Qdrant vector database.
- **Real-time Monitoring:** Built-in observability stack to ensure 99.9% uptime and performance tracking.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [Tailwind CSS 4](https://tailwindcss.com/) |
| **Backend** | Next.js Server Actions & API Routes |
| **Database** | [MongoDB](https://www.mongodb.com/) (Mongoose), [Qdrant](https://qdrant.tech/) (Vector DB) |
| **AI / ML** | [AWS Bedrock](https://aws.amazon.com/bedrock/) (Claude 3 Haiku), [Cohere Embed Multilingual v3](https://cohere.com/embed) |
| **Infrastructure** | [Terraform](https://www.terraform.io/) (AWS EC2 + Cloudflare), [Ansible](https://www.ansible.com/) |
| **Monitoring** | [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/), cAdvisor, Alertmanager |
| **Deployment** | Docker & Docker Compose, Watchtower (auto-updates), GitHub Container Registry |

---

## Architecture

AyosDocs runs on a single **AWS EC2 t3.small** instance behind **Cloudflare** proxy. The stack is fully containerized with Docker Compose:

- **Next.js** serves both the frontend and API routes
- **Nginx** acts as reverse proxy
- **MongoDB** stores user data, progress, and favorites
- **Qdrant** stores guide embeddings for RAG-based AI search
- **Claude 3 Haiku** (Bedrock) generates chat responses
- **Prometheus + Grafana** provide observability
- **Rclone** backs up data to Cloudflare R2 daily

```mermaid
flowchart TD
  user(["Users"])
  cf("Cloudflare<br/>DNS / CDN / DDoS")
  nginx("Nginx<br/>Reverse Proxy")

  subgraph ec2["AWS EC2 t3.small — Ubuntu 24.04"]
    subgraph docker["Docker Compose"]
      direction TB
      nextjs("Next.js 16<br/>App Router + API")
      mongo("MongoDB 7<br/>User Data / Progress")
      qdrant("Qdrant 1.13<br/>Vector DB (RAG)")
      prom("Prometheus<br/>Metrics Collection")
      grafana("Grafana<br/>Dashboards")
      alert("Alertmanager<br/>Alerts")
      cadvisor("cAdvisor<br/>Container Metrics")
      nodeexp("Node Exporter<br/>System Metrics")
      watchtower("Watchtower<br/>Auto Deploy")
      backup("Rclone<br/>Daily Backups")
    end
  end

  bedrock("AWS Bedrock<br/>Claude 3 Haiku")
  cohere("Cohere<br/>Multilingual v3")
  ghcr("GitHub Container<br/>Registry")
  r2("Cloudflare R2<br/>Backup Storage")

  user --> cf
  cf --> nginx
  nginx --> nextjs
  nextjs --> mongo
  nextjs --> qdrant
  nextjs --> bedrock
  nextjs --> cohere
  nextjs --> prom
  prom --> grafana
  prom --> alert
  prom --> cadvisor
  prom --> nodeexp
  ghcr -.->|docker pull| watchtower
  watchtower -.->|restart| nextjs
  mongo -.->|mongodump| backup
  backup --> r2

  classDef user fill:#ede9fe,stroke:#7c3aed,color:#4c1d95
  classDef network fill:#dbeafe,stroke:#3b82f6,color:#1e40af
  classDef app fill:#ccfbf1,stroke:#14b8a6,color:#115e59
  classDef data fill:#e9d5ff,stroke:#a855f7,color:#4c1d95
  classDef monitor fill:#fef3c7,stroke:#f59e0b,color:#92400e
  classDef ops fill:#f1f5f9,stroke:#64748b,color:#1e293b
  classDef external fill:#fee2e2,stroke:#ef4444,color:#991b1b

  class user user
  class cf,nginx network
  class nextjs,grafana app
  class mongo,qdrant data
  class prom,alert,cadvisor,nodeexp monitor
  class watchtower,backup ops
  class bedrock,cohere,ghcr,r2 external
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** 22+
- **Docker & Compose**
- **Terraform & Ansible** (for infrastructure)
- **AWS credentials** (for Bedrock, Qdrant)

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
# Bootstrap remote state (first time only)
make infra-bootstrap

# Provision infrastructure (Terraform + Ansible)
make infra-up && make infra-provision

# Launch the stack and index AI guides
make remote-docker-minimal-build && make remote-ai-sync
```

---

## Monitoring & Maintenance

The platform is fully containerized with built-in observability — automated health monitoring, metric collection, alerting, and daily encrypted backups to Cloudflare R2. The monitoring stack (Prometheus + Grafana + Alertmanager) runs alongside the application for real-time visibility.

For operational details, see the [Runbook](docs/RUNBOOK.md) and [Disaster Recovery Plan](docs/DISASTER_RECOVERY.md).

---

## Project Roadmap

AyosDocs is actively developed with these focus areas:

- **Content Expansion** — Adding more government agency guides, life event bundles, and localized content for regions across the Philippines.
- **Mobile Experience** — Improving responsive design, touch interactions, and progressive web app capabilities for on-the-go access.
- **Community Contributions** — Building a workflow for community-authored guides with review and moderation.
- **AI Assistant** — Enhancing the RAG-based chat with better context awareness and support for follow-up questions.
- **Performance & Reliability** — Ongoing infrastructure hardening, edge caching, and observability improvements.

---

## Tech Grid

| Category | Technologies |
| :--- | :--- |
| **Frontend** | ![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js) ![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
| **Backend** | ![Next.js API](https://img.shields.io/badge/Next.js_API-000000?style=for-the-badge&logo=next.js) ![Server Actions](https://img.shields.io/badge/Server_Actions-000000?style=for-the-badge&logo=next.js) ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js) |
| **Databases** | ![MongoDB 7](https://img.shields.io/badge/MongoDB_7-47A248?style=for-the-badge&logo=mongodb) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose) ![Qdrant 1.13](https://img.shields.io/badge/Qdrant_1.13-000000?style=for-the-badge&logo=qdrant) |
| **AI / ML** | ![AWS Bedrock](https://img.shields.io/badge/AWS_Bedrock-232F3E?style=for-the-badge&logo=amazonwebservices) ![Claude 3 Haiku](https://img.shields.io/badge/Claude_3_Haiku-000000?style=for-the-badge&logo=anthropic) ![Cohere Embed v3](https://img.shields.io/badge/Cohere_Embed_v3-3952FF?style=for-the-badge&logo=cohere) |
| **Infrastructure** | ![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white) ![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform) ![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker) ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare) |
| **Monitoring** | ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus) ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana) ![Alertmanager](https://img.shields.io/badge/Alertmanager-E6522C?style=for-the-badge&logo=prometheus) ![cAdvisor](https://img.shields.io/badge/cAdvisor-2496ED?style=for-the-badge&logo=docker) |
| **CI / CD** | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions) ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker) ![Watchtower](https://img.shields.io/badge/Watchtower-2496ED?style=for-the-badge&logo=docker) ![GHCR](https://img.shields.io/badge/GHCR-000000?style=for-the-badge&logo=github) |
| **Backup** | ![Rclone](https://img.shields.io/badge/Rclone-3F7E9C?style=for-the-badge&logo=rclone) ![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare) |
