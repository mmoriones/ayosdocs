# AyosDocs Architecture

## Overview
AyosDocs runs on a single **AWS EC2 t3.small** instance behind **Cloudflare Proxy** (A-Record). The entire stack is containerized via Docker Compose and provisioned with Terraform + Ansible.

## Hosting & Infrastructure
- **Compute:** AWS EC2 t3.small (2GB RAM)
- **DNS & CDN:** Cloudflare Proxy (A-Record)
- **Provisioning:** Terraform (AWS + Cloudflare) + Ansible
- **Secrets:** Ansible Vault

## Container Stack (docker/compose/docker-compose.yml)

| Service | Role |
|---|---|
| `app` | Next.js 16 standalone (serves frontend + API) |
| `nginx` | Reverse proxy, TLS termination, static asset caching |
| `mongodb` | Primary database (user data, progress, favorites) |
| `qdrant` | Vector database for RAG embeddings |
| `prometheus` | Metrics collection |
| `grafana` | Dashboards and alerting |
| `alertmanager` | Alert routing |
| `node-exporter` | Host-level metrics |
| `cadvisor` | Container-level metrics |
| `watchtower` | Automatic container updates |
| `backup` | Daily rclone sync to Cloudflare R2 |

## AI / RAG Pipeline
1. **Ingestion** (`scripts/index-guides.mjs`): Reads all guide JSON, chunks by section, embeds via **Cohere Multilingual v3**, upserts to Qdrant.
2. **Query** (`app/src/app/api/chat/route.js`): User message → Cohere embed → Qdrant similarity search → Claude 3 Haiku prompt → streaming response.
3. **UI** (`app/src/components/chat/ChatAssistant.js`): Floating chat bubble using `useChat()` from `@ai-sdk/react`.

## Key Data Flows
- **Guides:** Static JSON (`app/src/data/guides/*.json`) → `JSON.parse` → server component render
- **User progress:** React Query → Next.js API route (`/api/user/all-data`) → MongoDB
- **Search:** Client-side `.includes()` substring match across title, shortTitle, description, agency, and tags
- **Metrics:** Prometheus client (`/api/metrics`) scraped by Prometheus → Grafana dashboards

## Deployment Pipeline
1. Push to `master` on GitHub
2. GitHub Actions: lint → Docker build → Trivy scan → push to `ghcr.io/mmoriones/ayosdocs`
3. Watchtower on EC2 pulls new image and restarts the `app` container
