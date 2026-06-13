variable "instance_type" {
    description = "EC2 instance type"
    type        = string
    default     = "t3.small"
}

variable "ssh_key_name" {
    description = "Name of the existing AWS EC2 Key Pair"
    type        = string
    default     = "ayosdocs-key"
}

variable "security_group_id" {
    description = "VPC security group ID"
    type        = list(string)
}

variable "project_name" {
    description = "Project name for tagging"
    type        = string
}