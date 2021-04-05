resource "google_storage_bucket" "bucket" {
  name = "character-bot-static-content"
}

resource "google_storage_bucket_object" "object" {
  name   = "app.zip"
  bucket = google_storage_bucket.bucket.name
  source = "${path.module}/${var.app_file}"
}

resource "google_firestore_index" "index" {
  project = data.google_project.project.project_id

  collection = "characters"

  fields {
    field_path = "user"
    order      = "ASCENDING"
  }

  fields {
    field_path = "__name__"
    order      = "DESCENDING"
  }
}
