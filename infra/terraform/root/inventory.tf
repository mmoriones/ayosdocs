resource "local_file" "ansible_inventory" {
    content = templatefile("${path.module}/templates/inventory.tftpl", {
        public_ip        = module.ec2.public_ip
        ansible_user     = "ubuntu"
        project_path     = "/home/ubuntu/ayosdocs"
        ssh_key_path     = "~/.ssh/ayosdocs-key.pem"
    })
    filename = "${path.module}/inventory.ini"
}
