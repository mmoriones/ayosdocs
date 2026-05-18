variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1" # Singapore
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for ayosdocs.com"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for Ubuntu 26.04 LTS (x86_64)"
  type        = string
  default     = "ami-0a59248a6294cece2" 
}

variable "domain_name" {
  description = "The main domain name"
  type        = string
  default     = "ayosdocs.com"
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "ayosdocs"
}

variable "management_subdomain" {
  description = "Subdomain for managing the VPS (Backdoor)"
  type        = string
  default     = "admin"
}

variable "ssh_key_name" {
  description = "Name of the existing AWS EC2 Key Pair"
  type        = string
  default     = "ayosdocs-key"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"] # change to private IP
}
