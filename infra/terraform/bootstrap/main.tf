terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
    }

    random = {
        source = "hashicorp/random"
    }
  }
}

provider "aws" {
    region = var.region
}

resource "random_id" "suffix" {
    byte_length = 8
}


resource "aws_s3_bucket" "ayosdocs-terraform-state" {
    bucket = "ayosdocs-terraform-state-${random_id.suffix.hex}"   
}

resource "aws_s3_bucket_versioning" "versioning" {
    bucket = aws_s3_bucket.ayosdocs-terraform-state.id
    versioning_configuration {
        status = "Enabled"
    }
}


resource "aws_s3_bucket_server_side_encryption_configuration" "sse" {
    bucket = aws_s3_bucket.ayosdocs-terraform-state.id

    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
      bucket_key_enabled = true
    }

}

resource "aws_dynamodb_table" "ayosdocs-dynamodb-table" {
    name = "ayosdocs-terraform-locks"
    billing_mode = "PAY_PER_REQUEST"
    hash_key = "LockID"

    attribute {
        name = "LockID"
        type = "S"
    }
}