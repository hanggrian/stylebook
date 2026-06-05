# terraform_module_shallow_clone: pinned git module without ?depth=1
module "deep_clone" {
  source = "git::https://github.com/example/module.git?ref=v1.0.0"
}
