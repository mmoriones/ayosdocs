variable "domain_name" {
    description = "Domain name of the project"
    type = string
}

variable "cloudflare_zone_id" {
    description = "Cloudflare Zone ID for ayosdocs.com"
    type = string
}

variable "management_subdomain" {
    description = "Subdomain for managing the VPS (Backdoor)"
    type        = string
    default     = "admin"
}

variable "aws_public_ip" {
    description = "VPS public IP"
    type        = string
}
