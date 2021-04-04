resource "google_storage_bucket" "bucket" {
  name = "character-bot-static-content"
}

resource "google_storage_bucket_object" "object" {
  name   = "app.zip"
  bucket = google_storage_bucket.bucket.name
  source = "${path.module}/${var.app_file}"
}
