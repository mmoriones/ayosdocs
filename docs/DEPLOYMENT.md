# AyosDocs Deployment Guide

This guide covers how to provision and deploy the AyosDocs stack to a fresh AWS instance using Terraform, Ansible, and Docker.

---

## 0. Prerequisites

Before starting, ensure you have the following ready:

### Accounts & Infrastructure
- **AWS Account:** Active account with permissions to create EC2 instances and Security Groups.
- **AWS EC2 Key Pair:** Create a key pair (e.g., `ayosdocs-key`) in your target region (default: `ap-southeast-1`). Download the `.pem` file to `~/.ssh/`.
- **Cloudflare Account:** A domain (e.g., `ayosdocs.com`) managed by Cloudflare.
- **Cloudflare API Token:** A token with `Zone.DNS:Edit` permissions for your domain.

### Local Tools
- **Terraform:** [Install Terraform](https://developer.hashicorp.com/terraform/downloads)
- **Ansible:** `sudo apt install ansible`
- **AWS CLI:** [Install & Configure](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) with your credentials.

---

## Step 1: Infrastructure Provisioning (Terraform - LOCAL)

Use Terraform on your **local machine** to create the AWS EC2 instance, configure the Cloudflare DNS record, and generate the Ansible inventory.

1. **Bootstrap remote state (first time only):**
  ```bash
  make infra-bootstrap
  ```
  Creates the S3 bucket and DynamoDB table for Terraform state storage.

2. **Provision infrastructure:**
  ```bash
  make infra-up
  ```
  This initializes Terraform with remote state and applies all resources. After completion, `infra/terraform/root/inventory.ini` is automatically generated with the new server IP.

3. **Configure Variables (Local):**
  Create a `terraform.tfvars` file in `infra/terraform/root/` (this file is gitignored):
  ```hcl
  cloudflare_api_token = "your_token"
  cloudflare_zone_id = "your_zone_id"
  ssh_key_name = "ayosdocs-key" # Must match your AWS Key Pair name
  ```

---

## Step 2: Server Configuration (Ansible - LOCAL)

Run these commands from your **local machine**. Ansible will connect to the server via SSH to configure it.

1. **Inventory is auto-generated** by Terraform at `infra/terraform/root/inventory.ini` — no manual editing needed. Run the playbook:

2. **Secrets Management (Local):**
  AyosDocs uses Ansible Vault in `infra/ansible/vars/secrets.yml`. 
  ```bash
  # To edit secrets
  make vault-edit
  ```
3. **Run the Playbook (Local):**
  ```bash
  make infra-provision
  ```

---

## Step 3: Launch Application (LOCAL)

Once the playbook finishes, use the `remote-*` Make commands to start the stack without SSH'ing into the server.

1. **Start the stack:**
  ```bash
  # For minimal resource usage (recommended for 1GB RAM instances)
  make remote-docker-minimal-build

  # Or for full observability stack (requires >1GB RAM)
  make remote-docker-minimal-up
  ```

2. **Index guides for AI:**
  ```bash
  make remote-ai-sync
  ```

3. **Pull latest code after pushing to GitHub:**
  ```bash
  make remote-git-pull
  ```

4. **Stop the stack:**
  ```bash
  make remote-docker-minimal-down
  ```

3. **Automatic Updates:**
 The stack includes **Watchtower**. Every day at 3:00 AM, it will check GHCR for a new version of your image. If you push a change to `master`, GitHub Actions will build a new image, and Watchtower will automatically restart your app on the server with the latest version. No manual `git pull` or `docker compose restart` required!

### AI Setup (Qdrant + Bedrock)

The AI chat feature requires additional environment variables configured in the ansible vault. After running `make infra-provision`, the env variables are deployed to the server.

1. **Configure AI env vars in vault:**
  Edit `infra/ansible/vars/secrets.yml` and ensure these variables are set:
  ```
  AWS_REGION=ap-southeast-1
  AWS_ACCESS_KEY_ID=your_key
  AWS_SECRET_ACCESS_KEY=your_secret
  QDRANT_URL=http://qdrant:6333
  AI_ENABLED=true
  ```

2. **Index guides into Qdrant:**
  ```bash
  make remote-ai-sync
  ```
  This chunks all guides, generates embeddings via **Cohere Multilingual v3**, and upserts to Qdrant.

3. **Verify:** Open the chat bubble on the site and ask a question about any guide.

## Backup Strategy (Cloudflare R2)

The application includes an automated backup service that runs every day at 3:00 AM.

1. **Rclone Configuration**:
 The `backup` service uses `rclone` to upload encrypted database dumps to Cloudflare R2. You must provide the `rclone.conf` content via Ansible Vault.

2. **Manual Test**:
 To run a backup manually:
 ```bash
 docker exec ayosdocs-backup /scripts/backup.sh
 ```

---

## CI/CD Pipeline Flow

1. **Code Push**: You push code to the `main` branch.
2. **Lint & Scan**: GitHub Actions runs ESLint and **Trivy** (security scanner).
3. **Build & Push**: If scans pass, a new image is built and pushed to **GHCR**.
4. **Auto-Deploy**: **Watchtower** on your VPS detects the new image and restarts the container.

---

## Minimal Deployment Pipeline

For low-resource instances (t3.small / 2GB RAM), AyosDocs runs a reduced stack that excludes monitoring services to conserve memory.

### Included services
- `app` (Next.js 16), `mongodb`, `nginx` (reverse proxy), `qdrant` (vector DB), `backup` (rclone), `account-cleanup`

### Excluded services
- `prometheus`, `grafana`, `alertmanager`, `node-exporter`, `cadvisor`, `watchtower`

### Deploy or update with minimal stack

```bash
# Full deploy from scratch
make infra-bootstrap && make infra-up && make infra-provision && make remote-docker-minimal-build && make remote-ai-sync

# Update after pushing code
make remote-git-pull && make remote-docker-minimal-build

# Rebuild after config changes
make remote-docker-minimal-down && make remote-docker-minimal-build
```

The compose file used is `docker/compose/docker-compose.minimal-build.yml`.

---

## Monitoring & Observability

AyosDocs includes a full observability stack (Prometheus, Grafana, Node Exporter, cAdvisor). 

### Accessing the Grafana Dashboard

Navigate to [http://admin.ayosdocs.com/grafana/](http://admin.ayosdocs.com/grafana/) via the admin subdomain.

#### Credentials:
- **User:** `admin`
- **Password:** (Set in your vault/env as `GRAFANA_PASSWORD`)

---

## Operations & Maintenance

### Check Logs
- **All Services:** `make docker-logs`
- **Web App:** `make docker-log-app`
- **Nginx Proxy:** `make docker-log-nginx`
- **Database:** `make docker-log-mongodb`
- **Backup Service:** `make docker-log-backup`
- **Watchtower (Auto-updates):** `make docker-log-watchtower`
- **Observability:** `make docker-log-prometheus` or `make docker-log-grafana`

### Diagnostic Commands
- **Nginx Syntax Check:** `docker exec -it ayosdocs-nginx nginx -t` (via `make remote-docker-minimal-up` first)
- **Manual Backup Trigger:** `make backup`
- **Restart All Services:** `make remote-docker-minimal-down && make remote-docker-minimal-build`
- **Check Logs:** Use the `remote-*` commands for recent logs.

---

## Command Reference

For a full list of available commands and their descriptions, see the [Makefile](../Makefile) at the project root. Run `make help` in the root directory to print all commands organized by category — infrastructure, Docker, remote server management, and utilities.

