#!/bin/bash

# setup-local-env.sh
# This script generates the app/.env.local file by extracting the 
# vault_env_content variable from the Ansible Vault-encrypted secrets.yml file.

# Ensure we are in the project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Check if ansible-playbook is installed
if ! command -v ansible-playbook &> /dev/null; then
    echo "Error: ansible-playbook is not installed. Please install Ansible to proceed."
    exit 1
fi

SECRETS_FILE="infra/ansible/vars/secrets.yml"
PLAYBOOK_FILE="scripts/temp_setup_env.yml"

# Check if secrets file exists
if [ ! -f "$SECRETS_FILE" ]; then
    echo "Error: Secrets file not found at $SECRETS_FILE"
    exit 1
fi

echo "---
- hosts: localhost
  connection: local
  gather_facts: no
  vars_files:
    - ../$SECRETS_FILE
  tasks:
    - name: Generate .env.local from Ansible Vault
      copy:
        content: |
          {{ vault_local_host }}
          {{ vault_global_shared_env }}
          {{ vault_local_shared_env }}
          {{ vault_zoho_env }}
        dest: \"../app/.env.local\"
        mode: '0600'

    - name: Generate .env.tunnel from Ansible Vault
      copy:
        content: |
          {{ vault_tunnel_host }}
          {{ vault_global_shared_env }}
          {{ vault_local_shared_env }}
          {{ vault_zoho_env }}
        dest: \"../app/.env.tunnel\"
        mode: '0600'
" > "$PLAYBOOK_FILE"

echo "Attempting to extract secrets from $SECRETS_FILE..."
echo "You will be prompted for the Ansible Vault password."

# Run the playbook
ansible-playbook "$PLAYBOOK_FILE" --ask-vault-pass

# Capture the exit code
RESULT=$?

# Clean up
rm "$PLAYBOOK_FILE"

if [ $RESULT -eq 0 ]; then
    echo "---------------------------------------------------"
    echo "SUCCESS: app/.env.local and app/.env.tunnel have been generated."
    echo "---------------------------------------------------"
else
    echo "---------------------------------------------------"
    echo "FAILED: Could not generate environment files."
    echo "Please check your Vault password and try again."
    echo "---------------------------------------------------"
    exit $RESULT
fi
