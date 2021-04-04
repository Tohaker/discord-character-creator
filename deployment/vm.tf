resource "google_compute_instance" "vm_instance" {
  name         = "bot-server"
  machine_type = "f1-micro"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    network = "default"
    access_config {
    }
  }

  metadata_startup_script = templatefile("${path.module}/${var.bootstrap_file}", { token = var.bot_token })
}
