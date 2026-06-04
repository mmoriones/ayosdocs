# Detailed Implementation Plan: Infrastructure Upgrade & AI Assistant

This document outlines the architectural roadmap for upgrading the AyosDocs infrastructure and integrating a future-proof AI assistant. It is designed to maximize AWS credits ($191.45) expiring in Nov 2026 while maintaining zero vendor lock-in.

---

## Part 1: Infrastructure Upgrade (Server Capacity)

### 1.1 Terraform Modification
- **Target**: `infra/terraform/variables.tf`
- **Action**: Update `instance_type` from `t3.micro` (1GB) to `t3.medium` (4GB).
- **Reasoning**: Next.js, MongoDB, and the new Vector DB (Qdrant) require more than 1GB of memory to prevent OOM (Out of Memory) kills.

### 1.2 Execution
1.  Navigate to `infra/terraform`.
2.  Run `terraform apply`. 
    - *Note: This will stop the current instance, change the type, and restart it. Expected downtime: 2-5 minutes.*
3.  SSH into the server and verify with `free -h` or `htop`.

### 1.3 Full Stack Activation
- **Action**: Switch from `make docker-minimal` to `make docker-up`.
- **Impact**: Enables Prometheus, Grafana, and cAdvisor. With 4GB of RAM, the server can now handle full observability for better debugging.

---

## Part 2: AI Chat Assistant (RAG Architecture)

### 2.1 Vector Database: Qdrant (Self-Hosted)
Instead of paying for AWS OpenSearch ($170/mo), we will host **Qdrant** in Docker.
- **Configuration**: Add `qdrant` to `docker/compose/docker-compose.yml` with a volume mount at `qdrant_data`.
- **Advantage**: It is open-source and portable. If you move to Hetzner/DigitalOcean, your data stays in your container.

### 2.2 The Ingestion Pipeline (`scripts/index-guides.js`)
A Node.js script that performs the following:
1.  Parses all JSON files in `app/src/data/guides/`.
2.  Chunks the text (to fit AI context limits).
3.  Calls **AWS Bedrock (Titan Embeddings)** to generate vectors.
4.  Upserts vectors and metadata (guide title, slug, category) into Qdrant.

### 2.3 The Future-Proof AI Wrapper (`app/src/lib/ai/`)
To avoid lock-in, we will implement a provider-agnostic layer using the **Vercel AI SDK**.

- **`src/lib/ai/provider.js`**: The only file containing AWS-specific code. 
- **`src/lib/ai/service.js`**: The business logic that decides whether to use the Real AI or the Mock AI.

#### Environment Safety Logic (Staging/Local/Vercel)
The code will be "defensive" to prevent errors on platforms like Vercel or in local dev:
```javascript
const isAIReady = process.env.AWS_ACCESS_KEY_ID && process.env.AI_ENABLED === 'true';

export async function chat(messages) {
  if (!isAIReady) {
    // Fallback: Returns a simulated response so the UI doesn't crash
    return { text: "AI is currently disabled or keys are missing.", isMock: true };
  }
  // Proceed with real Bedrock call using Vercel AI SDK...
}
```

### 2.4 Chat API & UI
- **API**: `app/api/chat/route.js` using streaming response.
- **UI**: A floating chat bubble using `useChat` from the Vercel AI SDK for a seamless "typing" experience.

---

## Part 3: Environment Management Matrix

| Feature            | Local Dev (Docker)     | Vercel (Staging)         | AWS Production      |
| :----------------- | :--------------------- | :----------------------- | :------------------ |
| **Qdrant**         | Running in Docker      | **Disabled** (Not Found) | Running in Docker   |
| **AWS Bedrock**    | Accessible (with keys) | **Disabled** (No Keys)   | Accessible          |
| **Chat Feature**   | Full / Mock Mode       | **Mock / Hidden**        | **Full Activation** |
| **Error Handling** | Logs warnings          | Silent Fallback          | Alerts via Grafana  |

---

## Part 4: Budget & Longevity Estimate

| Item | Monthly Cost (Est.) | Status |
| :--- | :--- | :--- |
| **EC2 t3.medium** | ~$30.24 | Covered |
| **Public IPv4** | ~$3.66 | Covered |
| **EBS Storage (20GB)** | ~$1.92 | Covered |
| **Bedrock API** | ~$2.00 | Covered |
| **Total Monthly** | **~$37.82** | |
| **Credit Balance** | **$191.45** | |
| **Expiration Date** | **Nov 17, 2026** | **MATCHED** |

---

## Part 5: Migration Strategy (Post-Credits)
When credits expire in Nov 2026:
1.  **Switch VPS**: Move to a $10/mo provider.
2.  **Switch AI**: Change `provider.js` from `bedrock` to `openai` (GPT-4o-mini) or `groq` (Llama 3). 
3.  **No Code Change**: Because we used the Vercel AI SDK, your UI and API logic remain untouched.

---

## ⚠️ CRITICAL REMINDERS

### 1. Update Ansible Vault (Server Config)
Before running `make infra-provision`, you MUST update your encrypted secrets to ensure the production environment receives the new AI configuration.
- **Action**: Run `make vault-edit`
- **Fields to add/update**:
  - `AI_ENABLED: "true"`
  - `AWS_ACCESS_KEY_ID: "your_key_here"`
  - `AWS_SECRET_ACCESS_KEY: "your_secret_here"`
  - `QDRANT_URL: "http://ayosdocs-qdrant:6333"` (Internal Docker network address)

### 2. Update Local Environment Files
Ensure your `app/.env.local` (and other `.env` files) match the production logic. You need to add:
- `AI_ENABLED=true`
- `QDRANT_URL=http://localhost:6333`
- `AWS_REGION=ap-southeast-1`
- `AWS_ACCESS_KEY_ID=...`
- `AWS_SECRET_ACCESS_KEY=...`

### 3. Host Variables
When moving to production or staging, remember to update:
- **`NEXTAUTH_URL`**: Must match your final domain (e.g., `https://ayosdocs.com`) or the production IP. 
- **`NEXT_PUBLIC_APP_URL`**: For SEO and metadata generation.

### 5. AI Data Ingestion
After the infrastructure is ready and the Qdrant container is running, you MUST populate the vector database.
- **Action**: Run `node scripts/index-guides.js` to generate embeddings and sync your guides to Qdrant.
- **Makefile Update**: A new command `make ai-sync` should be added to the Makefile to simplify this process for future updates.

### 6. Google OAuth
Update your Google Cloud Console **Authorized Redirect URIs** to include your production domain, otherwise, login will fail on the new instance.
