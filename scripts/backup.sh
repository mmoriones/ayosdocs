#!/bin/sh

# Configuration
DB_NAME="ayosdocs"
BACKUP_NAME="${DB_NAME}_$(date +%Y%m%d_%H%M%S).gz"
BACKUP_PATH="/backups/${BACKUP_NAME}"
REMOTE_PATH="r2-backups:ayosdocs-backup"

echo "Starting backup: ${BACKUP_NAME}"

# 1. Run mongodump
# We use 'ayosdocs-db' as the host because it's the container name in our docker network
mongodump --host ayosdocs-db --db ${DB_NAME} --archive=${BACKUP_PATH} --gzip

if [ $? -eq 0 ]; then
    echo "Database dump successful."
    
    # 2. Upload to Cloudflare R2 via rclone
    echo "Uploading to R2..."
    rclone copy ${BACKUP_PATH} ${REMOTE_PATH}
    
    if [ $? -eq 0 ]; then
        echo "Upload successful."
        # Optional: Remove local backup after upload
        # rm ${BACKUP_PATH}
    else
        echo "Upload failed!"
        exit 1
    fi
else
    echo "Database dump failed!"
    exit 1
fi

echo "Backup process completed."
