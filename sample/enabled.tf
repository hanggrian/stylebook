terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# terraform_unused_required_providers: aws provider declared but no resources use it after removal
terraform {
  required_providers {
    template = {
      source  = "hashicorp/template"
      version = "~> 2"
    }
  }
}

# terraform_comment_syntax: use # instead of //
# this is a comment

locals {
  # terraform_unused_declarations: declared but never used
  unused_local = "never used" # tflint-ignore: terraform_unused_declarations

  # terraform_deprecated_interpolation: 0.11-style interpolation
  bad_interpolation = var.environment # tflint-ignore: terraform_unused_declarations

  # terraform_deprecated_lookup: lookup() with only 2 arguments
  bad_lookup = { a = "b" }[a] # tflint-ignore: terraform_unused_declarations

  # terraform_empty_list_equality: compare with [] to check emptiness
  is_empty = length(var.instance_type) == 0 # tflint-ignore: terraform_unused_declarations

  # terraform_map_duplicate_keys: duplicate key "env"
  bad_map = { # tflint-ignore: terraform_unused_declarations
    env = "dev"
    env2 = "prod"
  }
}

resource "aws_instance" "web" {
  ami = "ami-0c55b159cbfafe1f0"

  # terraform_deprecated_index: legacy dot index syntax
  instance_type = var.instance_type[0]

  tags = {
    Name        = "web-${var.environment}"
    Environment = var.environment
  }
}

# terraform_module_pinned_source: git source without version pin
module "unpinned" {
  source = "git::https://github.com/example/module.git?ref=v1.2.0"
}

# terraform_module_version: registry module without version
module "no_version" {
  source  = "hashicorp/consul/aws"
  version = "1.0.0"
}

# terraform_required_version: caught if terraform block is removed above
terraform {
  required_version = ">= 1.0"
}

# terraform_required_providers: caught if required_providers block is removed above
# terraform_naming_convention: resource name should be snake_case not camelCase
resource "aws_instance" "my_web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}

# terraform_standard_module_structure: no variables.tf / outputs.tf / main.tf split
# (structural rule, cannot be demonstrated in a single file inline)
