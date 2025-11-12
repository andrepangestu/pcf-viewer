# SSH Key & Droplet Access Setup for GitHub Actions CI/CD

1. **Generate SSH Key (if you don't have one):**

   - On your local machine, run:
     ```sh
     ssh-keygen -t ed25519 -C "github-action-deploy"
     ```
   - Save the key (e.g., as `~/.ssh/do_github_action`)

2. **Add Public Key to DigitalOcean Droplet:**

   - Copy the contents of `~/.ssh/do_github_action.pub`
   - SSH into your droplet and add the public key to `~/.ssh/authorized_keys`:
     ```sh
     echo "<paste-public-key-here>" >> ~/.ssh/authorized_keys
     chmod 600 ~/.ssh/authorized_keys
     ```

3. **Add Private Key to GitHub Secrets:**

   - Go to your GitHub repository > Settings > Secrets and variables > Actions > New repository secret
   - Name: `DO_SSH_KEY`
   - Value: Paste the contents of your private key file (e.g., `~/.ssh/do_github_action`)

4. **(Optional) Set up SSH config for easier access:**
   - You can add a config entry in `~/.ssh/config` for your droplet.

# Next Steps

- Continue to add other required secrets (see documentation).
- Push to `main` branch to trigger deployment.
