# Required GitHub Secrets for DigitalOcean CI/CD

Add these secrets in your GitHub repository (Settings > Secrets and variables > Actions > New repository secret):

- `DO_SSH_KEY` : Private SSH key for the droplet (see DEPLOY_SSH_SETUP.md)
- `DO_HOST` : Public IP address of your DigitalOcean droplet (e.g., 123.45.67.89)
- `DO_USER` : SSH username (usually `root` or your admin user)
- `DO_PORT` : SSH port (default: 22)
- `DO_TARGET_PATH` : Path on the droplet where files will be deployed (e.g., `/var/www/html/3d_viewer`)

**How to add:**

1. Go to your repository on GitHub.
2. Click Settings > Secrets and variables > Actions.
3. Click "New repository secret" for each variable above.

After all secrets are set, push to `main` to trigger deployment.
