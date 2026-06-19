# AyosDocs - Infrastructure Roadmap

## Current Focus

| Task | Est. effort | Notes |
|---|---|---|
| IAM role for EC2 + EBS encryption (W1D4) | ~2hrs | Security, access control |
| Terraform module README (W1D5) | ~1hr | Document architecture |
| `make deploy-minimal` + `remote-*` commands + update docs (W1D7) | ~2hrs | Deployment automation, documentation |
| Ansible roles cleanup (W1D6) | ~2hrs | Maintainable config management |
| Commit all changes + polish repo | ~1hr | Clean up before next steps |

---

## Week 1 — IaC Refactor

Goal: Turn the working infra into interview-grade code.

| Day | Task | Status |
|---|---|---|
| 1 | Restructure `infra/terraform/` into modules: `modules/vpc/`, `modules/ec2/`, `modules/dns/`, `modules/iam/`, `root/` | Done |
| 2 | Extract hardcoded vars into `variables.tf` with descriptions + types; add `terraform.tfvars.example` | Done |
| 3 | Add remote state backend: S3 bucket + DynamoDB locking. Commit the backend config (bucket name in vars) | Done |
| 4 | Review and fix security: restrict security group CIDRs, add IAM least-privilege policy for EC2, enable encryption | In progress |
| 5 | Write README for terraform module explaining what each piece does and why | Pending |
| 6 | Clean up Ansible: split `setup-server.yml` into roles (`docker/`, `monitoring/`, `app/`, `backup/`) | Pending |
| 7 | Add `make deploy-minimal` + `remote-*` commands via Ansible ad-hoc. Generate `inventory.ini` dynamically in Terraform via `local_file`. Update docs | Pending |

**Checkpoint:** Can run `make deploy` from a clean AMI to a fully running site. Can explain every Terraform resource by memory.

---

## Week 2 — CI/CD Pipeline

Goal: Production-grade GitHub Actions pipeline.

| Day | Task | Status |
|---|---|---|
| 1 | Rewrite `.github/workflows/pipeline.yml` with stages: `lint → build → scan → push` (deploy comes after HA infra) | Pending |
| 2 | Add `npm run typecheck` and `npm run lint` to CI; fail fast on lint errors | Pending |
| 3 | Add Docker build with cache: `docker/build-push-action` with `cache-from` and `cache-to` | Pending |
| 4 | Add Trivy filesystem scan on source + Trivy image scan on built image + tfsec for Terraform scanning; fail on CRITICAL/HIGH only | Pending |
| 5 | Add CI job: build & push Docker image to GHCR (deploy via SSH added after Week 3 HA rewrite) | Pending |
| 6 | Add notification step: Slack or email on failure | Pending |
| 7 | Document the CI pipeline in `docs/CI_CD.md` — stages, what each does, how to debug failures | Pending |

**Checkpoint:** Push to `master` → auto-builds, scans, deploys. Interviewers will ask about CI, and you can walk through every stage.

---

## Week 3 — AWS Part 1: VPC & HA Architecture

Goal: Build the interview-standard HA setup you can't do on free tier without credits.

| Day | Task | Status |
|---|---|---|
| 1 | Design the architecture on paper: VPC with 2 AZs, public/private subnets, IGW, NAT Gateway, ALB, 2 EC2s, RDS or MongoDB replica. Sketch it before coding. | Pending |
| 2 | Terraform the VPC: `modules/vpc/` with public subnets (AZ-a, AZ-b), private subnets (AZ-a, AZ-b), IGW, NAT Gateway (in public subnet). | Pending |
| 3 | Terraform ALB + Target Group + Listener + Security Groups. Deploy 2 t3.micro EC2s behind the ALB, each with Nginx. | Pending |
| 4 | Make it HA: add ALB health check endpoint, auto-scaling group (min 2, max 4), launch template with user data. Test killing one EC2. | Pending |
| 5 | Deploy AyosDocs: EC2s pull Docker images from GHCR (built in Week 2 CI), ALB routes traffic. Note: for true HA you'd need shared DB — use MongoDB Atlas free tier or document the tradeoff. | Pending |
| 6 | Document the HA architecture: draw the VPC diagram, explain each component's purpose, include a decision log (why NAT vs VPC endpoint, why ALB vs NLB). | Pending |
| 7 | Tear down everything except the doc. Practice re-creating from scratch in under an hour. | Pending |

**Checkpoint:** Can draw VPC diagram from memory. Can explain how traffic flows: User → Cloudflare → ALB → EC2 (multi-AZ). Can answer "How do you make this highly available?" with a real setup you built.

**Cost note:** NAT Gateway ~$32/mo + ALB ~$22/mo. Your $186 credits cover 3+ months. Create, learn, destroy to minimize burn.

