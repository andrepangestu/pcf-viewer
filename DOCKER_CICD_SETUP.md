# Docker Registry Secrets for CI/CD

Tambahkan secrets berikut di GitHub repository (Settings > Secrets and variables > Actions):

- `DOCKER_USERNAME` : Username Docker Hub (atau registry lain)
- `DOCKER_PASSWORD` : Password atau Personal Access Token Docker Hub
- `DOCKER_IMAGE` : Nama image lengkap, misal `username/pcf-viewer:latest`
- `DO_SSH_KEY` : Private SSH key untuk akses droplet
- `DO_HOST` : IP publik droplet
- `DO_USER` : Username SSH (misal: root)
- `DO_PORT` : Port SSH (default: 22)

**Langkah:**

1. Buat akun Docker Hub jika belum ada.
2. Tambahkan secrets di atas ke repository GitHub Anda.
3. Pastikan Docker sudah terinstall di droplet.
4. Push ke branch `main` untuk memicu workflow.

Workflow akan build image, push ke registry, lalu droplet akan pull & run container baru secara otomatis.
