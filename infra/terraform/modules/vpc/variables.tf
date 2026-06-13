variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"] 
}