---

## Week 4 — AWS Part 2: Advanced AWS

Goal: Round out AWS skills.

| Day | Task | Status |
|---|---|---|
| 1 | S3 deep dive: create buckets with proper bucket policies, versioning, lifecycle rules (expire 30d), server-side encryption. Terraform it. | Pending |
| 2 | IAM deep dive: create least-privilege roles/policies. Know when to use IAM Role vs User vs Policy. Practice `aws sts assume-role`. | Pending |
| 3 | SSM Session Manager: set up Systems Manager on an EC2, connect without SSH keys or key pairs. Add to your Ansible role. | Pending |
| 4 | AWS CLI mastery: `describe-instances --query`, `s3 sync`, `cloudformation describe-stacks`, `ecs list-clusters`. Write useful one-liner aliases. | Pending |
| 5 | Cost management: set up budgets ($50/mo alert), check Cost Explorer, add tags to all Terraform resources for cost allocation. | Pending |
| 6 | IAM deep dive review — audit existing roles, write least-privilege policies, practice `aws sts assume-role`. | Pending |
| 7 | Write "AyosDocs AWS Architecture" doc: VPC diagram, component list, decision log. This becomes your interview reference. | Pending |

**Checkpoint:** Can SSH without SSH keys (SSM). Can audit your AWS bill and find cost by tag.

---

## Week 5 — Kubernetes (k3s Deep Dive)

Goal: Deploy AyosDocs on Kubernetes to have a solid answer for "Have you used K8s?"

| Day | Task | Status |
|---|---|---|
| 1 | Install k3s on a fresh EC2. Practice `kubectl` basics: `get pods`, `describe`, `logs`, `exec`. | Pending |
| 2 | Convert `docker-compose.yml` to Kubernetes manifests (Deployments + Services for each container). | Pending |
| 3 | Add ConfigMaps for Nginx config, Next.js env vars; Secrets for MongoDB URI, NEXTAUTH_SECRET. | Pending |
| 4 | Add Ingress (Traefik comes with k3s) to route `ayosdocs.com` → Next.js service. Test end-to-end. | Pending |
| 5 | Add PersistentVolumeClaims for MongoDB, Qdrant, Prometheus data. Understand StatefulSet vs Deployment for stateful apps. | Pending |
| 6 | Install k9s CLI. Practice debugging: `kubectl describe pod`, `kubectl logs --previous`, `kubectl exec -it`. | Pending |
| 7 | Write "How to deploy AyosDocs on k3s" doc. Include the manifests and commands. | Pending |

**Checkpoint:** You have `manifests/` directory with working K8s yamls. Can say "I've deployed on k3s and understand Pods, Services, Ingress, PVCs, ConfigMaps, Secrets."

---

## Week 6 — Observability

Goal: Move beyond "Prometheus + Grafana are installed."

| Day | Task | Status |
|---|---|---|
| 1 | Write custom Prometheus exporters or understand the `/api/metrics` endpoint; add app-level metrics (requests, errors, latency). | Pending |
| 2 | Create a Grafana dashboard from scratch: Node Exporter (CPU/RAM/disk) + cAdvisor (container metrics) + app metrics. | Pending |
| 3 | Set up alerting rules in Prometheus: high CPU > 80% for 5m, disk space < 20%, container restart loop. | Pending |
| 4 | Configure Alertmanager to send alerts to email or Slack webhook. | Pending |
| 5 | (Optional but strong) Add Loki for centralized log aggregation — `docker-compose` file for Loki + Promtail. | Pending |
| 6 | Practice debugging: simulate a container crash, check logs, check metrics, write a postmortem. | Pending |
| 7 | Document the observability stack in `docs/OBSERVABILITY.md`. | Pending |

**Checkpoint:** Prod goes down → you know exactly where to look (Grafana dashboard → logs → alert).

---

## Week 7 — Security & Hardening

| Day | Task | Status |
|---|---|---|
| 1 | Harden EC2: disable password auth, use only SSH keys or SSM, install `fail2ban`, keep `unattended-upgrades`. | Pending |
| 2 | Set up Docker Bench Security (`docker-bench-security`): scan the host and fix CIS recommendations. | Pending |
| 3 | Set up Cloudflare WAF rules: rate limiting, challenge on known bad IPs, geo-block if needed. | Pending |
| 4 | Write `docs/SECURITY.md` with security controls, scanning results, and incident response steps. | Pending |
| 5 | Review and update ALL docs — `README.md`, `docs/CI_CD.md`, `docs/DEPLOYMENT.md`, `DEVOPS_NOTES.md` — to reflect all changes made during the roadmap. | Pending |

**Checkpoint:** Can answer "How do you secure an EC2 instance?" with at least 5 concrete steps.
