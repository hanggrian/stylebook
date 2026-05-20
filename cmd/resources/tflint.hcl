tflint {
  required_version = ">= 0.50"
}

config {
  format     = "compact"
  plugin_dir = "~/.tflint.d/plugins"

  call_module_type    = "local"
  force               = false
  disabled_by_default = false
}

plugin "terraform" {
  enabled = true
  preset  = "recommended"
}

rule "terraform_comment_syntax" {
  enabled = true
}

rule "terraform_naming_convention" {
  enabled = true
}

rule "terraform_standard_module_structure" {
  enabled = true
}
