# DISABLE terraform_documented_outputs: missing description
output "web_instance_id" {
  value = aws_instance.web.id
}

# ENABLED terraform_workspace_remote: terraform.workspace used with remote backend
output "workspace_name" {
  value = terraform.workspace
}
