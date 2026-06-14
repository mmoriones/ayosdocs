terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = "6.45.0"
    }
    cloudflare = {
        source = "cloudflare/cloudflare"
        version = "~> 4.0"
    }
    local = {
        source = "hashicorp/local"
        version = "~> 2.0"
    }
  }
}

provider "aws" {
    region = var.region
}

provider "cloudflare" {
    api_token = var.cloudflare_api_token
}


module "vpc" {
  source = "../modules/vpc"
  project_name = var.project_name
}

module "ec2" {
  source = "../modules/ec2"
  project_name = var.project_name
  security_group_id = module.vpc.web_sg_id
}

module "dns" {
  source = "../modules/dns"
  domain_name = var.domain_name
  cloudflare_zone_id = var.cloudflare_zone_id
  aws_public_ip = module.ec2.public_ip
}
