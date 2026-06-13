variable "project_name" {
    description = "Project name for tagging"
    type        = string
    default     = "ayosdocs"
}

variable "domain_name" {
  description = "The main doamin name"
  type = string
  default = "ayosdocs.com"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1" # Singapore
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for ayosdocs.com"
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}