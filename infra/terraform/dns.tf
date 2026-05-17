resource "cloudflare_record" "testing" {
  zone_id = var.cloudflare_zone_id
  name    = var.testing_subdomain
  content = aws_instance.app_server.public_ip
  type    = "A"
  proxied = true
}
