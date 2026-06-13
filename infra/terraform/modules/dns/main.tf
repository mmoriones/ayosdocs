terraform {
    required_providers {
      cloudflare = {
        source = "cloudflare/cloudflare"
      }
    }
}

resource "cloudflare_record" "admin" {
    zone_id = var.cloudflare_zone_id
    name    = var.management_subdomain
    content = var.aws_public_ip
    type    = "A"
    proxied = true
}

resource "cloudflare_record" "root" {
    zone_id = var.cloudflare_zone_id
    name    = "@"
    content = var.aws_public_ip
    type    = "A"
    proxied = true
}

resource "cloudflare_record" "www" {
    zone_id = var.cloudflare_zone_id
    name    = "www"
    content  = var.domain_name
    type    = "CNAME"
    proxied = true
}