provider "google" {
  project = "discord-bots-309621"
  region  = "us-east1"
  zone    = "us-east1-b"
}

terraform {
  backend "gcs" {
    bucket = "character-bot-tfstate"
    prefix = "character-bot"
  }
}
