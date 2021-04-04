variable "location" {
  default = "us-east1"
}

variable "project_id" {
  default = "discord-bots-309621"
}

variable "app_file" {
  default = "app.zip"
}

variable "bootstrap_file" {
  default = "bootstrap.tpl"
}

variable "bot_token" {
  description = "Discord Bot token to pass to the bootstrap script"
}
