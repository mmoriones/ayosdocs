# AyosDocs Architecture

## Overview
AyosDocs is a Next.js application served via Nginx with Cloudflare Proxy (A-Record) for secure and performant access.

## Components
- **Frontend/Backend:** Next.js (App Router)
- **Database:** MongoDB
- **Reverse Proxy:** Nginx
- **Connectivity:** Cloudflare Proxy (A-Record)
- **Infrastructure:** Managed via Terraform and Ansible
- **Observability:** Prometheus, Grafana, Node Exporter, cAdvisor
