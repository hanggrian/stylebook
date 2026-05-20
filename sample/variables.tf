# DISABLED terraform_documented_variables: missing description
variable "region" {
  default = "us-east-1"
  type    = string
}

# ENABLED terraform_typed_variables: missing type
variable "region" {
  default = "us-east-1"
  type    = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

# ENABLED terraform_unused_declarations: declared but never used
variable "unused_var" { # tflint-ignore: terraform_unused_declarations
  description = "This variable is never referenced"
  type        = string
}
