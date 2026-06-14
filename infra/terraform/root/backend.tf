terraform {
  backend "s3" {
    key = "ayosdocs/terraform.tfstate"
    region = "ap-southeast-1"
    use_lockfile = true
    encrypt = true
    # bucket = ""
  }
  
}