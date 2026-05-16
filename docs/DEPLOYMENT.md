# 🚀 AyosDocs Deployment Guide

This guide covers how to provision and deploy the AyosDocs stack to a fresh Ubuntu VM or VPS using Ansible and Docker.

---

## 🏗️ Step 1: Local Environment Setup

1.  **Clone the Repository (Local):**
    First, you must have the code on your local machine to manage configurations and secrets.
    ```bash
    git clone https://github.com/your-username/ayosdocs.git
    cd ayosdocs
    ```

2.  **Install Ansible (Local):**
    **Ubuntu/Debian:** `sudo apt install ansible`

    **Install Required Collections:**
    ```bash
    ansible-galaxy collection install community.general
    ```

3.  **Secrets Management (Ansible Vault):**
    Open `infra/ansible/vars/secrets.yml` and fill in your real credentials.

    **To encrypt for the first time:**
    ```bash
    ansible-vault encrypt infra/ansible/vars/secrets.yml
    ```

    **To edit an already encrypted file:**
    ```bash
    ansible-vault edit infra/ansible/vars/secrets.yml
    ```

---

## 🌐 Step 2: Remote Server Preparation

1.  **SSH into your server:**
    ```bash
    ssh ubuntu@your_server_ip
    ```

2.  **Clone the Repository (Remote):**
    The Ansible playbook expects the repository to exist on the server to create configuration links.
    ```bash
    git clone https://github.com/your-username/ayosdocs.git
    ```
    *Note the path (e.g., `/home/ubuntu/ayosdocs`) as you'll need it for the inventory.*

3.  **Configure Passwordless Sudo:**
    To allow Ansible to run administrative tasks without being prompted for a password, run the following command on the server (replace `ubuntu` with your `ansible_user`):
    ```bash
    echo "$USER ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/ayosdocs-ansible
    ```

---

## 🤖 Step 3: Automated Provisioning

1.  **Configure Inventory (Local):**
    Edit `infra/ansible/inventory.ini` on your local machine with the server IP and the **Remote** project path:
    ```ini
    [webservers]
    your_server_ip ansible_user=ubuntu project_path=/home/ubuntu/ayosdocs
    ```

2.  **Run the Master Setup (Local):**
    This command will install Docker, Cloudflared, and deploy your encrypted secrets to the server.
    ```bash
    ansible-playbook -i infra/ansible/inventory.ini infra/ansible/setup-server.yml --ask-vault-pass
    ```

---

## 🚢 Step 4: Launch Application

Once the playbook finishes, the server is ready. The application is now deployed using Docker images from **GitHub Container Registry (GHCR)**.

1.  **Configure Image Name (Local):**
    Ensure your `.env` (managed via Ansible Vault) includes the `IMAGE_NAME` variable pointing to your GHCR repository.

2.  **Start the stack:**
    On your server terminal:
    ```bash
    cd /home/ubuntu/ayosdocs
    make docker-up
    ```

3.  **Automatic Updates:**
    The stack includes **Watchtower**. Every 5 minutes, it will check GHCR for a new version of your image. If you push a change to `main`, GitHub Actions will build a new image, and Watchtower will automatically restart your app on the server with the latest version. No manual `git pull` or `docker compose restart` required!

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

## 🔍 Troubleshooting

- **Check Tunnel Status:** `docker compose -f docker/compose/docker-compose.yml logs -f tunnel`
- **Check Docker Logs:** `docker compose -f docker/compose/docker-compose.yml logs -f`
- **Nginx Config:** `docker exec -it ayosdocs-nginx nginx -t`
