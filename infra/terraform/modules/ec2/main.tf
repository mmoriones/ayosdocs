terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
    }
  }
}

data "aws_ami" "ubuntu" {
    most_recent = true
    filter {
      name = "name"
      values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-*-2*-amd64-server-*"]
    }
    owners = ["099720109477"]
}

resource "aws_instance" "app_server" {
    ami           = data.aws_ami.ubuntu.id
    instance_type = var.instance_type
    key_name      = var.ssh_key_name

    vpc_security_group_ids = var.security_group_id

    # Provision 2GB Swap for t3.micro stability
    user_data = <<-EOF
              #!/bin/bash
              fallocate -l 2G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
              EOF

    root_block_device {
        volume_size = 20
        volume_type = "gp3"
    }

    tags = {
        Name = "${var.project_name}-app-server"
    }
}