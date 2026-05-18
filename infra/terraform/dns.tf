resource "cloudflare_record" "admin" {
  zone_id = var.cloudflare_zone_id
  name    = var.management_subdomain
  content = aws_instance.app_server.public_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = aws_instance.app_server.public_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = "ayosdocs.com"
  type    = "CNAME"
  proxied = true
}
