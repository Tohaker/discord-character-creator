data "google_project" "project" {
}

resource "google_app_engine_application" "app" {
  project     = data.google_project.project.project_id
  location_id = var.location


  database_type = "CLOUD_FIRESTORE"
}

resource "google_app_engine_standard_app_version" "app" {
  version_id = "v1"
  service    = "default"
  runtime    = "nodejs14"

  entrypoint {
    shell = "node ./src/index.js"
  }

  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${google_storage_bucket.bucket.name}/${google_storage_bucket_object.object.name}"
    }
  }

  env_variables = {
    "BOT_TOKEN" = var.bot_token
  }

  handlers {
    url_regex = "/"
    script {
      script_path = "auto"
    }
  }

  automatic_scaling {
    min_idle_instances = 1
    max_idle_instances = 1
    standard_scheduler_settings {
      min_instances = 1
      max_instances = 5
    }
  }
}

resource "google_cloud_scheduler_job" "job" {
  name             = "keep-alive-job"
  description      = "keeps the app engine alive"
  schedule         = "*/15 * * * *"
  time_zone        = "Europe/London"
  attempt_deadline = "320s"

  retry_config {
    retry_count = 1
  }

  app_engine_http_target {
    http_method  = "GET"
    relative_uri = "/"
  }
}
