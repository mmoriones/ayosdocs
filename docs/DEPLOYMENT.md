# 🚀 AyosDocs Deployment Guide

This guide covers how to provision and deploy the AyosDocs stack to a fresh AWS instance using Terraform, Ansible, and Docker.

---

## 📋 0. Prerequisites

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

## 🏗️ Step 1: Infrastructure Provisioning (Terraform - LOCAL)

Use Terraform on your **local machine** to create the AWS EC2 instance and configure the Cloudflare DNS record.

1.  **Navigate to Terraform directory (Local):**
    ```bash
    cd infra/terraform
    ```
2.  **Configure Variables (Local):**
    Create a `terraform.tfvars` file (this file is gitignored):
    ```hcl
    cloudflare_api_token = "your_token"
    cloudflare_zone_id   = "your_zone_id"
    ssh_key_name         = "ayosdocs-key" # Must match your AWS Key Pair name
    ```
3.  **Initialize and Apply (Local):**
    ```bash
    terraform init
    terraform apply
    ```
    *Note the output `public_ip` for the next step.*

---

## 🛠️ Step 2: Server Configuration (Ansible - LOCAL)

Run these commands from your **local machine**. Ansible will connect to the server via SSH to configure it.

1.  **Configure Inventory (Local):**
    Edit `infra/ansible/inventory.ini` with your new server IP:
    ```ini
    [webservers]
    your_server_ip ansible_user=ubuntu project_path=/home/ubuntu/ayosdocs ansible_ssh_private_key_file=~/.ssh/ayosdocs-key.pem
    ```
2.  **Secrets Management (Local):**
    AyosDocs uses Ansible Vault in `infra/ansible/vars/secrets.yml`. 
    ```bash
    # To edit existing secrets
    ansible-vault edit infra/ansible/vars/secrets.yml --vault-password-file .vault_pass
    ```
3.  **Run the Playbook (Local):**
    ```bash
    cd infra/ansible
    ansible-playbook -i inventory.ini setup-server.yml --ask-vault-pass
    ```

---

## 🚢 Step 3: Launch Application (REMOTE SERVER)

Once the playbook finishes, SSH into the **remote server** to launch the stack.

1.  **SSH into Server:**
    ```bash
    ssh ubuntu@your_server_ip
    ```

2.  **Start the stack:**
    ```bash
    cd /home/ubuntu/ayosdocs
    make docker-up
    ```

3.  **Automatic Updates:**
    The stack includes **Watchtower**. Every day at 3:00 AM, it will check GHCR for a new version of your image. If you push a change to `main`, GitHub Actions will build a new image, and Watchtower will automatically restart your app on the server with the latest version. No manual `git pull` or `docker compose restart` required!

## 📦 Backup Strategy (Cloudflare R2)

The application includes an automated backup service that runs every day at 3:00 AM.

1.  **Rclone Configuration**:
    The `backup` service uses `rclone` to upload encrypted database dumps to Cloudflare R2. You must provide the `rclone.conf` content via Ansible Vault.

2.  **Manual Test**:
    To run a backup manually:
    ```bash
    docker exec ayosdocs-backup /scripts/backup.sh
    ```

---

## 🏗️ CI/CD Pipeline Flow

1.  **Code Push**: You push code to the `main` branch.
2.  **Lint & Scan**: GitHub Actions runs ESLint and **Trivy** (security scanner).
3.  **Build & Push**: If scans pass, a new image is built and pushed to **GHCR**.
4.  **Auto-Deploy**: **Watchtower** on your VPS detects the new image and restarts the container.

---

## 📊 Monitoring & Observability

AyosDocs includes a full observability stack (Prometheus, Grafana, Node Exporter, cAdvisor). 

### Accessing the Grafana Dashboard

#### Option A: Direct via Admin Subdomain (Recommended)
Navigate to [http://admin.ayosdocs.com/grafana/](http://admin.ayosdocs.com/grafana/)

#### Option B: SSH Tunnel (Secure Backdoor)
1.  **Start the SSH Tunnel (from your local machine):**
    ```bash
    ssh -i ~/.ssh/ayosdocs-key.pem -L 3000:localhost:3000 ubuntu@your_server_ip
    ```
2.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000)

#### Credentials:
- **User:** `admin`
- **Password:** (Set in your vault/env as `GRAFANA_PASSWORD`)

---

## 🏗️ CI/CD Pipeline Flow
...
### 📝 Check Logs
- **All Services:** `docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f`
- **Web App:** `docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f app`
- **Nginx Proxy:** `docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f nginx`
- **Database:** `docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f mongodb`
- **Observability:** `docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f prometheus grafana`
- **Watchtower (Auto-updates):** `docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f watchtower`
- **Backup Service:** `docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f backup`

### 🛠️ Diagnostic Commands
- **Nginx Syntax Check:** `docker exec -it ayosdocs-nginx nginx -t`
- **MongoDB Shell:** `docker exec -it ayosdocs-db mongosh`
- **Manual Backup Trigger:** `docker exec ayosdocs-backup /scripts/backup.sh`
- **Restart All Services:** `make docker-down && make docker-up`

